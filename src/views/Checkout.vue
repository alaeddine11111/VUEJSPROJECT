<template>
  <div class="checkout container mt-4">
    <h1 class="text-center mb-4">Finaliser votre Commande</h1>
    
    <!-- Message de chargement -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <!-- Message si pas connecté -->
    <div v-else-if="!currentUser" class="text-center py-5">
      <div class="alert alert-warning">
        <h4>Vous devez être connecté pour passer une commande</h4>
        <router-link to="/login" class="btn btn-primary mt-3">Se connecter</router-link>
      </div>
    </div>
    
    <!-- Contenu principal -->
    <div v-else class="row">
      <div class="col-md-8">
        <!-- Panier -->
        <div class="card">
          <div class="card-header">
            <h5>Votre Commande</h5>
          </div>
          <div class="card-body">
            <!-- Panier vide -->
            <div v-if="localCart.length === 0" class="text-center py-4">
              <h5>Votre panier est vide</h5>
              <p class="text-muted">Ajoutez des produits pour continuer</p>
              <router-link to="/products" class="btn btn-primary mt-3">
                Voir les produits
              </router-link>
            </div>
            
            <!-- Liste des articles -->
            <div v-else>
              <div v-for="item in localCart" :key="item.id" class="order-item mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <img :src="item.image" :alt="item.name" class="order-item-img me-3" />
                    <div>
                      <h6 class="mb-0">{{ item.name }}</h6>
                      <small class="text-muted">
                        ${{ item.price }} × {{ item.quantity }}
                      </small>
                    </div>
                  </div>
                  <div class="text-end">
                    <strong>${{ (item.price * item.quantity).toFixed(2) }}</strong>
                  </div>
                </div>
              </div>
              
              <!-- Total -->
              <div class="total-section mt-4 p-3">
                <div class="d-flex justify-content-between mb-2">
                  <span>Sous-total:</span>
                  <span>${{ cartTotal.toFixed(2) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>TVA (19%):</span>
                  <span>${{ taxAmount.toFixed(2) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Livraison:</span>
                  <span class="text-success">Gratuite</span>
                </div>
                <hr />
                <div class="d-flex justify-content-between">
                  <strong>Total TTC:</strong>
                  <strong class="text-primary">${{ totalTTC.toFixed(2) }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Formulaire de livraison -->
        <div v-if="localCart.length > 0" class="card mt-4">
          <div class="card-header">
            <h5>Informations de Livraison</h5>
          </div>
          <div class="card-body">
            <!-- Infos utilisateur -->
            <div class="alert alert-info mb-4">
              <strong>👤 {{ currentUser.fullName }}</strong><br>
              📧 {{ currentUser.email }}
            </div>
            
            <!-- Formulaire -->
            <div class="mb-3">
              <label class="form-label">Adresse complète *</label>
              <textarea 
                v-model="orderInfo.address" 
                class="form-control" 
                rows="3" 
                placeholder="123 Rue de la Paix, Appartement 5B"
                required
              ></textarea>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Ville *</label>
                <input 
                  v-model="orderInfo.city" 
                  type="text" 
                  class="form-control" 
                  placeholder="Tunis"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Code postal *</label>
                <input 
                  v-model="orderInfo.postalCode" 
                  type="text" 
                  class="form-control" 
                  placeholder="1000"
                  required
                />
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Téléphone *</label>
              <input 
                v-model="orderInfo.phone" 
                type="tel" 
                class="form-control" 
                placeholder="+216 12 345 678"
                required
              />
            </div>
            
            <div class="mb-4">
              <label class="form-label">Instructions spéciales (optionnel)</label>
              <textarea 
                v-model="orderInfo.instructions" 
                class="form-control" 
                rows="2"
                placeholder="Ex: Sonnez à l'interphone, 3ème étage à gauche"
              ></textarea>
            </div>
            
            <!-- Bouton Commander -->
            <button 
              @click="processOrder" 
              class="btn btn-success btn-lg w-100"
              :disabled="!isFormValid || processing"
            >
              <span v-if="processing">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Traitement en cours...
              </span>
              <span v-else>
                ✅ Confirmer la commande (${{ totalTTC.toFixed(2) }})
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Résumé -->
      <div v-if="localCart.length > 0" class="col-md-4">
        <div class="card sticky-summary">
          <div class="card-header">
            <h5>Récapitulatif</h5>
          </div>
          <div class="card-body">
            <div class="summary-item">
              <span>Articles:</span>
              <strong>{{ totalQuantity }}</strong>
            </div>
            <div class="summary-item">
              <span>Sous-total:</span>
              <span>${{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="summary-item">
              <span>TVA (19%):</span>
              <span>${{ taxAmount.toFixed(2) }}</span>
            </div>
            <div class="summary-item">
              <span>Livraison:</span>
              <span class="text-success">Gratuite</span>
            </div>
            <hr />
            <div class="summary-item total">
              <strong>Total TTC:</strong>
              <strong class="text-primary">${{ totalTTC.toFixed(2) }}</strong>
            </div>
            
            <!-- Avantages -->
            <div class="mt-4 p-3 advantages">
              <div class="advantage-item">
                <strong>✓</strong> Paiement sécurisé
              </div>
              <div class="advantage-item">
                <strong>✓</strong> Livraison gratuite
              </div>
              <div class="advantage-item">
                <strong>✓</strong> Garantie 2 ans
              </div>
              <div class="advantage-item">
                <strong>✓</strong> Retour sous 14 jours
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutView',
  data() {
    return {
      loading: true,
      processing: false,
      currentUser: null,
      localCart: [],
      orderInfo: {
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        instructions: ''
      }
    }
  },
  computed: {
    cartTotal() {
      return this.localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    taxAmount() {
      return this.cartTotal * 0.19
    },
    totalTTC() {
      return this.cartTotal + this.taxAmount
    },
    totalQuantity() {
      return this.localCart.reduce((sum, item) => sum + item.quantity, 0)
    },
    isFormValid() {
      return this.orderInfo.address && 
             this.orderInfo.city && 
             this.orderInfo.postalCode && 
             this.orderInfo.phone
    }
  },
  methods: {
    loadData() {
      try {
        // Charger l'utilisateur
        const user = localStorage.getItem('techshop_current_user')
        if (!user || user === 'null') {
          this.$router.push('/login')
          return
        }
        this.currentUser = JSON.parse(user)
        
        // Charger le panier de l'utilisateur
        const cartKey = `techshop_cart_${this.currentUser.id}`
        const cart = localStorage.getItem(cartKey)
        
        if (cart && cart !== 'null') {
          this.localCart = JSON.parse(cart)
        } else {
          this.localCart = []
        }
        
        this.loading = false
      } catch (error) {
        console.error('Erreur de chargement:', error)
        alert('Erreur lors du chargement des données')
        this.$router.push('/')
      }
    },
    
    processOrder() {
      // Validation finale
      if (!this.isFormValid) {
        alert('⚠️ Veuillez remplir tous les champs obligatoires (marqués avec *)')
        return
      }
      
      if (this.localCart.length === 0) {
        alert('⚠️ Votre panier est vide')
        return
      }
      
      this.processing = true
      
      try {
        // Créer la commande
        const order = {
          id: Date.now(),
          userId: this.currentUser.id,
          userName: this.currentUser.fullName,
          userEmail: this.currentUser.email,
          items: JSON.parse(JSON.stringify(this.localCart)),
          total: parseFloat(this.cartTotal.toFixed(2)),
          totalTTC: parseFloat(this.totalTTC.toFixed(2)),
          deliveryInfo: JSON.parse(JSON.stringify(this.orderInfo)),
          status: 'En préparation',
          createdAt: new Date().toISOString()
        }
        
        // Sauvegarder la commande
        const orders = JSON.parse(localStorage.getItem('techshop_orders') || '[]')
        orders.push(order)
        localStorage.setItem('techshop_orders', JSON.stringify(orders))
        
        // Vider le panier
        localStorage.removeItem(`techshop_cart_${this.currentUser.id}`)
        
        // Message de succès
        alert(`✅ Commande confirmée !

📦 Numéro: #${order.id}
💰 Total: $${order.totalTTC}
📍 Livraison: ${this.orderInfo.address}, ${this.orderInfo.city}

Merci ${this.currentUser.fullName} pour votre achat !
Un email de confirmation a été envoyé à ${this.currentUser.email}`)
        
        // Redirection
        this.$router.push('/orders')
        
      } catch (error) {
        console.error('Erreur de commande:', error)
        alert('❌ Erreur lors de la création de la commande. Veuillez réessayer.')
        this.processing = false
      }
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>

<style scoped>
.checkout {
  min-height: 80vh;
  padding-bottom: 40px;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.25rem 1.5rem;
  border: none;
  border-radius: 15px 15px 0 0 !important;
}

.card-header h5 {
  margin: 0;
  font-weight: 600;
}

.order-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  transition: transform 0.2s;
}

.order-item:hover {
  transform: translateX(5px);
}

.order-item-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.total-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 12px 15px;
  transition: all 0.3s;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102,126,234,0.25);
}

.btn-success {
  background: linear-gradient(45deg, #28a745, #20c997);
  border: none;
  border-radius: 12px;
  padding: 15px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40,167,69,0.4);
}

.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
}

.sticky-summary {
  position: sticky;
  top: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.summary-item.total {
  font-size: 1.2rem;
}

.advantages {
  background: #f8f9fa;
  border-radius: 10px;
}

.advantage-item {
  padding: 8px 0;
  color: #28a745;
  font-size: 0.9rem;
}

.spinner-border {
  width: 1.2rem;
  height: 1.2rem;
}
</style>