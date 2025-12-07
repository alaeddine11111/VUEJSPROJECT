// src/services/productService.js
import api from './api'

const productService = {
  /**
   * Récupérer tous les produits
   * @param {Object} filters - {category, search, inStock}
   * @returns {Promise<Array>}
   */
  async getAllProducts(filters = {}) {
    try {
      const response = await api.get('/products', { params: filters })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error)
      throw error.response?.data?.message || 'Erreur de chargement des produits'
    }
  },

  /**
   * Récupérer un produit par ID
   * @param {number} productId 
   * @returns {Promise<Object>}
   */
  async getProductById(productId) {
    try {
      const response = await api.get(`/products/${productId}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Produit introuvable'
    }
  },

  /**
   * Récupérer les produits en vedette
   * @returns {Promise<Array>}
   */
  async getFeaturedProducts() {
    try {
      const response = await api.get('/products/featured')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur de chargement'
    }
  },

  /**
   * Récupérer les catégories de produits
   * @returns {Promise<Array>}
   */
  async getCategories() {
    try {
      const response = await api.get('/products/categories')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur de chargement des catégories'
    }
  }
}

export default productService