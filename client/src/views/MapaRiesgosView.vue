<template>
  <div class="mapa-riesgos-container">
    <BaseCard 
      title="Mapa de Riesgos" 
      description="Carga y actualización del documento oficial del mapa de riesgos institucional." 
      icon="fa-solid fa-chart-column"
    >
      <div class="upload-wrapper">
        <p class="instruction-text">
          Selecciona el archivo en formato de imagen (PNG, JPG) o PDF para actualizar el mapa de riesgos.
        </p>

        <!-- Uso del componente de subida en píldora bicolor -->
        <BaseFileUploader 
          accept="image/*,.pdf" 
          @upload="handleUploadMapaRiesgos" 
        />
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/shared/gui/BaseCard.vue'
import BaseFileUploader from '@/components/shared/gui/BaseFileUploader.vue'

const handleUploadMapaRiesgos = (file, { success, error }) => {
  console.log('Archivo listo para enviar al servidor:', file.name)
  
  // Simulación de envío a una API
  setTimeout(() => {
    alert(`¡El mapa de riesgos "${file.name}" se ha subido exitosamente!`)
    success() // Restablece el estado de carga
  }, 1200)
}
</script>

<style scoped>
.mapa-riesgos-container {
  padding: var(--spacing-lg);
}

.upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 500px;
  padding: var(--spacing-sm) 0;
}

.instruction-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}
</style>
