<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
    </label>
    
    <div class="input-wrapper">
      <i v-if="icon" :class="icon" class="input-icon"></i>
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        class="form-control"
        :class="{ 'has-icon': icon, 'is-invalid': error }"
        @change="$emit('update:modelValue',$event.target.value)"
      >
        <option value="" disabled v-if="placeholder">{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="option[valueField]" 
          :value="option[valueField]"
        >
          {{ option[labelField] }}
        </option>
      </select>
      <i class="fa-solid fa-chevron-down select-arrow"></i>
    </div>

    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
  label: { type: String, default: '' },
  options: { type: Array, required: true },
  valueField: { type: String, default: 'id' },
  labelField: { type: String, default: 'nombre' },
  placeholder: { type: String, default: 'Seleccione una opción' },
  icon: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  id: { type: String, default: () => `select-${Math.random().toString(36).substr(2, 9)}` }
})

defineEmits(['update:modelValue'])
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

.input-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  pointer-events: none;
  z-index: 2;
}

.form-control {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: var(--font-size-sm);
  font-family: var(--font-primary);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  appearance: none;
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-control.has-icon {
  padding-left: 2.25rem;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-lighter);
}

.select-arrow {
  position: absolute;
  right: 0.75rem;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  pointer-events: none;
}

.form-control.is-invalid {
  border-color: var(--color-primary);
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
}
</style>
