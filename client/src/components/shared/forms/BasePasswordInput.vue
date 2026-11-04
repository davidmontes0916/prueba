<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
    </label>
    
    <div class="input-wrapper">
      <input
        :id="id"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="form-control"
        :class="{ 'is-invalid': error }"
        @input="$emit('update:modelValue',$event.target.value)"
      />
      <button 
        type="button" 
        class="password-toggle-btn" 
        @click="showPassword = !showPassword"
        :title="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
      >
        <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
      </button>
    </div>

    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Contraseña' },
  placeholder: { type: String, default: '••••••••' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  id: { type: String, default: () => `password-${Math.random().toString(36).substr(2, 9)}` }
})

defineEmits(['update:modelValue'])
const showPassword = ref(false)
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: var(--spacing-md);
  width: 100%;
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-control {
  width: 100%;
  padding: 0.5rem 2.2rem 0.5rem 0.75rem;
  font-size: var(--font-size-sm);
  font-family: var(--font-primary);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-lighter);
}

.password-toggle-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.2rem;
  font-size: 0.85rem;
}

.password-toggle-btn:hover {
  color: var(--color-text);
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
}
</style>
