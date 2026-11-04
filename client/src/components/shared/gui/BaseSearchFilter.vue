<template>
  <div class="base-search-filter">
    <!-- Barra de búsqueda compacta, ligeramente más alta y centrada -->
    <div class="search-box">
      <i class="fa-solid fa-magnifying-glass search-icon"></i>
      <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="search-input"
      />
      <button 
        v-if="modelValue" 
        class="clear-btn" 
        @click="$emit('update:modelValue', '')"
        title="Limpiar búsqueda"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Contenedor de Filtros Desplegables -->
    <div class="filter-dropdown-container" v-if="$slots.filters">
      <button class="btn-filter-toggle" @click="toggleFilters" title="Filtrar registros">
        <i class="fa-solid fa-filter"></i>
        <span>Filtros</span>
        <span v-if="hasActiveFilters" class="filter-badge-dot"></span>
        <i class="fa-solid fa-chevron-down chevron" :class="{ 'open': isOpen }"></i>
      </button>

      <!-- Menú desplegable -->
      <div v-if="isOpen" class="filter-menu">
        <div class="filter-menu-header" v-if="hasActiveFilters">
          <span class="filter-menu-title">Filtros activos</span>
          <button class="btn-clear-filters" @click="$emit('clear-filters')">
            <i class="fa-solid fa-rotate-right"></i> Limpiar filtros
          </button>
        </div>
        
        <slot name="filters"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  },
  hasActiveFilters: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'clear-filters'])

const isOpen = ref(false)
const toggleFilters = () => {
  isOpen.value = !isOpen.value
}

const closeOnClickOutside = (e) => {
  if (!e.target.closest('.filter-dropdown-container')) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeOnClickOutside))
onUnmounted(() => document.removeEventListener('click', closeOnClickOutside))
</script>

<style scoped>
.base-search-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  width: 320px;
  max-width: 100%;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.search-input {
  width: 100%;
  padding: 11px 36px 11px 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 8px);
  background-color: var(--color-surface, #fff);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  transition: var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition-fast);
}

.clear-btn:hover {
  color: var(--color-text);
  background-color: var(--color-gray-lighter);
}

.filter-dropdown-container {
  position: relative;
}

.btn-filter-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-gray-dark);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  transition: var(--transition-fast);
  position: relative;
}

.btn-filter-toggle:hover {
  background-color: var(--color-gray-lighter);
  border-color: var(--color-gray-light);
  color: var(--color-text);
}

.filter-badge-dot {
  width: 7px;
  height: 7px;
  background-color: var(--color-primary);
  border-radius: 50%;
  display: inline-block;
}

.btn-filter-toggle .chevron {
  font-size: 0.75rem;
  transition: transform var(--transition-fast);
}

.btn-filter-toggle .chevron.open {
  transform: rotate(180deg);
}

.filter-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 8px);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-md);
  z-index: var(--z-dropdown);
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.filter-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.filter-menu-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
}

/* Botón de limpiar filtros usando color primario */
.btn-clear-filters {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.btn-clear-filters:hover {
  background-color: var(--color-primary-lighter);
}

/* ==========================================================
   ESTILOS GENERALES PARA LOS SELECTS Y LABELS DENTRO DEL MENÚ
   ================================================---------- */
:deep(.filter-group) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:deep(.filter-label) {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
}

:deep(.filter-select) {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 8px);
  background-color: var(--color-surface, #fff);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

:deep(.filter-select:focus) {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}
</style>
