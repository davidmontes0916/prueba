<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import LoginForm from '../components/modules/auth/LoginForm.vue'
import LoginLoader from '../components/modules/auth/LoginLoader.vue' 

import videoCarga from '@/assets/images/PantallaCarga.mp4'
import imagenFondo from '@/assets/images/fondo-login.jpg'

const router = useRouter()


const isLoading = ref(false)
const progress = ref(0)
const loaderStatus = ref('Cargando módulos...')

const estados = [
  { pct: 20, texto: "Conectando con base de datos..." },
  { pct: 50, texto: "Cargando interfaz visual..." },
  { pct: 75, texto: "Sincronizando recursos..." },
  { pct: 100, texto: "¡Listo!" }
]

function handleLoginSubmit() {
  isLoading.value = true
  progress.value = 0
  loaderStatus.value = "Iniciando sesión..."

  const intervalo = setInterval(() => {
    progress.value += Math.floor(Math.random() * 8) + 3
    if (progress.value > 100) progress.value = 100

    const estadoActual = estados.find(e => progress.value <= e.pct)
    if (estadoActual) {
      loaderStatus.value = estadoActual.texto
    }

    if (progress.value === 100) {
      clearInterval(intervalo)
      setTimeout(() => {
        isLoading.value = false
        router.push('/home')
      }, 400)
    }
  }, 80)
}
</script>

<template>
  <div class="login-page" :style="{ backgroundImage: `url(${imagenFondo})` }">
    
    <LoginLoader 
      v-if="isLoading" 
      :statusText="loaderStatus" 
      :progress="progress" 
      :videoSrc="videoCarga" 
    />

    <LoginForm @submit-login="handleLoginSubmit" />

  </div>
</template>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: inherit;
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  transform: scale(1.05);
  z-index: 0;
  background-color: rgba(35, 91, 78, 0.45); 
  background-blend-mode: overlay;
}
</style>
