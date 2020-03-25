// initial state

import placesYml from './../../places.yml'

const state = {
  activePlace: null,
  places: null,
  player: [],
  displayPlace: false
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
  init: function({dispatch, commit, state}){
    commit('toggleDisplayPlace', false);

    commit('initPlaces');

    commit('toggleDisplayPlace', true);

    if(!state.activePlace){
      console.log("garage = ");
      dispatch("goTo", "garage");
    }

  },
  goTo: function({commit}, place){
    commit('setActivePlace', place);
    if(this.$app){
      this.$app.story.show(place);
    }
  }
}

// mutations
const mutations = {
  toggleDisplayPlace: function(state, payload = "toggle"){
    if(state == "toggle")
      state.displayPlace = !state.displayPlace;
    else{
      state.displayPlace = payload;
    }
  },
  setActivePlace: function(state, place){
    // var filter = false;

    if(state.places[place])
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
    console.log("inventory = ", inventory);
    console.log("inventory = ", payload.object);
    for (var i = 0; i < inventory.length; i++) {
      if(inventory[i].name == payload.object.name){
        inventory.splice(i,1);
        break;
      }
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