<template>
  <div class="profile-page container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar">
              {{ userInitials }}
            </div>
            <h2>{{ currentUser.fullName }}</h2>
            <p class="text-muted">{{ currentUser.email }}</p>
          </div>

          <div class="profile-body">
            <h4 class="mb-4">Informations du compte</h4>

            <div class="info-row">
              <div class="info-label">Nom complet</div>
              <div class="info-value">{{ currentUser.fullName }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Email</div>
              <div class="info-value">{{ currentUser.email }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Membre depuis</div>
              <div class="info-value">{{ formatDate(currentUser.createdAt) }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">ID Utilisateur</div>
              <div class="info-value">#{{ currentUser.id }}</div>
            </div>

            <hr class="my-4" />

            <div class="actions">
              <button @click="showEditModal = true" class="btn btn-primary me-2">
                ✏️ Modifier le profil
              </button>
              <button @click="showChangePasswordModal = true" class="btn btn-warning me-2">
                🔒 Changer le mot de passe
              </button>
              <button @click="handleLogout" class="btn btn-danger">
                🚪 Se déconnecter
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Modifier le profil -->
        <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
          <div class="modal-content">
            <div class="modal-header">
              <h5>Modifier le profil</h5>
              <button @click="showEditModal = false" class="btn-close">&times;</button>
            </div>
            <div class="modal-body">
              <div v-if="editError" class="alert alert-danger">{{ editError }}</div>
              <div v-if="editSuccess" class="alert alert-success">{{ editSuccess }}</div>

              <div class="mb-3">
                <label class="form-label">Nom complet</label>
                <input v-model="editForm.fullName" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="editForm.email" type="email" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button @click="showEditModal = false" class="btn btn-secondary">Annuler</button>
              <button @click="handleEditProfile" class="btn btn-primary">Enregistrer</button>
            </div>
          </div>
        </div>

        <!-- Modal Changer le mot de passe -->
        <div v-if="showChangePasswordModal" class="modal-overlay" @click.self="showChangePasswordModal = false">
          <div class="modal-content">
            <div class="modal-header">
              <h5>Changer le mot de passe</h5>
              <button @click="showChangePasswordModal = false" class="btn-close">&times;</button>
            </div>
            <div class="modal-body">
              <div v-if="passwordError" class="alert alert-danger">{{ passwordError }}</div>
              <div v-if="passwordSuccess" class="alert alert-success">{{ passwordSuccess }}</div>

              <div class="mb-3">
                <label class="form-label">Mot de passe actuel</label>
                <input v-model="passwordForm.currentPassword" type="password" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Nouveau mot de passe</label>
                <input v-model="passwordForm.newPassword" type="password" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Confirmer le nouveau mot de passe</label>
                <input v-model="passwordForm.confirmPassword" type="password" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button @click="showChangePasswordModal = false" class="btn btn-secondary">Annuler</button>
              <button @click="handleChangePassword" class="btn btn-warning">Changer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileView',
  data() {
    return {
      currentUser: {},
      showEditModal: false,
      showChangePasswordModal: false,
      editForm: {
        fullName: '',
        email: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      editError: '',
      editSuccess: '',
      passwordError: '',
      passwordSuccess: ''
    }
  },
  computed: {
    userInitials() {
      if (!this.currentUser.fullName) return '?'
      const names = this.currentUser.fullName.split(' ')
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
  },
  methods: {
    loadCurrentUser() {
      const user = JSON.parse(localStorage.getItem('techshop_current_user') || 'null')
      if (!user) {
        this.$router.push('/login')
        return
      }
      this.currentUser = user
      this.editForm = {
        fullName: user.fullName,
        email: user.email
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    handleEditProfile() {
      this.editError = ''
      this.editSuccess = ''
      
      if (!this.editForm.fullName || !this.editForm.email) {
        this.editError = 'Veuillez remplir tous les champs'
        return
      }
      
      // Mettre à jour dans localStorage
      const users = JSON.parse(localStorage.getItem('techshop_users') || '[]')
      const userIndex = users.findIndex(u => u.id === this.currentUser.id)
      
      if (userIndex !== -1) {
        users[userIndex].fullName = this.editForm.fullName
        users[userIndex].email = this.editForm.email
        
        localStorage.setItem('techshop_users', JSON.stringify(users))
        
        // Mettre à jour l'utilisateur courant
        this.currentUser.fullName = this.editForm.fullName
        this.currentUser.email = this.editForm.email
        localStorage.setItem('techshop_current_user', JSON.stringify(this.currentUser))
        
        this.editSuccess = 'Profil mis à jour avec succès!'
        
        setTimeout(() => {
          this.showEditModal = false
          this.editSuccess = ''
        }, 2000)
      }
    },
    
    handleChangePassword() {
      this.passwordError = ''
      this.passwordSuccess = ''
      
      if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
        this.passwordError = 'Veuillez remplir tous les champs'
        return
      }
      
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordError = 'Les nouveaux mots de passe ne correspondent pas'
        return
      }
      
      if (this.passwordForm.newPassword.length < 6) {
        this.passwordError = 'Le nouveau mot de passe doit contenir au moins 6 caractères'
        return
      }
      
      // Vérifier le mot de passe actuel
      const users = JSON.parse(localStorage.getItem('techshop_users') || '[]')
      const user = users.find(u => u.id === this.currentUser.id)
      
      if (user && user.password === this.passwordForm.currentPassword) {
        // Mettre à jour le mot de passe
        const userIndex = users.findIndex(u => u.id === this.currentUser.id)
        users[userIndex].password = this.passwordForm.newPassword
        
        localStorage.setItem('techshop_users', JSON.stringify(users))
        
        this.passwordSuccess = 'Mot de passe changé avec succès!'
        
        // Réinitialiser le formulaire
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        
        setTimeout(() => {
          this.showChangePasswordModal = false
          this.passwordSuccess = ''
        }, 2000)
      } else {
        this.passwordError = 'Mot de passe actuel incorrect'
      }
    },
    
    handleLogout() {
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('techshop_current_user')
        this.$router.push('/login')
      }
    }
  },
  mounted() {
    this.loadCurrentUser()
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 80vh;
}

.profile-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 30px rgba(0,0,0,0.1);
  overflow: hidden;
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: white;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 auto 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

.profile-header h2 {
  margin: 0;
  font-weight: 700;
}

.profile-body {
  padding: 40px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #e9ecef;
}

.info-label {
  font-weight: 600;
  color: #6c757d;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  border-radius: 10px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
}

.btn-warning {
  background: linear-gradient(45deg, #ffc107, #ff9800);
  border: none;
  color: white;
}

.btn-danger {
  background: linear-gradient(45deg, #dc3545, #c82333);
  border: none;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.3s ease;
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

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h5 {
  margin: 0;
  font-weight: 700;
}

.btn-close {
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

.alert {
  border-radius: 10px;
  border: none;
}
</style>