// src/services/authService.js
import api from './api'

const authService = {
  /**
   * Connexion d'un utilisateur
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise} Données de l'utilisateur + token
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      // Sauvegarder l'utilisateur et le token
      if (response.data.user && response.data.token) {
        const userData = {
          ...response.data.user,
          token: response.data.token
        }
        localStorage.setItem('techshop_current_user', JSON.stringify(userData))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur de connexion'
    }
  },

  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - {fullName, email, password}
   * @returns {Promise}
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de l\'inscription'
    }
  },

  /**
   * Déconnexion
   */
  logout() {
    localStorage.removeItem('techshop_current_user')
    // Optionnel : appeler une route backend pour invalider le token
    // await api.post('/auth/logout')
  },

  /**
   * Récupération du mot de passe
   * @param {string} email 
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la récupération'
    }
  },

  /**
   * Mise à jour du profil
   * @param {Object} userData - Nouvelles données utilisateur
   */
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData)
      
      // Mettre à jour le localStorage
      const currentUser = JSON.parse(localStorage.getItem('techshop_current_user'))
      const updatedUser = { ...currentUser, ...response.data.user }
      localStorage.setItem('techshop_current_user', JSON.stringify(updatedUser))
      
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur de mise à jour'
    }
  },

  /**
   * Changement de mot de passe
   * @param {string} currentPassword 
   * @param {string} newPassword 
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Erreur de changement de mot de passe'
    }
  }
}

export default authService