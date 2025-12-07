<template>
    <header>
        <!-- Barre de navigation principale -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <!-- Logo + Titre avec lien vers l'accueil -->
                <router-link to="/" class="navbar-brand d-flex align-items-center">
                    <!-- VOTRE LOGO ICI -->
                    <img 
                        src="@/assets/logo.png" 
                        alt="TechShop Logo" 
                        class="logo"
                    />
                    <!-- Titre du site -->
                    <span class="site-title ms-3">TechShop</span>
                </router-link>
                
                <!-- Menu de navigation -->
                <div class="navbar-nav me-auto ms-4">
                    <router-link to="/" class="nav-link">
                        <i class="bi bi-house-door me-1"></i>
                        Accueil
                    </router-link>
                    <router-link to="/products" class="nav-link">
                        <i class="bi bi-grid me-1"></i>
                        Produits
                    </router-link>
                </div>
                
                <!-- Section utilisateur et panier -->
                <div class="d-flex align-items-center">
                    <!-- Menu utilisateur -->
                    <div v-if="isLoggedIn" class="user-menu me-3">
                        <div class="dropdown">
                            <button class="btn btn-outline-light dropdown-toggle" type="button" @click="toggleUserMenu">
                                <i class="bi bi-person-circle me-2"></i>
                                {{ currentUser.fullName }}
                            </button>
                            <div v-if="showUserMenu" class="dropdown-menu-custom show">
                                <router-link to="/profile" class="dropdown-item" @click="showUserMenu = false">
                                    <i class="bi bi-person me-2"></i>
                                    Mon profil
                                </router-link>
                                <router-link to="/orders" class="dropdown-item" @click="showUserMenu = false">
                                    <i class="bi bi-box-seam me-2"></i>
                                    Mes commandes
                                </router-link>
                                <div class="dropdown-divider"></div>
                                <button @click="handleLogout" class="dropdown-item text-danger">
                                    <i class="bi bi-box-arrow-right me-2"></i>
                                    Se déconnecter
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Bouton connexion si non connecté -->
                    <router-link v-else to="/login" class="btn btn-outline-light me-3">
                        <i class="bi bi-lock me-2"></i>
                        Connexion
                    </router-link>
                    
                    <!-- Panier -->
                    <button class="btn btn-outline-light position-relative cart-button" @click="toggleCart">
                        <i class="bi bi-cart3"></i>
                        <span class="cart-text ms-2">Panier</span>
                        <span v-if="cart.length > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {{ cartTotalQuantity }}
                        </span>
                    </button>
                </div>
            </div>
        </nav>
        
        <!-- Dropdown du panier -->
        <div v-if="showCart" class="cart-dropdown">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-cart3 me-2"></i>
                        Votre panier
                    </h5>
                    <button @click="toggleCart" class="btn btn-sm btn-outline-danger">&times;</button>
                </div>
                
                <div class="card-body">
                    <div v-if="cart.length === 0" class="text-center py-4">
                        <i class="bi bi-cart-x text-muted" style="font-size: 3rem;"></i>
                        <p class="text-muted mt-3">Votre panier est vide</p>
                    </div>
                    
                    <div v-else>
                        <div v-for="item in cart" :key="item.id" class="cart-item mb-2 p-2 border-bottom">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <img :src="item.image" :alt="item.name" class="cart-item-img me-2" />
                                    <div>
                                        <h6 class="mb-0" style="font-size: 0.9rem;">{{ item.name }}</h6>
                                        <small class="text-muted">${{ item.price }} × {{ item.quantity }}</small>
                                    </div>
                                </div>
                                <button @click="$emit('remove-from-cart',item.id)" class="btn btn-sm btn-outline-danger">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="text-end mt-3 pt-3 border-top">
                            <strong>Total: ${{ cartTotalPrice }}</strong>
                        </div>
                        
                        <router-link to="/checkout" class="btn btn-primary w-100 mt-2" @click="toggleCart">
                            <i class="bi bi-credit-card me-2"></i>
                            Commander
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default{
    name: 'AppHeader',
    props:{
        cart:{
            type: Array,
            required: true,
            default:()=>[]
        }
    },
    data(){
        return {
            showCart: false,
            showUserMenu: false,
            currentUser: null
        }
    },
    computed:{
        isLoggedIn() {
            return this.currentUser !== null
        },
        cartTotalQuantity(){
            return this.cart.reduce((total,item)=> total + item.quantity,0) || 0
        },
        cartTotalPrice(){
            return this.cart.reduce((total,item) => total + (item.price * item.quantity),0) || 0
        }
    },
    methods: {
        toggleCart(){
            this.showCart = !this.showCart
            this.showUserMenu = false
        },
        toggleUserMenu(){
            this.showUserMenu = !this.showUserMenu
            this.showCart = false
        },
        loadCurrentUser() {
            const user = JSON.parse(localStorage.getItem('techshop_current_user') || 'null')
            this.currentUser = user
        },
        handleLogout() {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                localStorage.removeItem('techshop_current_user')
                this.currentUser = null
                this.showUserMenu = false
                this.$router.push('/login')
                window.location.reload()
            }
        },
        handleClickOutside(event) {
            if (!event.target.closest('.user-menu') && !event.target.closest('.cart-dropdown')) {
                this.showUserMenu = false
            }
        }
    },
    mounted() {
        this.loadCurrentUser()
        document.addEventListener('click', this.handleClickOutside)
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside)
    },
    watch: {
        '$route'() {
            this.loadCurrentUser()
        }
    }
}
</script>

