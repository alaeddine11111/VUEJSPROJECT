    // src/services/cartService.js
import api from './api'

const cartService = {
  /**
   * Récupérer le panier de l'utilisateur connecté
   * @returns {Promise<Array>}
   */
  async getCart() {
    try {
      const response = await api.get('/cart')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error)
      throw error.response?.data?.message || 'Erreur de chargement du panier'
    }
  },

  /**
   * Ajouter un produit au panier
   * @param {number} productId 
   * @param {number} quantity 
   * @returns {Promise<Object>}
   */
  async addToCart(productId, quantity = 1) {
    try {
      const response = await api.post('/cart/add', { productId, quantity })
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de l\'ajout au panier'
    }
  },

  /**
   * Mettre à jour la quantité d'un article
   * @param {number} cartItemId 
   * @param {number} quantity 
   * @returns {Promise<Object>}
   */
  async updateCartItem(cartItemId, quantity) {
    try {
      const response = await api.put(`/cart/${cartItemId}`, { quantity })
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur de mise à jour'
    }
  },

  /**
   * Supprimer un article du panier
   * @param {number} cartItemId 
   * @returns {Promise}
   */
  async removeFromCart(cartItemId) {
    try {
      const response = await api.delete(`/cart/${cartItemId}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur de suppression'
    }
  },

  /**
   * Vider tout le panier
   * @returns {Promise}
   */
  async clearCart() {
    try {
      const response = await api.delete('/cart/clear')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors du vidage du panier'
    }
  },

  /**
   * Synchroniser le panier local avec le serveur
   * @param {Array} localCart 
   * @returns {Promise<Array>}
   */
  async syncCart(localCart) {
    try {
      const response = await api.post('/cart/sync', { items: localCart })
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur de synchronisation'
    }
  }
}

export default cartService