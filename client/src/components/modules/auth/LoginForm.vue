<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['forgot-password'])
const router = useRouter()
const authStore = useAuthStore()

const usuario = ref('') // En tu backend este campo es "correo"
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Llamamos a la acción de login del store usando el correo y contraseña
    await authStore.login(usuario.value, password.value)
    
    // Si todo sale bien, redirigimos al inicio o dashboard
    router.push('/home')
  } catch (error) {
    // Mensaje ambiguo por seguridad para no revelar si el correo existe o si la contraseña falló
    errorMessage.value = 'Correo o contraseña incorrectos.'
  } finally {
    isLoading.value = false
  }
}

function handleForgotPassword() {
  emit('forgot-password')
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-box">
      <!-- Título integrado directamente -->
      <h2 class="login-title">Iniciar sesión</h2>

      <!-- Alerta de error con tono rojo grosella -->
      <div v-if="errorMessage" class="error-alert">
        <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        
        <!-- Campo Usuario (Correo) -->
        <div class="input-group">
          <label for="usuario" class="input-label">Correo electrónico</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-user input-icon"></i>
            <input 
              id="usuario" 
              v-model="usuario" 
              type="email"
              placeholder="correo@upvt.edu.mx" 
              required 
            />
          </div>
        </div>

        <!-- Campo Contraseña -->
        <div class="input-group">
          <label for="password" class="input-label">Contraseña</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-lock input-icon"></i>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
        </div>

        <!-- Enlace Olvidé mi contraseña -->
        <div class="forgot-password-container">
          <a href="#" @click.prevent="handleForgotPassword" class="forgot-link">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <!-- Botón Entrar con estado de carga -->
        <button type="submit" :disabled="isLoading">
          <span v-if="isLoading"><i class="fa-solid fa-spinner fa-spin"></i> Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-background);
  padding: var(--spacing-md);
}

.login-box {
  position: relative;
  z-index: var(--z-header);
  background: var(--color-surface);
  padding: 48px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 440px;
  font-family: var(--font-primary);
}

.login-title {
  margin-bottom: 24px;
  font-size: 1.8rem;
  color: var(--color-primary);
  font-weight: 700;
  text-align: center;
}

.error-alert {
  background-color: var(--status-danger-lighter);
  color: var(--status-danger);
  padding: 10px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group {
  margin-bottom: var(--spacing-md);
  text-align: left;
}

.input-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
  font-size: var(--font-size-sm);
}

input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-hover);
  color: var(--color-text);
  font-family: var(--font-secondary);
  font-size: var(--font-size-md);
  box-sizing: border-box;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

input::placeholder {
  color: var(--color-text-muted);
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-surface);
}

.forgot-password-container {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.forgot-link {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.forgot-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

button {
  width: 100%;
  padding: 12px;
  background-color: var(--color-primary);
  color: var(--color-surface);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background-color var(--transition-normal);
}

button:hover {
  background-color: var(--color-primary-dark);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