<style scoped>
/* ===================================
   NAVBAR PRINCIPAL
=================================== */
.navbar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  padding: 0.75rem 0;
}

/* ===================================
   LOGO + TITRE
=================================== */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.25rem 0;
  transition: all 0.3s ease;
  text-decoration: none;
}

.navbar-brand:hover {
  transform: translateY(-2px);
}

.logo {
  height: 60px; /* Taille du logo */
  width: auto;
  object-fit: contain;
  transition: all 0.3s ease;
  background: transparent; /* Pas d'arrière-plan */
  border-radius: 8px; /* Coins arrondis légers */
  padding: 2px; /* Petit espace autour du logo */
}

.navbar-brand:hover .logo {
  transform: scale(1.05);
}

.site-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #00d4ff;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 10px rgba(0, 212, 255, 0.3);
  transition: all 0.3s ease;
}

.navbar-brand:hover .site-title {
  color: #00b8e6;
  text-shadow: 0 4px 15px rgba(0, 212, 255, 0.5);
}

/* ===================================
   NAVIGATION LINKS
=================================== */
.nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: rgba(255,255,255,0.9) !important;
}

.nav-link:hover {
  background: rgba(0, 212, 255, 0.1);
  color: #00d4ff !important;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: rgba(0, 212, 255, 0.15);
  color: #00d4ff !important;
}

/* ===================================
   BOUTONS
=================================== */
.btn-outline-light {
  border: 2px solid rgba(255,255,255,0.3);
  transition: all 0.3s ease;
  font-weight: 600;
  border-radius: 10px;
  padding: 0.5rem 1.2rem;
}

.btn-outline-light:hover {
  background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 212, 255, 0.4);
}

.cart-button {
  display: flex;
  align-items: center;
}

.cart-text {
  display: inline;
}

@media (max-width: 768px) {
  .cart-text {
    display: none;
  }
  
  .logo {
    height: 40px;
  }
}

/* ===================================
   BADGE PANIER
=================================== */
.badge {
  font-size: 0.7rem;
  padding: 0.3rem 0.5rem;
  font-weight: 700;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* ===================================
   USER MENU DROPDOWN
=================================== */
.user-menu {
  position: relative;
}

.dropdown-menu-custom {
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  min-width: 220px;
  padding: 0.5rem 0;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-weight: 500;
}

.dropdown-item:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #0099ff;
  padding-left: 1.75rem;
}

.dropdown-divider {
  height: 1px;
  background: #e9ecef;
  margin: 0.5rem 0;
}

/* ===================================
   CART DROPDOWN
=================================== */
.cart-dropdown {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 400px;
  z-index: 9999;
  animation: slideDown 0.3s ease;
}

@media (max-width: 768px) {
  .cart-dropdown {
    width: calc(100vw - 40px);
    right: 20px;
    left: 20px;
  }
}

.cart-dropdown .card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.4);
  max-height: 80vh;
  overflow-y: auto;
}

.cart-dropdown .card-header {
  background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
  color: white;
  padding: 1.25rem 1.5rem;
  border: none;
  border-radius: 15px 15px 0 0 !important;
}

.cart-item {
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.cart-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.cart-item-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
}

.btn-primary {
  background: linear-gradient(45deg, #00d4ff, #0099ff);
  border: none;
  border-radius: 10px;
  padding: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 153, 255, 0.4);
}

/* ===================================
   ICONS
=================================== */
.bi {
  font-size: 1.1rem;
}
</style>