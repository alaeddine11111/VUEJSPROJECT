// src/services/api.js
import axios from 'axios'

// Configuration de base d'Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ← Changez cette URL si nécessaire
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    const currentUser = JSON.parse(localStorage.getItem('techshop_current_user') || 'null')
    if (currentUser && currentUser.token) {
      config.headers.Authorization = `Bearer ${currentUser.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide - rediriger vers login
      localStorage.removeItem('techshop_current_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api