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
    appStarted: false,
    playTime: 0,
  },
  getters:{
    hasAutosave: state => {
      return state.saveId ? true : false;
    }
  },
  actions: {
    init: function({dispatch, commit, state, getters}){
      commit("startGame");
      // 900000
    },
    saveGame: function({commit, state}) {
      if (this.$app.story() && state.loaded) {
        console.log('saving...')
        commit('createAutoSave', this.$app.story().saveHash());
        commit('updatePlayTime');
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
    updatePlayTime: function(state){
      state.playTime = Date.now() - state.appStarted;
    },
    toggleEndGame: function(state){
      state.endGame = true;
    },
    resetSave: function(state){
      state.playMode = "picking";
      state.gameStarted = false;
      state.saveId = null;
      state.storyId = null;
      state.endGame = false;
      state.appStarted = false;
      state.playTime = false;
    },
    createAutoSave: function(state, hash){
      state.saveId = hash;
    },
    startGame: function(state){
      state.gameStarted = true;
      state.loaded = true;
      state.appStarted = Date.now() - state.playTime;

      var timeLeft = 900000 - state.playTime;

      setTimeout(()=>{
        this.$app.story().state["end-game"] = true;
      }, timeLeft);
    },
    changePlayMode: function(state, mode){
      state.playMode = mode;
    },
    togglePlayMode: function (state) {
      console.log('togglePlayMode')
      if(state.playMode == "looking"){
        state.playMode = "picking";
      }
      else {
        state.playMode = "looking";
      }
    }
  },
  plugins: [vuexLocal.plugin]
})