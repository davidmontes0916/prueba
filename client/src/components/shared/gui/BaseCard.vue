<template>
  <div class="card-container">
    <div v-if="title || $slots.header" class="header-section">
      <div class="header-left">
        <div v-if="$slots.icon || icon" class="card-icon-wrapper">
          <slot name="icon"><i :class="icon"></i></slot>
        </div>
        <div>
          <h2>{{ title }}</h2>
          <p v-if="description">{{ description }}</p>
        </div>
      </div>
      <div v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>
    
    <div>
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: '' }
});
</script>

<style scoped>
.card-container {
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.card-icon-wrapper {
  width: 42px;
  height: 42px;
  background-color: var(--color-gray-lighter);
  border: 1px solid var(--color-border);
  color: var(--color-gray-dark);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-section h2 {
  margin: 0 0 2px 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.header-section p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.card-footer {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-divider);
}
</style>
