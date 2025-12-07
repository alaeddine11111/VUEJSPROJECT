<template>
  <div class="app">
    <Header :cart="cart" @remove-from-cart="removeFromCart" />
    <main class="container mt-4">
      <router-view :products="products" :cart="cart" @add-to-cart="addToCart" />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default{
  name: 'APP',
  components: {
    Header,
    Footer
  },
  data(){
    return {
      products: [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        price: 999,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop',
        category: 'phones',
        description: 'Le dernier smartphone Apple',
        inStock: true
      },
      {
        id: 2,
        name: 'MacBook Pro',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
        category: 'laptops',
        description: 'Ordinateur portable professionnel',
        inStock: true
      },
      {
        id: 3,
        name: 'AirPods Pro',
        price: 199,
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&h=500&fit=crop',
        category: 'accessories',
        description: 'Écouteurs sans fil',
        inStock: false
      }, 
      {
        id: 4,
        name: 'Samsung Galaxy S24',
        price: 899,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
        category: 'phones',
        description: 'Smartphone Android flagship',
        inStock: true
      },
      {
        id: 5,
        name: 'iPad Pro',
        price: 1099,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
        category: 'tablets',
        description: 'Tablette professionnelle',
        inStock: true
      },
      {
        id: 6,
        name: 'Apple Watch',
        price: 399,
        image: 'https://tse2.mm.bing.net/th/id/OIP.mAJ7J9QJXSx1a4VPJx3JGQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'accessories',
        description: 'Montre connectée',
        inStock: true
      },
      {
        id: 7,
        name: 'PlayStation 5',
        price: 499,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop',
        category: 'gaming',
        description: 'Console de jeu nouvelle génération',
        inStock: true
      },
      {
        id: 8,
        name: 'Xbox Series X',
        price: 499,
        image: 'https://tse2.mm.bing.net/th/id/OIP.xdDxVtikwxvByq9WtwqlGwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'gaming',
        description: 'Console de jeu ultra-rapide',
        inStock: true
      },
      {
        id: 9,
        name: 'MacBook Air',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop',
        category: 'laptops',
        description: 'Ordinateur portable léger et performant',
        inStock: true
      },
      {
        id: 10,
        name: 'Samsung Galaxy Tab',
        price: 649,
        image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop',
        category: 'tablets',
        description: 'Tablette Android polyvalente',
        inStock: false
      },
      {
        id: 11,
        name: 'Google Pixel 8',
        price: 699,
        image: 'https://www.stuff.tv/wp-content/uploads/sites/2/2024/05/Google-Pixel-8a-Stuff-Review-9.jpg?resize=825',
        category: 'phones',
        description: 'Smartphone Android avec appareil photo avancé',
        inStock: true
      },
      {
        id: 12,
        name: 'AirPods Max',
        price: 549,
        image: 'https://tse3.mm.bing.net/th/id/OIP.2ZU1LjZj5YAjFVMMRlURjwHaFj?rs=1&pid=ImgDetMain&o=7&rm=3',
        category: 'accessories',
        description: 'Casque audio haute fidélité',
        inStock: true
      },
      {
        id: 13,
        name: 'Magic Keyboard',
        price: 299,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop',
        category: 'accessories',
        description: 'Clavier sans fil avec trackpad',
        inStock: true
      },
      {
        id: 14,
        name: 'Dell XPS 13',
        price: 999,
        image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&h=500&fit=crop',
        category: 'laptops',
        description: 'PC portable ultra-fin',
        inStock: true
      },
      {
        id: 15,
        name: 'Nintendo Switch',
        price: 299,
        image: 'https://cdn.wccftech.com/wp-content/uploads/2023/08/Nintendo-Switch-OLED-Red-Edition-1-scaled.jpg',
        category: 'gaming',
        description: 'Console de jeu hybride',
        inStock: true
      },
      {
        id: 16,
        name: 'iPhone 14',
        price: 799,
        image: 'https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?w=500&h=500&fit=crop',
        category: 'phones',
        description: 'Smartphone Apple performant',
        inStock: true
      },
      {
        id: 17,
        name: 'Samsung Galaxy Z Flip',
        price: 999,
        image: 'https://th.bing.com/th/id/R.ddc2d3fc09cd075123f7778f7c588f67?rik=%2f%2bhn1E%2bO%2b76xEA&pid=ImgRaw&r=0',
        category: 'phones',
        description: 'Smartphone pliable innovant',
        inStock: true
      },
      {
        id: 18,
        name: 'Microsoft Surface Laptop',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
        category: 'laptops',
        description: 'PC portable élégant et puissant',
        inStock: true
      },
      {
        id: 19,
        name: 'iPad Air',
        price: 599,
        image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&h=500&fit=crop',
        category: 'tablets',
        description: 'Tablette légère et performante',
        inStock: true
      },
      {
        id: 20,
        name: 'Sony WH-1000XM5',
        price: 349,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop',
        category: 'accessories',
        description: 'Casque antibruit haute qualité',
        inStock: true
      },
      {
        id: 21,
        name: 'Gaming PC RTX 4080',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=500&fit=crop',
        category: 'gaming',
        description: 'PC gaming ultime pour joueurs exigeants',
        inStock: true
      },
      {
        id: 22,
        name: 'OnePlus 12',
        price: 799,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
        category: 'phones',
        description: 'Smartphone Android rapide et fluide',
        inStock: false
      },
      {
        id: 23,
        name: 'HP Spectre x360',
        price: 1399,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
        category: 'laptops',
        description: 'PC convertible haut de gamme',
        inStock: true
      },
      {
        id: 24,
        name: 'Lenovo ThinkPad',
        price: 1199,
        image: 'https://techtoday.lenovo.com/origind8/sites/default/files/styles/original/public/2021-02/img-purposeful.jpg?itok=TLvVNvgB',
        category: 'laptops',
        description: 'Ordinateur professionnel robuste',
        inStock: true
      },
      {
        id: 25,
        name: 'Meta Quest 3',
        price: 499,
        image: 'https://cdn.mos.cms.futurecdn.net/usfFVPckqWfQCKnT6ePtt6.jpg',
        category: 'gaming',
        description: 'Casque de réalité virtuelle',
        inStock: true
      },
      {
        id: 26,
        name: 'Apple Pencil',
        price: 129,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
        category: 'accessories',
        description: 'Stylet pour iPad',
        inStock: true
      },
      {
        id: 27,
        name: 'Samsung Galaxy Watch',
        price: 279,
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop',
        category: 'accessories',
        description: 'Montre connectée Android',
        inStock: true
      },
      {
        id: 28,
        name: 'Google Nest Hub',
        price: 89,
        image: 'https://static1.howtogeekimages.com/wordpress/wp-content/uploads/2023/05/52843285344_95279cb733_o.jpg',
        category: 'smart-home',
        description: 'Enceinte connectée avec écran',
        inStock: true
      },
      {
        id: 29,
        name: 'Amazon Echo Dot',
        price: 49,
        image: 'https://th.bing.com/th/id/R.5f0e157e8d2a693a2db575c968eae6ef?rik=l486sLeQhHUH0Q&pid=ImgRaw&r=0',
        category: 'smart-home',
        description: 'Enceinte intelligente compacte',
        inStock: true
      },
      {
        id: 30,
        name: 'Razer Gaming Mouse',
        price: 79,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
        category: 'gaming',
        description: 'Souris gaming précise',
        inStock: true
      }
    ],
      cart: []
    }
  },
  
  methods: {
    addToCart(product) {
      const existingItem = this.cart.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.cart.push({...product, quantity: 1})
      }
      // Sauvegarder le panier après chaque modification
      this.saveCart()
    },
    
    removeFromCart(productID){
      this.cart = this.cart.filter(item => item.id !== productID)
      // Sauvegarder le panier après suppression
      this.saveCart()
    },
    
    // Sauvegarder le panier dans localStorage
    saveCart() {
      const currentUser = JSON.parse(localStorage.getItem('techshop_current_user') || 'null')
      
      if (currentUser) {
        // Sauvegarder le panier spécifique à cet utilisateur
        localStorage.setItem(`techshop_cart_${currentUser.id}`, JSON.stringify(this.cart))
      } else {
        // Si pas connecté, sauvegarder dans un panier temporaire
        localStorage.setItem('techshop_cart_guest', JSON.stringify(this.cart))
      }
    },
    
    // Charger le panier depuis localStorage
    loadCart() {
      const currentUser = JSON.parse(localStorage.getItem('techshop_current_user') || 'null')
      
      if (currentUser) {
        // Charger le panier de l'utilisateur connecté
        const userCart = localStorage.getItem(`techshop_cart_${currentUser.id}`)
        if (userCart) {
          this.cart = JSON.parse(userCart)
        } else {
          this.cart = []
        }
      } else {
        // Si pas connecté, charger le panier invité
        const guestCart = localStorage.getItem('techshop_cart_guest')
        if (guestCart) {
          this.cart = JSON.parse(guestCart)
        } else {
          this.cart = []
        }
      }
    },
    
    // Vider le panier (après une commande par exemple)
    clearCart() {
      this.cart = []
      this.saveCart()
    }
  },
  
  mounted() {
    // Charger le panier au démarrage
    this.loadCart()
    
    // Écouter les changements de connexion/déconnexion
    window.addEventListener('storage', (e) => {
      if (e.key === 'techshop_current_user') {
        this.loadCart()
      }
    })
  },
  
  watch: {
    // Recharger le panier quand la route change (ex: après connexion)
    '$route'() {
      this.loadCart()
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

:root {
  --bg-color: #f8f9fa;
  --primary-color: #0a84ff;
  --secondary-color: #5a5f73;
  --text-color: #333333;
  --text-muted-color: #6c757d;
  --card-bg-color: #ffffff;
  --border-color: #dee2e6;
  --input-bg-color: #ffffff;
  --input-border-color: #ced4da;
  --button-bg-color: var(--primary-color);
  --button-hover-bg-color: #0066ff;
  --button-text-color: #ffffff;
}

body {
  font-family: 'Inter', 'Arial', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main.container {
  flex: 1;
  padding: 2rem 1rem;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  color: var(--button-hover-bg-color);
  text-decoration: underline;
}

/* Styles globaux améliorés */
.card {
  border: none;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.btn {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.badge {
  font-weight: 600;
}
</style>