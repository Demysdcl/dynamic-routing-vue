import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const generateRoute = componentName => {
  return {
    path: `/${componentName.toLowerCase()}`,
    name: componentName.toLowerCase(),
    // webpackChunkName: "[request]" o [request] será substituido por ([componentName]-vue)
    // o arquivo final será ([componentName]-vue.[hash].js) ex: About-vue-91es1946.js
    component: () => import(/* webpackChunkName: "[request]" */ `./views/${componentName}.vue`)
  }
}

function loadRoutes () {
  // queremos apenas o nome do component e o keys() irá retorna tanto ./About quanto ./About.vue
  // então colocamos um regex informado que não queremos os arquivos que contém vue no nome
  // e no último paramêtro colocamos um lazy para informa que vai ser feito o carregamento por demanda
  const response = require.context('./views', true, /^((?!vue).)*$/, 'lazy')
  return response.keys()
    .map(item => item.replace('./', '')) // removendo o './'  dos nomes
    .filter(item => item !== 'Home') // removendo o Home da lista, pois ela será a rota principal
    .map(generateRoute) // gerando um array de Route
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    ...loadRoutes()
  ]
})
