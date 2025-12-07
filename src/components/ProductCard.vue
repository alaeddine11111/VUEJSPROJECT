<template>
    <div class="product-card card h-100 shadow-sm">
        <img :src="product.image" :alt="product.name" class="card-img-top product-image">
        <div class="stock-badge">
            <span v-if="product.inStock" class="badge bg-success">En Stock</span>
            <span v-else class="badge bg-danger">Rupture</span>
        </div>
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text text-muted small">{{ product.description }}</p>
            <div class="price-section mt-auto">
                <h4 class="text-primary">$ {{ product.price }}</h4>
                <button @click="addToCart" :disabled="!product.inStock" class="btn btn-primary w-100 mt-2" :class="{'btn-success': product.inStock, 'btn-secondary': !product.inStock}">{{ product.inStock ? 'Ajouter au panier' : 'Rupture de stock' }}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'ProductCard',
    props: {
        product:{
            type: Object,
            required: true
        }
    },
    methods: {
        addToCart(){
            if (this.product.inStock) {
                this.$emit('add-to-cart',this.product)
            }
        }
    }
}
</script>

<style scoped>
.product-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  border-radius: 15px;
  overflow: hidden;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
}

.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
}

.product-image {
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.stock-badge {
  position: absolute;
  top: 15px;
  right: 15px;
}

.stock-badge .badge {
  font-size: 0.75rem;
  padding: 8px 12px;
  border-radius: 25px;
}

.card-body {
  padding: 1.5rem;
  background: white;
}

.price-section {
  border-top: 1px solid #e9ecef;
  padding-top: 1.25rem;
}

.btn-primary {
  background: linear-gradient(45deg, #007bff, #0056b3);
  border: none;
  border-radius: 25px;
  padding: 12px 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,123,255,0.4);
}

.btn-success {
  background: linear-gradient(45deg, #28a745, #20c997);
  border: none;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40,167,69,0.4);
}
</style>