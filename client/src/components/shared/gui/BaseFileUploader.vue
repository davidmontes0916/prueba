<template>
  <div class="uploader-card" :class="{ 'has-file': file }">
    <!-- Input de archivo oculto nativo -->
    <input 
      ref="fileInputRef" 
      type="file" 
      class="hidden-input" 
      :accept="accept" 
      @change="handleFileChange" 
    />

    <!-- Sección Superior: Píldora de selección / subida -->
    <div class="uploader-top-section">
      <div class="pill-container">
        <!-- Lado izquierdo: Seleccionar archivo -->
        <button 
          type="button" 
          class="pill-left" 
          @click="triggerSelect"
        >
          <i class="fa-solid fa-folder-open"></i>
          <span>{{ file ? 'Cambiar archivo' : 'Seleccionar archivo' }}</span>
        </button>

        <!-- Lado derecho: Subir archivo -->
        <button 
          type="button" 
          class="pill-right" 
          :disabled="!file || uploading" 
          @click="handleUpload"
        >
          <i v-if="uploading" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-cloud-arrow-up"></i>
          <span>{{ uploading ? 'Subiendo...' : 'Subir' }}</span>
        </button>
      </div>
    </div>

    <!-- Sección Inferior: Información del archivo adjunto (unida a la card principal) -->
    <div v-if="file" class="uploader-bottom-section">
      <div class="file-card-preview">
        <div class="file-info-container">
          <div class="file-icon-box" :class="fileTypeClass">
            <i :class="fileIcon"></i>
          </div>
          <div class="file-details">
            <span class="file-name" :title="file.name">{{ file.name }}</span>
            <span class="file-meta">{{ formatFileSize(file.size) }} • {{ fileExtension }}</span>
          </div>
        </div>

        <div class="file-actions">
          <!-- Botón para ver vista previa -->
          <button 
            type="button" 
            class="btn-action-icon preview-btn" 
            title="Vista previa del archivo" 
            @click="handlePreview"
          >
            <i class="fa-solid fa-eye"></i>
          </button>
          <!-- Botón para quitar el archivo adjunto -->
          <button 
            type="button" 
            class="btn-action-icon delete-btn" 
            title="Eliminar archivo" 
            @click="removeFile"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal simple de Vista Previa -->
    <div v-if="showPreviewModal" class="preview-modal-backdrop" @click="closePreview">
      <div class="preview-modal-content" @click.stop>
        <div class="preview-modal-header">
          <h3>Vista previa: {{ file?.name }}</h3>
          <button class="close-btn" @click="closePreview"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="preview-modal-body">
          <img v-if="isImage" :src="previewUrl" alt="Vista previa de imagen" class="preview-image" />
          <iframe v-else-if="isPdf" :src="previewUrl" class="preview-pdf"></iframe>
          <p v-else class="text-muted">Vista previa no disponible para este formato.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  accept: {
    type: String,
    default: 'image/*,.pdf'
  }
})

const emit = defineEmits(['upload'])

const fileInputRef = ref(null)
const file = ref(null)
const uploading = ref(false)
const previewUrl = ref(null)
const showPreviewModal = ref(false)

const triggerSelect = () => {
  fileInputRef.value.click()
}

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    file.value = selectedFile
    previewUrl.value = URL.createObjectURL(selectedFile)
  }
}

const removeFile = () => {
  file.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const handleUpload = async () => {
  if (!file.value) return
  uploading.value = true
  emit('upload', file.value, {
    success: () => {
      uploading.value = false
    },
    error: () => {
      uploading.value = false
    }
  })
}

const handlePreview = () => {
  if (file.value) {
    showPreviewModal.value = true
  }
}

const closePreview = () => {
  showPreviewModal.value = false
}

const fileExtension = computed(() => {
  if (!file.value) return ''
  const parts = file.value.name.split('.')
  return parts.length > 1 ? parts.pop().toUpperCase() : 'ARCHIVO'
})

const isImage = computed(() => file.value && file.value.type.startsWith('image/'))
const isPdf = computed(() => file.value && file.value.type === 'application/pdf')

const fileIcon = computed(() => {
  if (isImage.value) return 'fa-solid fa-file-image'
  if (isPdf.value) return 'fa-solid fa-file-pdf'
  return 'fa-solid fa-file-lines'
})

const fileTypeClass = computed(() => {
  if (isImage.value) return 'type-image'
  if (isPdf.value) return 'type-pdf'
  return 'type-default'
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<style scoped>
/* Card Principal contenedora de ambas secciones */
.uploader-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow var(--transition-fast);
}

.uploader-card:hover {
  box-shadow: var(--shadow-md);
}

.hidden-input {
  display: none;
}

/* Sección Superior */
.uploader-top-section {
  padding: var(--spacing-sm);
}

/* Píldora Bicolor Interna */
.pill-container {
  display: flex;
  width: 100%;
  height: 44px;
  background-color: var(--color-surface-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.pill-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  background-color: transparent;
  border: none;
  color: var(--color-text);
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  padding: 0 var(--spacing-md);
  transition: background-color var(--transition-fast);
}

.pill-left:hover {
  background-color: var(--color-border);
}

.pill-right {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  background-color: var(--color-primary);
  color: var(--color-surface);
  border: none;
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  padding: 0 var(--spacing-lg);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.pill-right:disabled {
  background-color: var(--color-gray-light);
  color: var(--color-surface);
  opacity: 0.6;
  cursor: not-allowed;
}

.pill-right:not(:disabled):hover {
  background-color: var(--color-primary-dark);
}

/* Sección Inferior (Unida con divisor sutil) */
.uploader-bottom-section {
  border-top: 1px solid var(--color-divider);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-surface);
  animation: fadeIn var(--transition-normal);
}

.file-card-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.file-info-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  overflow: hidden;
}

.file-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

/* Iconos de archivo en color Grosella institucional */
.type-image,
.type-pdf,
.type-default {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary);
}

.file-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.file-name {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}

.file-meta {
  font-family: var(--font-secondary);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.file-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* Botones de acción cuadrados y grises estilo Basetable */
.btn-action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-action-icon:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-gray-light);
  color: var(--color-text);
}

/* Modal Vista Previa */
.preview-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.preview-modal-content {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 650px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.preview-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.preview-modal-header h3 {
  margin: 0;
  font-family: var(--font-primary);
  font-size: var(--font-size-md);
  color: var(--color-text);
}

.close-btn {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  cursor: pointer;
  color: var(--color-text-muted);
}

.close-btn:hover {
  color: var(--color-text);
}

.preview-modal-body {
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  max-height: 70vh;
}

.preview-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: var(--radius-sm);
}

.preview-pdf {
  width: 100%;
  height: 60vh;
  border: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
