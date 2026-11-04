<template>
  <div class="matriz-container">
    <BaseCard 
      title="Gestión de Riesgos" 
      description="Listado de riesgos identificados, clave de seguimiento y soluciones propuestas." 
      icon="fa-solid fa-triangle-exclamation"
    >
      <!-- Barra de herramientas -->
      <div class="toolbar-section">
        <BaseSearchFilter 
          v-model="searchQuery" 
          placeholder="Buscar por descripción o solución..." 
          :has-active-filters="Boolean(selectedAnioFilter)"
          @clear-filters="clearAllFilters"
        >
          <template #filters>
            <div class="filter-group">
              <label class="filter-label">Año</label>
              <select v-model="selectedAnioFilter" class="filter-select">
                <option value="">Todos los años</option>
                <option v-for="anio in uniqueAnios" :key="anio" :value="anio">{{ anio }}</option>
              </select>
            </div>
          </template>
        </BaseSearchFilter>

        <BaseAddButton 
          v-if="authStore.hasPermission('matriz-seguimiento:riesgos:create')" 
          @click="handleOpenAddModal"
        >
          Nuevo
        </BaseAddButton>
      </div>

      <!-- Tabla de datos -->
      <BaseTable :columns="riesgosColumns" :data="filteredRiesgos">
        <template #anio="{ row }">
          <span class="text-anio">{{ row.anio }}</span>
        </template>

        <template #identificador="{ row }">
          <span class="badge-code">
            {{ row.anio }}-{{ String(row.numero).padStart(2, '0') }}
          </span>
        </template>

        <template #descripcion="{ row }">
          <span class="text-description">{{ row.descripcion }}</span>
        </template>

        <template #solucion="{ row }">
          <span class="text-solution">{{ row.solucion || 'Sin solución asignada' }}</span>
        </template>

        <template #actions="{ row }">
          <div class="actions-cell">
            <button v-if="authStore.hasPermission('matriz-seguimiento:riesgos:read')" class="btn-action" title="Ver detalles" @click="handleView(row)">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button v-if="authStore.hasPermission('matriz-seguimiento:riesgos:update')" class="btn-action" title="Modificar riesgo" @click="handleEdit(row)">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button v-if="authStore.hasPermission('matriz-seguimiento:riesgos:delete')" class="btn-action" title="Eliminar riesgo" @click="handleDelete(row)">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <!-- MODAL ÚNICO CENTRALIZADO (CRUD) -->
    <BaseModal 
      :is-open="isModalOpen" 
      :title="modalTitle" 
      @close="closeModal"
    >
      <!-- FORMULARIO (CREAR / EDITAR) - Sin campo de número -->
      <form v-if="modalMode === 'create' || modalMode === 'edit'" @submit.prevent="handleSubmitForm">
        <div class="form-row">
          <BaseInput v-model.number="form.anio" type="number" label="Año" />
        </div>

        <div class="form-row">
          <BaseInput v-model="form.descripcion" label="Descripción del Riesgo" />
        </div>

        <div class="form-row">
          <BaseInput v-model="form.solucion" label="Solución Propuesta" />
        </div>
      </form>

      <!-- VISTA DE DETALLES (READ) -->
      <div v-else-if="modalMode === 'view'" class="view-details-container">
        <p><strong>ID:</strong> {{ selectedRiesgo?.id_riesgo }}</p>
        <p><strong>Clave / Identificador:</strong> {{ selectedRiesgo?.anio }}-{{ String(selectedRiesgo?.numero).padStart(2, '0') }}</p>
        <p><strong>Año:</strong> {{ selectedRiesgo?.anio }}</p>
        <p><strong>Descripción del Riesgo:</strong> {{ selectedRiesgo?.descripcion }}</p>
        <p><strong>Solución Propuesta:</strong> {{ selectedRiesgo?.solucion || 'N/A' }}</p>
      </div>

      <!-- VISTA DE CONFIRMACIÓN (DELETE) -->
      <div v-else-if="modalMode === 'delete'" class="delete-confirmation">
        <p>¿Estás seguro de que deseas eliminar el riesgo <strong>{{ selectedRiesgo?.anio }}-{{ String(selectedRiesgo?.numero).padStart(2, '0') }}</strong>?</p>
        <p class="text-danger">Esta acción eliminará permanentemente el registro de la matriz de seguimiento.</p>
      </div>

      <!-- BOTONES DE PIE DE PÁGINA -->
      <template #footer>
        <button v-if="modalMode === 'view'" class="btn-primary" type="button" @click="closeModal">Aceptar</button>
        
        <template v-else>
          <button class="btn-secondary" type="button" @click="closeModal">Cancelar</button>
          <button 
            class="btn-primary" 
            type="button" 
            @click="handleSubmitForm"
          >
            {{ modalMode === 'delete' ? 'Sí, eliminar' : (modalMode === 'create' ? 'Registrar' : 'Guardar cambios') }}
          </button>
        </template>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/shared/gui/BaseCard.vue'
