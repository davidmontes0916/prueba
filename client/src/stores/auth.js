import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const modules = ref(JSON.parse(localStorage.getItem('modules')) || [])

  async function login(correo, contrasena) {
    const apiUrl = import.meta.env.VITE_API_URL

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión')
    }

    token.value = data.token
    user.value = data.user
    modules.value = data.modules

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('modules', JSON.stringify(data.modules))

    return data
  }

  function logout() {
    token.value = null
    user.value = null
    modules.value = []
    localStorage.clear()
  }

  /**
   * Valida permisos con el formato "modulo:recurso:accion" (ej. "panel-admin:usuarios:create")
   */
  function hasPermission(permissionString) {
    const parts = permissionString.split(':')
    
    // Si viene en formato completo "modulo:recurso:accion"
    if (parts.length === 3) {
      const [moduleName, , actionName] = parts
      const foundModule = modules.value.find(m => m.nombre === moduleName)
      if (!foundModule) return false
      return foundModule.acciones.includes(actionName)
    }

    // Si pasas solo la acción directa (ej. "create") asumiendo el módulo actual
    if (parts.length === 1) {
      const actionName = parts[0]
      // Revisa si al menos un módulo tiene esa acción o puedes adaptarlo
      return modules.value.some(m => m.acciones.includes(actionName))
    }

    return false
  }

  return { token, user, modules, login, logout, hasPermission }
})
