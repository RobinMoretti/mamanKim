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
  storage: window.localStorage,
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
    storyId: null,
    saveId: null,
    endGame: false,
  },
  getters:{
    hasAutosave: state => {
      return state.saveId ? true : false;
    }
  },
  actions: {
    init: function({dispatch, commit, state, getters}){
      commit("startGame");

      setTimeout(()=>{
        this.$app.story().state["end-game"] = true;

        console.log('end-game')
      }, 900000);
      // 900000
    },
    saveGame: function({commit, state}) {
      if (this.$app.story() && state.loaded) {
        console.log('saving...')
        commit('createAutoSave', this.$app.story().saveHash());
      }
    },
    reset: function({dispatch, commit, state}){
      dispatch("places/reset");
      dispatch("objects/reset");
      commit("resetSave");
      location.reload(true);
    },
    endGame: function({commit}) {
      commit("toggleEndGame");
    }
  },
  mutations: {
    toggleEndGame: function(state){
      state.endGame = true;
    },
    resetSave: function(state){
      state.playMode = "picking";
      state.gameStarted = false;
      state.saveId = null;
      state.storyId = null;
      state.endGame = false;
    },
    createAutoSave: function(state, hash){
      state.saveId = hash;
    },
    startGame: function(state){
      state.gameStarted = true;
      state.loaded = true;
    },
    changePlayMode: function(state, mode){
      state.playMode = mode;
    }
  },
  plugins: [vuexLocal.plugin]
})