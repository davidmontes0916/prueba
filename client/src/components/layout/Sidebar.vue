<template>
  <aside class="sidebar">
    <!-- Menú de navegación principal -->
    <div class="sidebar-content">
      
      <!-- Sección: Principal -->
      <span class="section-title">Principal</span>
      <ul class="sidebar-menu">
        <li>
          <router-link to="/home">
            <span class="icon-box"><i class="fa-solid fa-house"></i></span>Inicio
          </router-link>
        </li>
      </ul>

      <!-- Sección: Seguimiento y documentación -->
      <span class="section-title">Seguimiento y documentación</span>
      <ul class="sidebar-menu">
        <li>
          <router-link to="/matriz-seguimiento">
            <span class="icon-box"><i class="fa-solid fa-table"></i></span>Matriz de seguimiento
          </router-link>
        </li>
        <li>
          <router-link to="/mapa-riesgos">
            <span class="icon-box"><i class="fa-solid fa-chart-column"></i></span>Mapa de riesgos
          </router-link>
        </li>
        <li>
          <router-link to="/ptar-matriz-riesgos">
            <span class="icon-box"><i class="fa-solid fa-book"></i></span>PTAR y matriz de riesgos
          </router-link>
        </li>
      </ul>

      <!-- Sección: Acciones de control -->
      <span class="section-title">Acciones de control</span>
      <ul class="sidebar-menu">
        <li>
          <router-link to="/seguimiento-acciones">
            <span class="icon-box"><i class="fa-solid fa-check-to-slot"></i></span>Seguimiento de acciones
          </router-link>
        </li>
        <li>
          <router-link to="/gestion-evidencias">
            <span class="icon-box"><i class="fa-solid fa-archive"></i></span>Gestión de evidencias
          </router-link>
        </li>
        <li>
          <router-link to="/informes">
            <span class="icon-box"><i class="fa-solid fa-file-lines"></i></span>Informes
          </router-link>
        </li>
      </ul>

      <!-- Sección: Dirección y administración -->
      <span class="section-title">Dirección y administración</span>
      <ul class="sidebar-menu">
        <li>
          <router-link to="/dashboard">
            <span class="icon-box"><i class="fa-solid fa-chart-pie"></i></span>Dashboard ejecutivo
          </router-link>
        </li>
        <li>
          <router-link to="/admin">
            <span class="icon-box"><i class="fa-solid fa-user-shield"></i></span>Panel de administración
          </router-link>
        </li>
      </ul>

    </div>

    <!-- Sección inferior: Salir / Cerrar sesión -->
    <div class="sidebar-footer">
      <button @click="logout" class="logout-btn">
        <span class="icon-box"><i class="fa-solid fa-right-from-bracket"></i></span> Salir
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  methods: {
    logout() {
      this.$router.push('/auth');
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  min-height: 80vh;
  background-color: var(--color-surface);
  padding: var(--spacing-lg) var(--spacing-md);
  border-right: 1px solid var(--color-border);
  font-family: var(--font-secondary);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  overflow-y: auto;
}

.section-title {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text);
  letter-spacing: 0.8px;
  padding: 12px var(--spacing-md) 4px var(--spacing-md);
  margin-top: var(--spacing-sm);
  margin-bottom: 6px;
  border-top: 1px solid var(--color-divider);
}

.sidebar-content > .section-title:first-of-type {
  border-top: none;
  margin-top: 0;
  padding-top: 4px;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sidebar a {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 8px var(--spacing-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.icon-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.sidebar a i {
  font-size: var(--font-size-md);
  color: var(--color-gray);
  transition: color var(--transition-fast);
}

.sidebar a:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text);
}

/* Enlace activo con estilo de píldora institucional */
.sidebar a.router-link-active {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary-darker);
  font-weight: var(--font-weight-semibold);
}

/* Cuando está activo, la caja del ícono toma el color de fondo y el ícono se vuelve blanco */
.sidebar a.router-link-active .icon-box {
  background-color: var(--color-primary-dark);
}

.sidebar a.router-link-active i {
  color: #FFFFFF;
}

/* Estilo para el botón de cerrar sesión abajo */
.sidebar-footer {
  margin-top: auto;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-divider);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  padding: 10px var(--spacing-md);
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.logout-btn .icon-box {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logout-btn i {
  font-size: var(--font-size-md);
  color: var(--color-primary);
}

.logout-btn:hover {
  background-color: var(--color-primary-lighter);
  color: var(--color-primary-dark);
}
</style>
