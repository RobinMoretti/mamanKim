import Vue from 'vue'
import Vuex from 'vuex'

import player from './modules/player'
import places from './modules/places'
import objects from './modules/objects'

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
    objects
  },
  strict: debug,
  state:{
    playMode: "picking",
    gameStarted: false,
  },
  actions: {
    init: function({dispatch, commit, state}){
      commit("startGame");
    },
    reset: function({dispatch, commit, state}){
      // commit("startGame");
    },
  },
  mutations: {
    startGame: function(state){
      state.gameStarted = true;
    },
    changePlayMode: function(state, mode){
      state.playMode = mode;
    }
  },
  plugins: [vuexLocal.plugin]
})