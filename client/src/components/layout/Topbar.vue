<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

defineProps({
  systemName: {
    type: String,
    default: 'SSIPTAR'
  }
})

const emit = defineEmits(['profile', 'logout'])
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const userName = computed(() => {
  if (!authStore.user) return 'Usuario Invitado'
  const { nombre, apellido_paterno, apellido_materno } = authStore.user
  return [nombre, apellido_paterno, apellido_materno].filter(Boolean).join(' ')
})

const userRole = computed(() => {
  return authStore.user?.rol || 'Administrador'
})

const isDropdownOpen = ref(false)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function handleProfile() {
  isDropdownOpen.value = false
  emit('profile')
}

function handleLogout() {
  isDropdownOpen.value = false
  authStore.logout()
  emit('logout')
  router.push('/auth')
}

function handleClickOutside(event) {
  if (!event.target.closest('.user-menu-container')) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="navbar">
    <div class="navbar-left">
      <h1 class="system-title">{{ systemName }}</h1>
      <span class="welcome-text">
        <i class="fa-solid fa-hand-wave"></i> ¡Hola, Bienvenido!
      </span>
    </div>

    <div class="navbar-right">
      <button 
        class="theme-toggle-btn" 
        @click="themeStore.toggleTheme()"
        :aria-label="themeStore.isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      >
        <i :class="themeStore.isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
      </button>

      <div class="user-info">
        <span class="user-name">{{ userName }}</span>
        <span class="user-role badge-role">{{ userRole }}</span>
      </div>

      <div class="user-menu-container">
        <button 
          class="user-profile-btn" 
          @click="toggleDropdown"
          aria-label="Menú de usuario"
          :aria-expanded="isDropdownOpen"
        >
          <i class="fa-solid fa-circle-user user-icon"></i>
          <i class="fa-solid fa-chevron-down dropdown-arrow" :class="{ 'rotate': isDropdownOpen }"></i>
        </button>

        <transition name="dropdown">
          <div v-if="isDropdownOpen" class="dropdown-menu">
            <div class="dropdown-header">
              <p class="dropdown-user-name">{{ userName }}</p>
              <p class="dropdown-user-email">{{ authStore.user?.correo || userRole }}</p>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item" @click="handleProfile">
              <i class="fa-solid fa-user-gear"></i> Configurar Perfil
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout-item" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-primary-dark);
  color: var(--color-surface);
  padding: 0 var(--spacing-lg);
  font-family: var(--font-primary);
  height: 64px;
  box-sizing: border-box;
  box-shadow: var(--shadow-md);
  z-index: var(--z-header);
  position: relative;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.system-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.5px;
}

.welcome-text {
  font-size: var(--font-size-sm);
  font-family: var(--font-secondary);
  opacity: 0.85;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.theme-toggle-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-surface);
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}

.theme-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.2;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.user-role {
  font-size: 0.75rem;
  font-weight: bold;
  font-family: var(--font-secondary);
  background-color: rgba(0, 0, 0, 0.5);
  color: #FFFFFF;
  padding: 4px 8px;
  border-radius: var(--radius-full);
  margin-top: 4px;
  letter-spacing: 0.5px;
}

.user-menu-container {
  position: relative;
}

.user-profile-btn {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-full);
  transition: background var(--transition-fast);
}

.user-profile-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-icon {
  font-size: 2rem;
  color: var(--color-surface);
}

.dropdown-arrow {
  font-size: 0.75rem;
  color: var(--color-surface);
  opacity: 0.8;
  transition: transform var(--transition-fast);
}

.dropdown-arrow.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 240px;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  padding: var(--spacing-xs) 0;
  z-index: var(--z-dropdown);
  animation: fadeIn var(--transition-fast) ease-in-out;
}

.dropdown-header {
  padding: var(--spacing-sm) var(--spacing-md);
}

.dropdown-user-name {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-user-email {
  margin: 2px 0 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-divider);
  margin: var(--spacing-xs) 0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 10px var(--spacing-md);
  background: transparent;
  border: none;
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: left;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.dropdown-item i {
  width: 18px;
  text-align: center;
  color: var(--color-gray);
}

.dropdown-item:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-primary);
}

.dropdown-item:hover i {
  color: var(--color-primary);
}

.logout-item {
  color: var(--color-primary);
}

.logout-item i {
  color: var(--color-primary);
}

.logout-item:hover {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary-dark);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
