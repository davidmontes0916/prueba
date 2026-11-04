<template>
  <div class="home-container">
    <BaseCard 
      title="Inicio" 
      description="Bienvenido al panel principal de control y seguimiento del sistema." 
      icon="fa-solid fa-house"
    >
      
      <!-- Tarjetas de indicadores con cálculo automático de año y trimestre -->
      <div class="metrics-grid">
        
        <!-- Tarjeta Año (Dinámico) -->
        <div class="base-metric-card metric-gold">
          <div class="metric-icon-container">
            <i class="fa-solid fa-calendar-days"></i>
          </div>
          <div class="metric-content">
            <span class="metric-title">Año de Operación</span>
            <span class="metric-value">{{ currentYear }}</span>
            <span class="metric-subtitle">Año vigente</span>
          </div>
        </div>

        <!-- Tarjeta Trimestre (Dinámico según la fecha) -->
        <div class="base-metric-card metric-lime">
          <div class="metric-icon-container">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="metric-content">
            <span class="metric-title">Trimestre Actual</span>
            <span class="metric-value">Trimestre {{ currentQuarter.number }}</span>
            <span class="metric-subtitle">{{ currentQuarter.months }}</span>
          </div>
        </div>

      </div>

      <!-- Sección de bienvenida informativa -->
      <div class="welcome-banner">
        <h3><i class="fa-solid fa-circle-info"></i> Panel de Navegación</h3>
        <p>
          Utiliza el menú lateral izquierdo para acceder rápidamente a la 
          <strong>Matriz de seguimiento</strong>, gestión de riesgos, evidencias y el panel de administración de usuarios.
        </p>
      </div>

    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '@/components/shared/gui/BaseCard.vue'

// Obtener el año actual del sistema de forma dinámica
const currentYear = computed(() => new Date().getFullYear())

// Calcular el trimestre actual basado en el mes actual (0 = Enero, 11 = Diciembre)
const currentQuarter = computed(() => {
  const month = new Date().getMonth() // 0 a 11

  if (month >= 0 && month <= 2) {
    return { number: 1, months: 'Enero - Marzo' }
  } else if (month >= 3 && month <= 5) {
    return { number: 2, months: 'Abril - Junio' }
  } else if (month >= 6 && month <= 8) {
    return { number: 3, months: 'Julio - Septiembre' }
  } else {
    return { number: 4, months: 'Octubre - Diciembre' }
  }
})
</script>

<style scoped>
.home-container {
  padding: var(--spacing-lg);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

/* Estructura base de las tarjetas de indicadores */
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
  font-size: 1.25rem;
  flex-shrink: 0;
}

/* Variante Dorado / Oro institucional */
.metric-gold .metric-icon-container {
  background-color: var(--color-accent-lighter);
  color: var(--color-accent);
}

/* Variante Verde Limón */
.metric-lime .metric-icon-container {
  background-color: var(--color-lime-lighter);
  color: var(--color-lime);
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-title {
  font-size: var(--font-size-xs, 0.75rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: var(--font-size-xl, 1.5rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.metric-subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

/* Banner informativo inferior */
.welcome-banner {
  background-color: var(--color-gray-lighter);
  border-left: 4px solid var(--color-primary);
  padding: var(--spacing-md);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.welcome-banner h3 {
  font-size: var(--font-size-md);
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.welcome-banner h3 i {
  color: var(--color-primary);
}

.welcome-banner p {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.5;
}
</style>
