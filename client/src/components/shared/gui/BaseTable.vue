<template>
  <div class="table-responsive">
    <table class="custom-table" :class="variant">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label.toUpperCase() }}</th>
          <th v-if="$slots.actions" class="text-center">ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :row="row" :value="row[col.key]">
              <!-- Detección automática de estados y semáforos -->
              <span v-if="getStatusDetails(row[col.key])" class="status-badge" :class="getStatusDetails(row[col.key]).class">
                <i :class="getStatusDetails(row[col.key]).icon"></i>
                {{ getStatusDetails(row[col.key]).text }}
              </span>
              <span v-else>
                {{ row[col.key] }}
              </span>
            </slot>
          </td>
          <td v-if="$slots.actions" class="actions-cell">
            <slot name="actions" :row="row" />
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="empty-state">
            No hay registros disponibles para mostrar.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true, default: () => [] },
  variant: { type: String, default: 'default' }
});

// Función para mapear valores a los estados, colores e íconos correspondientes
const getStatusDetails = (value) => {
  if (value === null || value === undefined) return null;
  const str = String(value).toUpperCase().trim();

  // ÉXITO / ACTIVO / APROBADO / LEÍDA
  if (['ACTIVO', 'APROBADO', 'LEIDA', 'SUCCESS', 'COMPLETADO'].includes(str)) {
    return {
      text: value,
      class: 'badge-success',
      icon: 'fa-solid fa-circle-check'
    };
  }

  // ADVERTENCIA (Alerta / Precaución - Amarillo/Ámbar)
  if (['WARNING', 'ADVERTENCIA', 'PENDIENTE',].includes(str)) {
    return {
      text: value,
      class: 'badge-warning',
      icon: 'fa-solid fa-circle-exclamation'
    };
  }

  // PENDIENTE / EN PROCESO / EN REVISIÓN (Azul / Informativo - En curso)
  if (['INACTIVO', 'EN_REVISION', 'EN PROCESO', 'EN_PROCESO'].includes(str)) {
    return {
      text: value,
      class: 'badge-info',
      icon: 'fa-solid fa-circle-info'
    };
  }

  // ERROR / PELIGRO / ELIMINADO / RECHAZADO
  if (['ELIMINADO', 'RECHAZADO', 'DANGER', 'ERROR', 'CRITICO'].includes(str)) {
    return {
      text: value,
      class: 'badge-danger',
      icon: 'fa-solid fa-circle-xmark'
    };
  }

  // INACTIVO / DESHABILITADO
  if (['INACTIVE', 'DESHABILITADO'].includes(str)) {
    return {
      text: value,
      class: 'badge-inactive',
      icon: 'fa-solid fa-circle-minus'
    };
  }

  // INFORMACIÓN / NEUTRAL
  if (['INFO', 'AVISO', 'CUENTA', 'MATRIZ_RIESGOS', 'PTAR', 'MAPA_RIESGOS'].includes(str)) {
    return {
      text: value,
      class: 'badge-info',
      icon: 'fa-solid fa-circle-info'
    };
  }

  return null;
};
</script>

<style scoped>
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.custom-table th {
  background-color: var(--color-gray-lighter);
  color: var(--color-gray-dark);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: var(--spacing-md);
  border-bottom: 2px solid var(--color-border);
}

.custom-table.primary th {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary-dark);
  border-bottom-color: var(--color-primary);
}

.custom-table td {
  padding: var(--spacing-md);
  font-size: var(--font-size-sm);
  border-bottom: 1px solid var(--color-divider);
  vertical-align: middle;
}

.custom-table tbody tr:hover {
  background-color: var(--color-surface-hover);
}

.text-center {
  text-align: center;
}

.actions-cell {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: center;
  align-items: center;
}

/* Badges de Estado basados en tus variables globales */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 9999px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  white-space: nowrap;
}

.status-badge.badge-success {
  background-color: var(--status-success-lighter);
  color: var(--status-success-dark);
}

.status-badge.badge-warning {
  background-color: var(--status-warning-lighter);
  color: var(--status-warning-dark);
}

.status-badge.badge-danger {
  background-color: var(--status-danger-lighter);
  color: var(--status-danger-dark);
}

.status-badge.badge-info {
  background-color: var(--status-info-lighter);
  color: var(--status-info-dark);
}

.status-badge.badge-inactive {
  background-color: var(--status-inactive-lighter);
  color: var(--status-inactive-dark);
}

/* Botón de acción global reutilizable para tablas */
:deep(.btn-action) {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-gray-dark);
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
}

:deep(.btn-action:hover) {
  background-color: var(--color-gray-lighter);
  border-color: var(--color-gray-light);
  color: var(--color-text);
}

.empty-state {
  text-align: center;
  color: var(--color-text-muted);
  font-style: italic;
  padding: var(--spacing-xl) !important;
}
</style>
