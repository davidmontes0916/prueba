<template>
  <div class="base-metric-card">
    <div class="metric-icon-container" :class="iconBgClass">
      <i :class="icon"></i>
    </div>
    <div class="metric-content">
      <span class="metric-title">{{ title }}</span>
      <span class="metric-value">{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: 'fa-solid fa-chart-pie'
  },
  // Opcional para cambiar el tono del ícono (primary, success, warning, danger, info)
  variant: {
    type: String,
    default: 'primary'
  }
})
</script>

<style scoped>
.base-metric-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 16px);
  padding: var(--spacing-md, 16px);
  background-color: var(--color-surface, #fff);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 8px);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast, all 0.2s ease);
  flex: 1;
  min-width: 210px;
}

.base-metric-card:hover {
  border-color: var(--color-gray-light);
  box-shadow: var(--shadow-md);
}

.metric-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md, 8px);
  background-color: var(--color-primary-lighter, #F7D9E3);
  color: var(--color-primary);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-title {
  font-size: var(--font-size-xs, 0.75rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted, #718096);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: var(--font-size-xl, 1.5rem);
  font-weight: var(--font-weight-bold, 700);
  color: var(--color-text);
}
</style>
