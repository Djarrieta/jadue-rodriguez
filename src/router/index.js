import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store/index.js"

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
