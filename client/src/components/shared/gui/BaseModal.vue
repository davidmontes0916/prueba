<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" @click.self="handleBackdropClick">
      <div ref="modalContainerRef" class="modal-container" :style="{ maxWidth: maxWidth }">
        
        <!-- Cabecera del Modal -->
        <div class="modal-header">
          <h3 class="modal-title">
            <i v-if="icon" :class="icon" class="modal-icon"></i>
            {{ title }}
          </h3>
          <button class="modal-close-btn" @click="close" title="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <!-- Cuerpo dinámico -->
        <div class="modal-body">
          <slot></slot>
        </div>

        <!-- Pie de página opcional -->
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: 'Modal' },
  icon: { type: String, default: '' },
  maxWidth: { type: String, default: '520px' },
  closeOnBackdrop: { type: Boolean, default: true }
})

const emit = defineEmits(['close'])
const close = () => emit('close')

const modalContainerRef = ref(null)

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) close()
}

// Manejador global de la tecla Enter mientras el modal esté abierto
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && props.isOpen) {
    // Si el usuario está en un textarea, permitimos el salto de línea normal
    if (e.target.tagName === 'TEXTAREA') return

    if (modalContainerRef.value) {
      // Busca el botón principal (.btn-primary) dentro de este modal específico
      const primaryBtn = modalContainerRef.value.querySelector('.btn-primary')
      if (primaryBtn) {
        e.preventDefault()
        primaryBtn.click()
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal);
  padding: var(--spacing-md);
  backdrop-filter: blur(2px);
}

.modal-container {
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-appear var(--transition-normal);
  border: 1px solid var(--color-border);
}

.modal-header {
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-divider);
  background-color: var(--color-surface);
}

.modal-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;
}

.modal-icon {
  color: var(--color-primary);
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: var(--font-size-md);
  cursor: pointer;
  color: var(--color-text-muted);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.modal-close-btn:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-primary);
}

.modal-body {
  padding: var(--spacing-lg);
  overflow-y: auto;
  flex: 1;
  font-size: var(--font-size-sm);
}

.modal-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-divider);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  background-color: var(--color-background);
}

/* ==========================================================
   ESTILOS DE BOTONES ENCAPSULADOS PARA EL FOOTER DEL MODAL
   ========================================================== */
:deep(.modal-footer .btn-primary) {
  background-color: var(--color-primary);
  color: var(--color-surface);
  border: 1px solid var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

:deep(.modal-footer .btn-primary:hover) {
  background-color: var(--color-primary-dark);
}

:deep(.modal-footer .btn-secondary) {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

:deep(.modal-footer .btn-secondary:hover) {
  background-color: var(--color-surface-hover);
}

/* Clases para que funcione la transición name="modal-fade" */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity var(--transition-normal, 0.25s ease);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
