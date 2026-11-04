<script setup>
defineProps({
  statusText: String,
  progress: Number,
  videoSrc: String
})
</script>

<template>
  <div id="loader-container">
    <div class="loader-video-wrapper">
      <video autoplay muted loop playsinline :src="videoSrc">
        Tu navegador no soporta videos HTML5.
      </video>
    </div>
    <div class="loader-title">Iniciando sistema</div>
    <div class="loader-subtitle">{{ statusText }}</div>
    <div class="progress-bar-container">
      <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
    </div>
    <div class="progress-percentage">{{ progress }}%</div>
  </div>
</template>

<style scoped>
#loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Uso de tus variables para el fondo degradado */
  background: linear-gradient(135deg, var(--gob-verde) 0%, var(--color-primary-dark) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal); /* Usando la capa de modal existente en tus variables */
  font-family: var(--font-primary);
}

.loader-video-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  margin-bottom: var(--spacing-lg);
  border-radius: var(--radius-full);
  padding: 4px;
  /* Degradado con acentos y colores base institucionales */
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary), var(--gob-verde));
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 25px rgba(188, 149, 91, 0.4);
}

.loader-video-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-full);
  background-color: var(--gob-verde);
}

.loader-title {
  color: var(--color-surface);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 1px;
  margin-bottom: var(--spacing-xs);
}

.loader-subtitle {
  color: var(--color-accent-light);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg);
  min-height: 20px;
  text-align: center;
  font-family: var(--font-secondary);
}

.progress-bar-container {
  width: 280px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.progress-bar-fill {
  height: 100%;
  /* Uso de variables para la barra de progreso (dorado, grosella y lima) */
  background: linear-gradient(90deg, var(--color-accent), var(--color-primary), var(--color-lime));
  border-radius: var(--radius-full);
  transition: width var(--transition-fast);
}

.progress-percentage {
  color: var(--color-gray-light);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  margin-top: 10px;
  font-family: var(--font-secondary);
}
</style>
