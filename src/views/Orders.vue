<template>
  <div class="orders-page container py-5">
    <h1 class="text-center mb-4">📦 Mes Commandes</h1>
    
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="userOrders.length === 0" class="text-center py-5">
      <div class="empty-state">
        <h3>Aucune commande</h3>
        <p class="text-muted">Vous n'avez pas encore passé de commande</p>
        <router-link to="/products" class="btn btn-primary mt-3">
          Découvrir nos produits
        </router-link>
      </div>
    </div>
    
    <div v-else class="orders-list">
      <div v-for="order in userOrders" :key="order.id" class="order-card card mb-4">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-0">Commande #{{ order.id }}</h5>
              <small>{{ formatDate(order.createdAt) }}</small>
            </div>
            <div>
              <span class="badge" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <h6 class="mb-3">Articles commandés :</h6>
              <div v-for="item in order.items" :key="item.id" class="order-item mb-2">
                <div class="d-flex align-items-center">
                  <img :src="item.image" :alt="item.name" class="order-item-image me-3" />
                  <div class="flex-grow-1">
                    <h6 class="mb-0">{{ item.name }}</h6>
                    <small class="text-muted">Quantité: {{ item.quantity }} × ${{ item.price }}</small>
                  </div>
                  <div class="text-end">
                    <strong>${{ item.price * item.quantity }}</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="order-summary">
                <h6 class="mb-3">Livraison</h6>
                <p class="mb-1">
                  <strong>{{ order.userName }}</strong><br>
                  {{ order.deliveryInfo.address }}<br>
                  {{ order.deliveryInfo.city }}, {{ order.deliveryInfo.postalCode }}<br>
                  📞 {{ order.deliveryInfo.phone }}
                </p>
                
                <div v-if="order.deliveryInfo.instructions" class="alert alert-info mt-2">
                  <small>📝 {{ order.deliveryInfo.instructions }}</small>
                </div>
                
                <hr />
                
                <div class="d-flex justify-content-between mb-2">
                  <span>Sous-total:</span>
                  <span>${{ order.total }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>TVA (19%):</span>
                  <span>${{ (order.total * 0.19).toFixed(2) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Livraison:</span>
                  <span class="text-success">Gratuite</span>
                </div>
                <hr />
                <div class="d-flex justify-content-between">
                  <strong>Total TTC:</strong>
                  <strong class="text-primary">${{ order.totalTTC }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <button @click="viewOrderDetails(order)" class="btn btn-sm btn-outline-primary me-2">
            👁️ Détails
          </button>
          <button v-if="order.status === 'Livrée'" @click="reorder(order)" class="btn btn-sm btn-success">
            🔄 Recommander
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal détails commande -->
    <div v-if="showModal && selectedOrder" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Détails de la commande #{{ selectedOrder.id }}</h5>
          <button @click="showModal = false" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <strong>Statut:</strong>
            <span class="badge ms-2" :class="getStatusClass(selectedOrder.status)">
              {{ selectedOrder.status }}
            </span>
          </div>
          <div class="mb-3">
            <strong>Date de commande:</strong> {{ formatDate(selectedOrder.createdAt) }}
          </div>
          <div class="mb-3">
            <strong>Montant total:</strong> ${{ selectedOrder.totalTTC }}
          </div>
          <div class="mb-3">
            <strong>Email de confirmation:</strong> {{ selectedOrder.userEmail }}
          </div>
          
          <hr />
          
          <h6>Suivi de commande</h6>
          <div class="tracking">
            <div class="tracking-step completed">
              ✓ Commande passée
              <small>{{ formatDate(selectedOrder.createdAt) }}</small>
            </div>
            <div class="tracking-step" :class="{ completed: ['En préparation', 'Expédiée', 'Livrée'].includes(selectedOrder.status) }">
              {{ ['En préparation', 'Expédiée', 'Livrée'].includes(selectedOrder.status) ? '✓' : '○' }} En préparation
            </div>
            <div class="tracking-step" :class="{ completed: ['Expédiée', 'Livrée'].includes(selectedOrder.status) }">
              {{ ['Expédiée', 'Livrée'].includes(selectedOrder.status) ? '✓' : '○' }} Expédiée
            </div>
            <div class="tracking-step" :class="{ completed: selectedOrder.status === 'Livrée' }">
              {{ selectedOrder.status === 'Livrée' ? '✓' : '○' }} Livrée
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showModal = false" class="btn btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrdersView',
  data() {
    return {
      currentUser: null,
      userOrders: [],
      loading: true,
      showModal: false,
      selectedOrder: null
    }
  },
  methods: {
    loadCurrentUser() {
      const user = JSON.parse(localStorage.getItem('techshop_current_user') || 'null')
      if (!user) {
        this.$router.push('/login')
        return
      }
      this.currentUser = user
      this.loadOrders()
    },
    
    loadOrders() {
      this.loading = true
      
      // Récupérer toutes les commandes
      const allOrders = JSON.parse(localStorage.getItem('techshop_orders') || '[]')
      
      // Filtrer les commandes de l'utilisateur connecté
      this.userOrders = allOrders
        .filter(order => order.userId === this.currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      this.loading = false
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    getStatusClass(status) {
      const statusClasses = {
        'En préparation': 'bg-warning',
        'Expédiée': 'bg-info',
        'Livrée': 'bg-success',
        'Annulée': 'bg-danger'
      }
      return statusClasses[status] || 'bg-secondary'
    },
    
    viewOrderDetails(order) {
      this.selectedOrder = order
      this.showModal = true
    },
    
    reorder() {
      if (confirm('Voulez-vous ajouter à nouveau ces articles à votre panier ?')) {
        // Ici, vous pouvez émettre un événement pour ajouter les articles au panier
        alert('Fonctionnalité à implémenter : ajouter les articles au panier')
      }
    }
  },
  mounted() {
    this.loadCurrentUser()
  }
}
</script>

<style scoped>
.orders-page {
  min-height: 80vh;
}

.order-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border: none;
}

.card-header h5 {
  margin: 0;
  font-weight: 600;
}

.badge {
  font-size: 0.85rem;
  padding: 8px 15px;
  border-radius: 20px;
}

.order-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.order-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.order-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.card-footer {
  background: white;
  border-top: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

.empty-state {
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 15px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h5 {
  margin: 0;
  font-weight: 700;
}

.btn-close {
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
}

/* Tracking */
.tracking {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tracking-step {
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #dee2e6;
  transition: all 0.3s ease;
}

.tracking-step.completed {
  background: #d4edda;
  border-left-color: #28a745;
  color: #155724;
  font-weight: 600;
}

.tracking-step small {
  display: block;
  margin-top: 5px;
  font-size: 0.85rem;
  color: #6c757d;
}

.btn {
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.alert-info {
  background: #d1ecf1;
  border: none;
  border-radius: 8px;
  padding: 10px;
}
</style>