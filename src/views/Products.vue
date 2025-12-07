<template>
    <div class="products-page">
        <div class="container">
            <div class="row mb-4">
                <div class="col">
                    <h1>Tous nos produits</h1>
                    <p class="text-muted">Découvrez notre sélection de produits tech</p>
                </div>
                <div class="col-auto">
                    <span class="badge bg-primary fs-6">
                        {{ filteredProducts.length }} produit(s)
                    </span>
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="input-group">
                        <span class="input-group-text">🔍</span>
                        <input type="text" v-model="searchQuery" placeholder="Rechercher un produit..." class="form-control">
                    </div>
                </div>
                <div class="col-md-6">
                    <select v-model="selectedCategory" class="form-select">
                        <option value="">Toutes les catégories</option>
                        <option value="phones">Smartphones</option>
                        <option value="laptops">Ordinateurs</option>
                        <option value="accessories">Accessoires</option>
                    </select>
                </div>
            </div>
            <div v-if="filteredProducts.length > 0" class="row">
                <div v-for="product in filteredProducts" :key="product.id" class="col-lg-4 col-md-6 mb-4">
                    <ProductCard :product="product" @add-to-cart="$emit('add-to-cart',product)"/>
                </div>
            </div>
            <div v-else class="text-center py-5">
                <h3>Aucun produit trouvé</h3>
                <p class="text-muted">Essayez de modifier vos critères de recherche</p>
                <button @click="clearFilters" class="btn btn-primary">Réinitialiser les filtres</button>
            </div>
        </div>
    </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue'
export default {
    name : 'ProductsView',
    components : {
        ProductCard
    },
    props:{
        products : {
            type: Array,required: true
        }
    },
    data(){
        return {
            searchQuery:'',selectedCategory:''
        }
    },
    computed:{
        filteredProducts(){
            let filtered = this.products
            if (this.searchQuery) {
                filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
            }
            if (this.selectedCategory) {
                filtered = filtered.filter(product =>
                product.category === this.selectedCategory)
            }
            return filtered
        }
    },
    methods: {
        clearFilters(){
            this.searchQuery=''
            this.selectedCategory= ''
        }
    }
}
</script>

<style scoped>
.products-page {
  min-height: 70vh;
}

.input-group-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px 0 0 10px;
}

.form-control, .form-select {
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 12px 15px;
  transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

.badge {
  font-size: 1rem;
  padding: 10px 20px;
  border-radius: 25px;
  background: linear-gradient(45deg, #007bff, #0056b3);
}

.btn-primary {
  border-radius: 25px;
  padding: 12px 30px;
  font-weight: 600;
  background: linear-gradient(45deg, #007bff, #0056b3);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,123,255,0.4);
}
</style>