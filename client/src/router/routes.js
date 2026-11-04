import AuthView from '../views/AuthView.vue'
import HomeView from '../views/HomeView.vue'
import MatrizSeguimientoView from '../views/MatrizSeguimientoView.vue'
import MapaRiesgosView from '../views/MapaRiesgosView.vue'
import PTARMatrizRiesgosView from '../views/PTARMatrizRiesgosView.vue'
import SeguimientoAccionesView from '../views/SeguimientoAccionesView.vue'
import GestionEvidenciasView from '../views/GestionEvidenciasView.vue'
import InformesView from '../views/InformesView.vue'
import DashboardView from '../views/DashboardView.vue'
import AdminView from '../views/AdminView.vue'
import NotFoundView from '../views/NotFoundView.vue'

import AppLayout from '../components/layout/AppLayout.vue'

export default [
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'home', name: 'Home', component: HomeView },
      { path: 'matriz-seguimiento', name: 'MatrizSeguimiento', component: MatrizSeguimientoView },
      { path: 'mapa-riesgos', name: 'MapaRiesgos', component: MapaRiesgosView },
      { path: 'ptar-matriz-riesgos', name: 'PTARMatrizRiesgos', component: PTARMatrizRiesgosView },
      { path: 'seguimiento-acciones', name: 'SeguimientoAcciones', component: SeguimientoAccionesView },
      { path: 'gestion-evidencias', name: 'GestionEvidencias', component: GestionEvidenciasView },
      { path: 'informes', name: 'Informes', component: InformesView },
      { path: 'dashboard', name: 'Dashboard', component: DashboardView },
      { path: 'admin', name: 'Admin', component: AdminView }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView
  }
]
