import Vue from 'vue'
import Vuex from 'vuex'

import player from './modules/player'
import places from './modules/places'

// import products from './modules/products'

// vuex persistent
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  key: 'vuex',
  storage: window.localStorage
})

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    player, 
    places,
  },
  strict: debug,
  state:{

  },
  actions: {

  },
  mutations: {

  },
  plugins: [vuexLocal.plugin]
})