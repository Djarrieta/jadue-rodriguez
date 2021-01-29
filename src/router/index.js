import Vue from 'vue'
import VueRouter from 'vue-router'
<<<<<<< HEAD
import Home from '../views/Home.vue'
import Calendario from '../views/Calendario.vue'
import Pacientes from '../views/Pacientes.vue'
=======
import store from "@/store/index.js"
>>>>>>> feature/crud-usuarios

import Ingreso from '@/views/Ingreso.vue'
import Agenda from '@/views/Agenda.vue'
import Perfil from '@/views/Perfil.vue'
import Usuarios from '@/views/Usuarios.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Ingreso',
    component: Ingreso,
    meta:{
      ingreso:true
    }
  },
  {
    path: '/agenda',
    name: 'Agenda',
    component: Agenda,
    meta:{
      auth:true
    }
  },
  {
<<<<<<< HEAD
    path: '/pacientes',
    name: 'Pacientes',
    component: Pacientes
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
=======
    path: '/perfil',
    name: 'Perfil',
    component: Perfil,
    meta:{
      auth:true
    }
  },
  {
    path: '/Usuarios',
    name: 'Usuarios',
    component: Usuarios,
    meta:{
      auth:true
    }
  },
>>>>>>> feature/crud-usuarios
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//redirección automática cuando no hay usuario
router.beforeEach((to, from, next) => {
  const auth = to.matched.some((record) => record.meta.auth);
  const ingreso = to.matched.some((record) => record.meta.ingreso);
  let user=store.state.currentUser===null
  user=!user

  if(ingreso && user){
    next("/perfil")
  }else if (auth && !user) {
    next("/")
  }else {
    next();
  }
});

export default router
