// src/services/orderService.js
import api from './api'

const orderService = {
  /**
   * Créer une nouvelle commande
   * @param {Object} orderData - {items, deliveryInfo, total}
   * @returns {Promise<Object>}
   */
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la création de la commande'
    }
  },

  /**
   * Récupérer toutes les commandes de l'utilisateur
   * @returns {Promise<Array>}
   */
  async getUserOrders() {
    try {
      const response = await api.get('/orders')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur de chargement des commandes'
    }
  },

  /**
   * Récupérer les détails d'une commande
   * @param {number} orderId 
   * @returns {Promise<Object>}
   */
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Commande introuvable'
    }
  },

  /**
   * Annuler une commande
   * @param {number} orderId 
   * @returns {Promise<Object>}
   */
  async cancelOrder(orderId) {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Impossible d\'annuler la commande'
    }
  },

  /**
   * Suivre une commande
   * @param {number} orderId 
   * @returns {Promise<Object>}
   */
  async trackOrder(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur de suivi'
    }
  }
}

export default orderService