<template>
  <div class="home">
    <section class="hero-section bg-primary text-white py-5 mb-5">
      <div class="container text-center">
        <h1 class="display-4 fw-bold">Bienvenue sur TechShop</h1>
        <p class="lead">Votre boutique tech préférée - Les meilleurs prix sur les smartphones, ordinateurs et accessoires</p>
        <router-link to="/products" class="btn btn-light btn-lg mt-3">Découvrir nos produits</router-link>
      </div>
    </section>
    <section class="featured-products">
      <div class="container">
        <h2 class="text-center mb-4">Produits en Vedette</h2>
        <div v-if="!products || products.length === 0" class="text-center">
          <p>Aucun produit disponible pour le moment.</p>
        </div>
        <div v-else class="row">
          <div v-for="product in featuredProducts" :key="product.id" class="col-md-4 mb-4">
            <ProductCard :product="product" @add-to-cart="$emit('add-to-cart',product)" />
          </div>
        </div>
        <div class="text-center mt-4">
          <router-link to="/products" class="btn btn-outline-primary">
            Voir tous les produits →
          </router-link>
        </div>
      </div>
    </section>
    <section class="advantages bg-light py-5 mt-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-4">
            <div class="advantage-item">
              <h3>Livraison Rapide</h3>
              <p>Livraison gratuite en 24-48h</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="advantage-item">
              <h3>Garantie 2 Ans</h3>
              <p>Tous nos produits sont garantis</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="advantage-item">
              <h3>Paiement Sécurisé</h3>
              <p>Paiement 100% sécurisé</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue'
export default{
  name:'HomeView',
  components:{
    ProductCard
  },
  props:{
    products:{
      type:Array,
      required: true
    }
  },computed:{
    featuredProducts(){
      return this.products.slice(0,3)
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 50% 50% / 0 0 100px 100px;
  padding: 80px 0;
}

.hero-section h1 {
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.hero-section .btn-light {
  border-radius: 25px;
  padding: 12px 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.hero-section .btn-light:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255,255,255,0.3);
}

.advantage-item {
  padding: 30px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  margin: 10px;
}

.advantage-item:hover {
  transform: translateY(-5px);
}

.advantage-item h3 {
  color: #333;
  margin-bottom: 15px;
  font-weight: 700;
}

.featured-products .btn-outline-primary {
  border-radius: 25px;
  padding: 10px 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.featured-products .btn-outline-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,123,255,0.3);
}
</style>