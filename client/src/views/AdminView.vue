<template>
  <div class="admin-container">
    <BaseCard title="Gestión de Usuarios" description="Administra los accesos y roles de los usuarios registrados." icon="fa-solid fa-users">
      
      <!-- Fila de Tarjetas de Indicadores -->
      <div class="metrics-grid">
        <BaseMetricCard title="Total Usuarios" :value="usersList.length" icon="fa-solid fa-users" />
        <BaseMetricCard title="Activos" :value="activeUsersCount" icon="fa-solid fa-circle-check" />
        <BaseMetricCard title="Pendientes" :value="pendingUsersCount" icon="fa-solid fa-circle-info" />
        <BaseMetricCard title="Eliminados" :value="deletedUsersCount" icon="fa-solid fa-circle-xmark" />
      </div>

      <!-- Barra de herramientas: Búsqueda, Filtros y Botón Nuevo -->
      <div class="toolbar-section">
        <BaseSearchFilter 
          v-model="searchQuery" 
          placeholder="Buscar por nombre o correo..."
          :has-active-filters="Boolean(selectedRoleFilter || selectedStatusFilter)"
          @clear-filters="clearAllFilters"
        >
          <template #filters>
            <div class="filter-group">
              <label class="filter-label">Rol</label>
              <select v-model="selectedRoleFilter" class="filter-select">
                <option value="">Todos los roles</option>
                <option v-for="rol in uniqueRoles" :key="rol" :value="rol">{{ rol }}</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Estado</label>
              <select v-model="selectedStatusFilter" class="filter-select">
                <option value="">Todos los estados</option>
                <option v-for="status in uniqueStatuses" :key="status" :value="status">{{ status }}</option>
              </select>
            </div>
          </template>
        </BaseSearchFilter>

        <BaseAddButton 
          v-if="authStore.hasPermission('panel-admin:usuarios:create')" 
          @click="handleOpenAddModal"
        >
          Nuevo
        </BaseAddButton>
      </div>

      <!-- Tabla de datos -->
      <BaseTable :columns="userColumns" :data="filteredUsers">
        <template #nombre_completo="{ row }">
          <span class="user-name">
            {{ row.nombre }} {{ row.apellido_paterno }} {{ row.apellido_materno || '' }}
          </span>
        </template>

        <template #rol="{ row }">
          <span class="badge-global neutral">
            {{ row.usuario_roles?.[0]?.rol?.nombre || 'Sin rol' }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="actions-cell">
            <button v-if="authStore.hasPermission('panel-admin:usuarios:read')" class="btn-action" title="Ver detalles" @click="handleView(row)">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button v-if="authStore.hasPermission('panel-admin:usuarios:update')" class="btn-action" title="Modificar usuario" @click="handleEdit(row)">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button v-if="authStore.hasPermission('panel-admin:usuarios:delete')" class="btn-action" title="Eliminar usuario" @click="handleDelete(row)">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </template>
      </BaseTable>

    </BaseCard>

    <!-- MODAL ÚNICO CENTRALIZADO -->
    <BaseModal 
      :is-open="isModalOpen" 
      :title="modalTitle" 
      @close="closeModal"
    >
      <!-- VISTA DE FORMULARIO (CREAR / EDITAR) -->
      <form v-if="modalMode === 'create' || modalMode === 'edit'" @submit.prevent="handleSubmitForm">
        <div class="form-row">
          <BaseInput v-model="form.nombre" label="Nombre" />
          <BaseInput v-model="form.apellido_paterno" label="Apellido Paterno" />
          <BaseInput v-model="form.apellido_materno" label="Apellido Materno (opcional)" />
        </div>

        <div class="form-row">
          <BaseInput 
            v-if="modalMode === 'create'"
            v-model="form.correo" 
            type="email" 
            label="Correo Electrónico" 
          />
          <BaseInput 
            v-else
            v-model="form.correo" 
            label="Correo Electrónico" 
            readonly
            hint="El correo electrónico no se puede modificar."
          />

          <BasePasswordInput 
            v-if="modalMode === 'create'"
            v-model="form.contrasena" 
            label="Contraseña" 
          />
        </div>

        <div class="form-row">
          <BaseInput v-model="form.telefono_1" label="Teléfono Principal" />
          <BaseInput v-model="form.telefono_2" label="Teléfono Secundario (opcional)" />
        </div>

        <!-- Estado, Rol y Unidad Administrativa en una sola línea -->
        <div class="form-row">
          <BaseSelect 
            v-model="form.estado" 
            label="Estado del Usuario" 
            :options="[
              { id: 'Activo', nombre: 'Activo' },
              { id: 'Inactivo', nombre: 'Inactivo' },
              { id: 'Pendiente', nombre: 'Pendiente' },
              { id: 'Eliminado', nombre: 'Eliminado' }
            ]"
            value-field="id"
            label-field="nombre"
          />
          
          <BaseSelect 
            v-if="authStore.hasPermission('panel-admin:usuarios:assign')"
            v-model="form.id_rol" 
            label="Rol del Usuario" 
            :options="rolesList" 
            value-field="id_rol"
            label-field="nombre"
            icon="fa-solid fa-user-tag"
          />

          <BaseSelect 
            v-if="isUnidadAdministrativaRole"
            v-model="form.id_unidad_administrativa" 
            label="Unidad Administrativa" 
            :options="unidadesList" 
            value-field="id_unidad_administrativa"
            label-field="nombre"
            icon="fa-solid fa-building"
          />
        </div>
      </form>

      <!-- VISTA DE DETALLES (READ) -->
      <div v-else-if="modalMode === 'view'" class="view-details-container">
        <p><strong>ID:</strong> {{ selectedUser?.id_usuario }}</p>
        <p><strong>Nombre Completo:</strong> {{ selectedUser?.nombre }} {{ selectedUser?.apellido_paterno }} {{ selectedUser?.apellido_materno || '' }}</p>
        <p><strong>Correo:</strong> {{ selectedUser?.correo }}</p>
        <p><strong>Teléfono Principal:</strong> {{ selectedUser?.telefono_1 || 'N/A' }}</p>
        <p><strong>Teléfono Secundario:</strong> {{ selectedUser?.telefono_2 || 'N/A' }}</p>
        <p><strong>Estado:</strong> {{ selectedUser?.estado }}</p>
        <p><strong>Rol:</strong> {{ selectedUser?.usuario_roles?.[0]?.rol?.nombre || 'Sin rol' }}</p>
        <p><strong>Fecha de Registro:</strong> {{ formatDate(selectedUser?.fecha_registro) }}</p>     </div>
      <!-- VISTA DE CONFIRMACIÓN (DELETE) -->
      <div v-else-if="modalMode === 'delete'" class="delete-confirmation">
        <p>¿Estás seguro de que deseas eliminar al usuario <strong>{{ selectedUser?.nombre }} {{ selectedUser?.apellido_paterno }}</strong>?</p>
        <p class="text-danger">Esta acción cambiará su estado o dará de baja su acceso al sistema.</p>
      </div>

      <!-- BOTONES DE PIE DE PÁGINA -->
      <template #footer>
        <!-- En modo vista, se muestra un botón único de Aceptar -->
        <button v-if="modalMode === 'view'" class="btn-primary" type="button" @click="closeModal">Aceptar</button>
        
        <!-- En los demás modos, se muestran los botones de acción estándar -->
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
import BaseMetricCard from '@/components/shared/gui/BaseMetricCard.vue'
import BaseTable from '@/components/shared/gui/BaseTable.vue'
import BaseSearchFilter from '@/components/shared/gui/BaseSearchFilter.vue'
import BaseAddButton from '@/components/shared/gui/BaseAddButton.vue'

