<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
    </label>
    
    <div class="input-wrapper">
      <i v-if="icon" :class="icon" class="input-icon"></i>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        class="form-control"
        :class="{ 'has-icon': icon, 'is-invalid': error, 'readonly-field': readonly }"
        @input="$emit('update:modelValue',$event.target.value)"
        @blur="$emit('blur',$event)"
      />
    </div>

    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-else-if="hint" class="hint-message">{{ hint }}</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  icon: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  id: { type: String, default: () => `input-${Math.random().toString(36).substr(2, 9)}` }
})

defineEmits(['update:modelValue', 'blur'])
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
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: var(--font-size-sm);
  font-family: var(--font-primary);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
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

.form-control:disabled {
  background-color: var(--color-gray-lighter);
  cursor: not-allowed;
}

.readonly-field {
  background-color: var(--color-gray-lighter);
  color: var(--color-text-secondary);
  cursor: default;
}

.form-control.is-invalid {
  border-color: var(--color-primary);
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
}

.hint-message {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
