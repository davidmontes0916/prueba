import { ref } from 'vue'

export function useMatrizSeguimiento() {
  const risks = ref([
    { id: 1, noRiesgo: '2025_1', anio: 2025, numero: 1, descripcion: 'Indices de reprobacion altos', solucion: 'Implementar asesorías académicas', fileName: 'reporte_asesorias.pdf' },
    { id: 2, noRiesgo: '2025_2', anio: 2025, numero: 2, descripcion: 'Falta de asistencia a clases', solucion: 'Notificación automática a tutores', fileName: null },
    { id: 3, noRiesgo: '2025_3', anio: 2025, numero: 3, descripcion: 'Bajo rendimiento académico', solucion: 'Talleres de hábitos de estudio', fileName: 'plan_talleres.docx' }
  ])

  const isFormModalOpen = ref(false)
  const isDetailModalOpen = ref(false)
  const isEditing = ref(false)
  const editIndex = ref(null)

  const form = ref({
    anio: new Date().getFullYear(),
    numero: '',
    descripcion: '',
    solucion: '',
    fileName: null
  })

  const selectedRisk = ref(null)

  const openCreateModal = () => {
    isEditing.value = false
    editIndex.value = null
    form.value = {
      anio: new Date().getFullYear(),
      numero: risks.value.length + 1,
      descripcion: '',
      solucion: '',
      fileName: null
    }
    isFormModalOpen.value = true
  }

  const openEditModal = (item) => {
    isEditing.value = true
    editIndex.value = risks.value.findIndex(r => r.noRiesgo === item.noRiesgo)
    form.value = { ...item }
    isFormModalOpen.value = true
  }

  const closeFormModal = () => {
    isFormModalOpen.value = false
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      form.value.fileName = file.name
    }
  }

  const saveRisk = () => {
    const generatedNoRiesgo = `${form.value.anio}_${form.value.numero}`

    if (isEditing.value && editIndex.value !== null) {
      risks.value[editIndex.value] = {
        ...form.value,
        noRiesgo: generatedNoRiesgo
      }
    } else {
      risks.value.push({
        id: Date.now(),
        noRiesgo: generatedNoRiesgo,
        ...form.value
      })
    }
    closeFormModal()
  }

  const deleteRisk = (index) => {
    if (confirm('¿Estás seguro de que deseas eliminar este riesgo?')) {
      risks.value.splice(index, 1)
    }
  }

  const openViewModal = (item) => {
    selectedRisk.value = item
    isDetailModalOpen.value = true
  }

  const closeDetailModal = () => {
    isDetailModalOpen.value = false
    selectedRisk.value = null
  }

  return {
    risks,
    isFormModalOpen,
    isDetailModalOpen,
    isEditing,
    form,
    selectedRisk,
    openCreateModal,
    openEditModal,
    closeFormModal,
    handleFileUpload,
    saveRisk,
    deleteRisk,
    openViewModal,
    closeDetailModal
  }
}