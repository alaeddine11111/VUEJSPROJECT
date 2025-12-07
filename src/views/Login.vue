<template>
  <div class="auth-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="auth-card">
            <!-- Tabs pour switcher entre Connexion et Inscription -->
            <ul class="nav nav-pills nav-fill mb-4" role="tablist">
              <li class="nav-item">
                <button 
                  class="nav-link" 
                  :class="{ active: activeTab === 'login' }"
                  @click="activeTab = 'login'"
                >
                  Se connecter
                </button>
              </li>
              <li class="nav-item">
                <button 
                  class="nav-link" 
                  :class="{ active: activeTab === 'register' }"
                  @click="activeTab = 'register'"
                >
                  Créer un compte
                </button>
              </li>
            </ul>

            <!-- Formulaire de connexion -->
            <div v-show="activeTab === 'login'" class="tab-content">
              <h3 class="text-center mb-4">Bienvenue !</h3>
              
              <div v-if="loginError" class="alert alert-danger">
                {{ loginError }}
              </div>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input 
                  v-model="loginForm.email" 
                  type="email" 
                  class="form-control" 
                  placeholder="votre@email.com"
                  @keyup.enter="handleLogin"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Mot de passe</label>
                <div class="password-input">
                  <input 
                    v-model="loginForm.password" 
                    :type="showLoginPassword ? 'text' : 'password'" 
                    class="form-control" 
                    placeholder="••••••••"
                    @keyup.enter="handleLogin"
                  />
                  <button 
                    type="button" 
                    class="password-toggle"
                    @click="showLoginPassword = !showLoginPassword"
                  >
                    {{ showLoginPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
              </div>

              <div class="mb-3 text-end">
                <a href="#" @click.prevent="activeTab = 'forgot'" class="text-primary">
                  Mot de passe oublié ?
                </a>
              </div>

              <button @click="handleLogin" class="btn btn-primary w-100 btn-lg">
                Se connecter
              </button>
            </div>

            <!-- Formulaire d'inscription -->
            <div v-show="activeTab === 'register'" class="tab-content">
              <h3 class="text-center mb-4">Créer un compte</h3>

              <div v-if="registerError" class="alert alert-danger">
                {{ registerError }}
              </div>
              <div v-if="registerSuccess" class="alert alert-success">
                {{ registerSuccess }}
              </div>

              <div class="mb-3">
                <label class="form-label">Nom complet</label>
                <input 
                  v-model="registerForm.fullName" 
                  type="text" 
                  class="form-control" 
                  placeholder="Jean Dupont"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input 
                  v-model="registerForm.email" 
                  type="email" 
                  class="form-control" 
                  placeholder="votre@email.com"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Mot de passe</label>
                <div class="password-input">
                  <input 
                    v-model="registerForm.password" 
                    :type="showRegisterPassword ? 'text' : 'password'" 
                    class="form-control" 
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    class="password-toggle"
                    @click="showRegisterPassword = !showRegisterPassword"
                  >
                    {{ showRegisterPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                <small class="text-muted">Au moins 6 caractères</small>
              </div>

              <div class="mb-3">
                <label class="form-label">Confirmer le mot de passe</label>
                <input 
                  v-model="registerForm.confirmPassword" 
                  type="password" 
                  class="form-control" 
                  placeholder="••••••••"
                />
              </div>

              <button @click="handleRegister" class="btn btn-success w-100 btn-lg">
                Créer mon compte
              </button>
            </div>

            <!-- Formulaire mot de passe oublié -->
            <div v-show="activeTab === 'forgot'" class="tab-content">
              <h3 class="text-center mb-4">Mot de passe oublié</h3>

              <div v-if="forgotError" class="alert alert-danger">
                {{ forgotError }}
              </div>
              <div v-if="forgotSuccess" class="alert alert-success">
                {{ forgotSuccess }}
              </div>

              <p class="text-muted text-center mb-4">
                Entrez votre email pour réinitialiser votre mot de passe
              </p>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input 
                  v-model="forgotForm.email" 
                  type="email" 
                  class="form-control" 
                  placeholder="votre@email.com"
                />
              </div>

              <button @click="handleForgotPassword" class="btn btn-warning w-100 btn-lg mb-3">
                Réinitialiser
              </button>

              <button 
                type="button" 
                class="btn btn-outline-secondary w-100"
                @click="activeTab = 'login'"
              >
                Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      activeTab: 'login',
      showLoginPassword: false,
      showRegisterPassword: false,
      
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      forgotForm: {
        email: ''
      },
      
      loginError: '',
      registerError: '',
      registerSuccess: '',
      forgotError: '',
      forgotSuccess: ''
    }
  },
  methods: {
    handleLogin() {
      this.loginError = ''
      
      // Validation
      if (!this.loginForm.email || !this.loginForm.password) {
        this.loginError = 'Veuillez remplir tous les champs'
        return
      }
      
      // Récupérer les utilisateurs du localStorage
      const users = JSON.parse(localStorage.getItem('techshop_users') || '[]')
      
      // Chercher l'utilisateur
      const user = users.find(u => 
        u.email === this.loginForm.email && 
        u.password === this.loginForm.password
      )
      
      if (user) {
        // Connexion réussie
        const currentUser = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt
        }
        
        localStorage.setItem('techshop_current_user', JSON.stringify(currentUser))
        
        // Rediriger vers l'accueil et recharger pour mettre à jour le panier
        this.$router.push('/')
        window.location.reload()
      } else {
        this.loginError = 'Email ou mot de passe incorrect'
      }
    },
    
    handleRegister() {
      this.registerError = ''
      this.registerSuccess = ''
      
      // Validation
      if (!this.registerForm.fullName || !this.registerForm.email || !this.registerForm.password) {
        this.registerError = 'Veuillez remplir tous les champs'
        return
      }
      
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.registerError = 'Les mots de passe ne correspondent pas'
        return
      }
      
      if (this.registerForm.password.length < 6) {
        this.registerError = 'Le mot de passe doit contenir au moins 6 caractères'
        return
      }
      
      // Récupérer les utilisateurs existants
      const users = JSON.parse(localStorage.getItem('techshop_users') || '[]')
      
      // Vérifier si l'email existe déjà
      if (users.some(u => u.email === this.registerForm.email)) {
        this.registerError = 'Cet email est déjà utilisé'
        return
      }
      
      // Créer le nouvel utilisateur
      const newUser = {
        id: Date.now(),
        fullName: this.registerForm.fullName,
        email: this.registerForm.email,
        password: this.registerForm.password,
        createdAt: new Date().toISOString()
      }
      
      users.push(newUser)
      localStorage.setItem('techshop_users', JSON.stringify(users))
      
      this.registerSuccess = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
      
      // Réinitialiser le formulaire
      this.registerForm = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
      
      // Passer à l'onglet connexion après 2 secondes
      setTimeout(() => {
        this.activeTab = 'login'
        this.registerSuccess = ''
      }, 2000)
    },
    
    handleForgotPassword() {
      this.forgotError = ''
      this.forgotSuccess = ''
      
      if (!this.forgotForm.email) {
        this.forgotError = 'Veuillez entrer votre email'
        return
      }
      
      // Récupérer les utilisateurs
      const users = JSON.parse(localStorage.getItem('techshop_users') || '[]')
      
      // Chercher l'utilisateur
      const user = users.find(u => u.email === this.forgotForm.email)
      
      if (user) {
        // Simuler l'envoi d'email (en réalité, afficher le mot de passe)
        this.forgotSuccess = `Un email de réinitialisation a été envoyé à ${this.forgotForm.email}. (Votre mot de passe: ${user.password})`
        
        this.forgotForm.email = ''
      } else {
        this.forgotError = 'Aucun compte trouvé avec cet email'
      }
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 80vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-pills .nav-link {
  border-radius: 10px;
  font-weight: 600;
  padding: 12px;
  transition: all 0.3s ease;
  color: #6c757d;
  background: transparent;
  border: none;
}

.nav-pills .nav-link.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 12px 15px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102,126,234,0.25);
  outline: none;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
}

.btn {
  border-radius: 10px;
  padding: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102,126,234,0.4);
}

.btn-success {
  background: linear-gradient(45deg, #28a745, #20c997);
  border: none;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(40,167,69,0.4);
}

.btn-warning {
  background: linear-gradient(45deg, #ffc107, #ff9800);
  border: none;
  color: white;
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255,193,7,0.4);
}

.alert {
  border-radius: 10px;
  border: none;
}

h3 {
  color: #333;
  font-weight: 700;
}
</style>