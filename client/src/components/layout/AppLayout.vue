<template>
  <div class="app-layout">
    <!-- Navbar ahora vive afuera para abarcar el 100% del ancho de la pantalla -->
    <Navbar />
    
    <div class="layout-body">
      <Sidebar />
      <div class="main-content">
        <div class="page-content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue'
import Navbar from './Topbar.vue'

export default {
  name: 'AppLayout',
  components: { Sidebar, Navbar }
}
</script>

<style>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Contenedor que agrupa el sidebar y el contenido principal debajo del navbar */
.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.page-content {
  flex: 1;
  padding: var(--spacing-lg, 1rem);
  background: var(--color-background, #f5f5f5);
}
</style>
