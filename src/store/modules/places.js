// initial state

import placesYml from './../../places.yml'

const state = {
  activePlace: "garage",
  places: null,
  player: [],
}

// getters
const getters = {
  // getLastNews: (state, getters) => {
  //   if(state.allNews[state.lastReadNewsDate]){
  //     return state.allNews[state.lastReadNewsDate];
  //   }
  //   else
  //     return false;
  // },
}

// actions
const actions = {
  init: function({commit}){
    console.log('init places')
    commit('initPlaces');
  },
  goTo: function({commit}, place){
    console.log('goTo')
    commit('setActivePlace', place);
    this.$app.story.show(place);
  }
}

// mutations
const mutations = {
  setActivePlace: function(state, place){
    state.activePlace = place;
  },
  resetPlayer: function(state){
    state.player = [];
  },
  initPlaces: function(state){
    console.log(placesYml)
    state.places = placesYml;
  },
  addObject: function(state, payload){
    console.log(payload)
    if(payload.place != "hands"){
      state.places[payload.place].inventory.push(payload.object);
    }else {
      state.player.push(payload.object);
    }
  },
  removeObject: function(state, payload){

    var inventory = null;
    
    if(payload.place == "hands"){
      inventory = state.player;
    }else {
      inventory = state.places[payload.place].inventory;
    }

    for (var i = 0; i < inventory.length; i++) {
      if(inventory[i].name == payload.object.name)
        inventory.splice(i,1);
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}