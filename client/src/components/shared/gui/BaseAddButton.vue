<template>
  <button class="base-add-button" @click="$emit('click')">
    <i class="fa-solid fa-plus icon-plus"></i>
    <span><slot>Nuevo Registro</slot></span>
  </button>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.base-add-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  /* Altura y espaciado generoso solicitado */
  padding: 12px 12px; 
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md, 8px);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
}

.base-add-button:hover {
  filter: brightness(0.95);
  box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.base-add-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
}

.icon-plus {
  font-size: 0.9rem;
}
</style>