import BaseModal from '@/components/shared/gui/BaseModal.vue'
import BaseInput from '@/components/shared/forms/BaseInput.vue'
import BasePasswordInput from '@/components/shared/forms/BasePasswordInput.vue'
import BaseSelect from '@/components/shared/forms/BaseSelect.vue'

const authStore = useAuthStore()
const usersList = ref([])
const rolesList = ref([])
const unidadesList = ref([])
const searchQuery = ref('')
const selectedRoleFilter = ref('')
const selectedStatusFilter = ref('')

const isModalOpen = ref(false)
const modalMode = ref('create')
const selectedUser = ref(null)

const form = ref({
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  correo: '',
  contrasena: '',
  telefono_1: '',
  telefono_2: '',
  estado: 'Activo',
  id_rol: '',
  id_unidad_administrativa: ''
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const userColumns = [
  { key: 'id_usuario', label: 'ID' },
  { key: 'nombre_completo', label: 'Usuario' },
  { key: 'correo', label: 'Correo Electrónico' },
  { key: 'rol', label: 'Rol' },
  { key: 'estado', label: 'Estado' }
]

const activeUsersCount = computed(() => usersList.value.filter(u => String(u.estado).toUpperCase() === 'ACTIVO').length)
const pendingUsersCount = computed(() => usersList.value.filter(u => ['PENDIENTE', 'EN_REVISION', 'EN PROCESO'].includes(String(u.estado).toUpperCase())).length)
const deletedUsersCount = computed(() => usersList.value.filter(u => String(u.estado).toUpperCase() === 'ELIMINADO').length)

// Detecta si el rol seleccionado es "Unidad Administrativa" (ID 4)
const isUnidadAdministrativaRole = computed(() => {
  return Number(form.value.id_rol) === 4
})

const uniqueRoles = computed(() => {
  const roles = usersList.value.map(u => u.usuario_roles?.[0]?.rol?.nombre).filter(Boolean)
  return [...new Set(roles)]
})

const uniqueStatuses = computed(() => {
  const statuses = usersList.value.map(u => u.estado).filter(Boolean)
  return [...new Set(statuses)]
})

const filteredUsers = computed(() => {
  return usersList.value.filter(user => {
    const fullName = `${user.nombre} ${user.apellido_paterno} ${user.apellido_materno || ''}`.toLowerCase()
    const email = (user.correo || '').toLowerCase()
    const roleName = user.usuario_roles?.[0]?.rol?.nombre || 'Sin rol'
    const status = user.estado || ''
    
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = fullName.includes(query) || email.includes(query)
    const matchesRole = !selectedRoleFilter.value || roleName === selectedRoleFilter.value
    const matchesStatus = !selectedStatusFilter.value || status === selectedStatusFilter.value

    return matchesSearch && matchesRole && matchesStatus
  })
})

const clearAllFilters = () => {
  selectedRoleFilter.value = ''
  selectedStatusFilter.value = ''
  searchQuery.value = ''
}

const modalTitle = computed(() => {
  switch (modalMode.value) {
    case 'create': return 'Registrar Nuevo Usuario'
    case 'edit': return 'Modificar Usuario'
    case 'view': return 'Detalles del Usuario'
    case 'delete': return 'Eliminar Usuario'
    default: return 'Modal'
  }
})

const handleOpenAddModal = () => {
  modalMode.value = 'create'
  selectedUser.value = null
  form.value = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    contrasena: '',
    telefono_1: '',
    telefono_2: '',
    estado: 'Activo',
    id_rol: '',
    id_unidad_administrativa: ''
  }
  isModalOpen.value = true
}

const handleView = (user) => {
  modalMode.value = 'view'
  selectedUser.value = user
  isModalOpen.value = true
}

const handleEdit = (user) => {
  modalMode.value = 'edit'
  selectedUser.value = user
  form.value = {
    nombre: user.nombre || '',
    apellido_paterno: user.apellido_paterno || '',
    apellido_materno: user.apellido_materno || '',
    correo: user.correo || '',
    telefono_1: user.telefono_1 || '',
    telefono_2: user.telefono_2 || '',
    estado: user.estado || 'Activo',
    id_rol: user.usuario_roles?.[0]?.rol?.id_rol || '',
    id_unidad_administrativa: user.id_unidad_administrativa || ''
  }
  isModalOpen.value = true
}

const handleDelete = (user) => {
  modalMode.value = 'delete'
  selectedUser.value = user
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSubmitForm = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    let url = `${apiUrl}/panel-admin/usuarios`
    let method = 'POST'

    if (modalMode.value === 'edit') {
      url = `${apiUrl}/panel-admin/usuarios/${selectedUser.value.id_usuario}`
      method = 'PUT'
    } else if (modalMode.value === 'delete') {
      url = `${apiUrl}/panel-admin/usuarios/${selectedUser.value.id_usuario}`
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
      const payload = { ...form.value }
      if (modalMode.value === 'edit') {
        delete payload.correo // Evita alterar el correo
      }
      // Limpiar unidad administrativa si el rol no es 4
      if (Number(payload.id_rol) !== 4) {
        payload.id_unidad_administrativa = null
      }
      options.body = JSON.stringify(payload)
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (!response.ok) throw new Error(data.error || 'Ocurrió un error en la operación')

    await fetchUsers()
    closeModal()
  } catch (error) {
    console.error('Error:', error)
    alert(error.message)
  }
}

const fetchUsers = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const response = await fetch(`${apiUrl}/panel-admin/usuarios`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error al obtener los usuarios')
    usersList.value = Array.isArray(data) ? data : (data.usuarios || data.data || [])
  } catch (error) {
    console.error('Error:', error)
  }
}

const fetchRolesAndUnits = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    
    // Cargar roles
    const rolesRes = await fetch(`${apiUrl}/panel-admin/roles`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (rolesRes.ok) {
      const rolesData = await rolesRes.json()
      rolesList.value = Array.isArray(rolesData) ? rolesData : (rolesData.roles || rolesData.data || [])
    }

    // Cargar unidades administrativas
    const unitsRes = await fetch(`${apiUrl}/panel-admin/unidades-administrativas`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (unitsRes.ok) {
      const unitsData = await unitsRes.json()
      unidadesList.value = Array.isArray(unitsData) ? unitsData : (unitsData.unidades || unitsData.data || [])
    }
  } catch (error) {
    console.error('Error al cargar catálogos:', error)
  }
}

onMounted(() => {
  fetchUsers()
  fetchRolesAndUnits()
})
</script>

<style scoped>
.admin-container {
  padding: var(--spacing-lg);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
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

.user-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-md);
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
