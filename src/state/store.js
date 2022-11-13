import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import modules from './modules'
// console.log(modules.auth)
const vuexLocal = new VuexPersistence({
  modules: ['auth'],
  })
const store = createStore({
  modules,
  plugins:[vuexLocal.plugin],
})

export default store