import BaseTable from '@/components/shared/gui/BaseTable.vue'
import BaseSearchFilter from '@/components/shared/gui/BaseSearchFilter.vue'
import BaseAddButton from '@/components/shared/gui/BaseAddButton.vue'
import BaseModal from '@/components/shared/gui/BaseModal.vue'
import BaseInput from '@/components/shared/forms/BaseInput.vue'

const authStore = useAuthStore()
const riesgosList = ref([])
const searchQuery = ref('')
const selectedAnioFilter = ref('')

const isModalOpen = ref(false)
const modalMode = ref('create')
const selectedRiesgo = ref(null)

const currentYear = new Date().getFullYear()

// Ya no necesitamos manejar 'numero' en el formulario del cliente
const form = ref({
  anio: currentYear,
  descripcion: '',
  solucion: ''
})

const riesgosColumns = [
  { key: 'anio', label: 'Año' },
  { key: 'identificador', label: 'Clave' },
  { key: 'descripcion', label: 'Descripción del Riesgo' },
  { key: 'solucion', label: 'Solución Propuesta' }
]

const uniqueAnios = computed(() => {
  const anios = riesgosList.value.map(r => r.anio).filter(Boolean)
  return [...new Set(anios)].sort((a, b) => b - a)
})

const filteredRiesgos = computed(() => {
  return riesgosList.value.filter(riesgo => {
    const desc = (riesgo.descripcion || '').toLowerCase()
    const sol = (riesgo.solucion || '').toLowerCase()
    const clave = `${riesgo.anio}-${String(riesgo.numero).padStart(2, '0')}`.toLowerCase()
    
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = desc.includes(query) || sol.includes(query) || clave.includes(query)
    const matchesAnio = !selectedAnioFilter.value || String(riesgo.anio) === String(selectedAnioFilter.value)

    return matchesSearch && matchesAnio
  })
})

const clearAllFilters = () => {
  selectedAnioFilter.value = ''
  searchQuery.value = ''
}

const modalTitle = computed(() => {
  switch (modalMode.value) {
    case 'create': return 'Registrar Nuevo Riesgo'
    case 'edit': return 'Modificar Riesgo'
    case 'view': return 'Detalles del Riesgo'
    case 'delete': return 'Eliminar Riesgo'
    default: return 'Modal'
  }
})

const handleOpenAddModal = () => {
  modalMode.value = 'create'
  selectedRiesgo.value = null
  form.value = {
    anio: currentYear,
    descripcion: '',
    solucion: ''
  }
  isModalOpen.value = true
}

const handleView = (row) => {
  modalMode.value = 'view'
  selectedRiesgo.value = row
  isModalOpen.value = true
}

const handleEdit = (row) => {
  modalMode.value = 'edit'
  selectedRiesgo.value = row
  form.value = {
    anio: row.anio || currentYear,
    descripcion: row.descripcion || '',
    solucion: row.solucion || ''
  }
  isModalOpen.value = true
}

const handleDelete = (row) => {
  modalMode.value = 'delete'
  selectedRiesgo.value = row
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSubmitForm = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    let url = `${apiUrl}/matriz-seguimiento/riesgos`
    let method = 'POST'

    if (modalMode.value === 'edit') {
      url = `${apiUrl}/matriz-seguimiento/riesgos/${selectedRiesgo.value.id_riesgo}`
      method = 'PUT'
    } else if (modalMode.value === 'delete') {
      url = `${apiUrl}/matriz-seguimiento/riesgos/${selectedRiesgo.value.id_riesgo}`
      method = 'DELETE'
    }

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      }
    }

    if (modalMode.value !== 'delete') {
      options.body = JSON.stringify(form.value)
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (!response.ok) throw new Error(data.error || 'Ocurrió un error en la operación')

    await fetchRiesgos()
    closeModal()
  } catch (error) {
    console.error('Error:', error)
    alert(error.message)
  }
}

const fetchRiesgos = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const response = await fetch(`${apiUrl}/matriz-seguimiento/riesgos`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error al obtener los riesgos')
    riesgosList.value = Array.isArray(data) ? data : (data.riesgos || data.data || [])
  } catch (error) {
    console.error('Error:', error)
  }
}

onMounted(() => {
  fetchRiesgos()
})
</script>

<style scoped>
.matriz-container {
  padding: var(--spacing-lg);
}

.toolbar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-lg);
}

.toolbar-section :deep(.base-search-filter) {
  flex: 1;
  margin-bottom: 0;
}

.text-anio {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.badge-code {
  background-color: var(--color-gray-lighter);
  color: var(--color-gray-dark);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  font-family: monospace;
}

.text-description {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.text-solution {
  color: var(--color-text-muted);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.view-details-container p {
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.delete-confirmation {
  text-align: center;
  padding: var(--spacing-sm) 0;
  font-size: var(--font-size-sm);
}
</style>
