// initial state

import objectsYml from './../../objects.yml'

const state = {
  activeObject: "",
  objects: null,
  bouteilleTaken: 0,
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
    commit('initObjects');
  },
  reset: function({dispatch, state, commit}, placeName){
    commit("resetVariables");
  },
  // goTo: function({commit}, place){
  //   console.log('goTo')
  //   commit('setActivePlace', place);
  //   this.$app.story.show(place);
  // }
}

// mutations
const mutations = {
  incrementBoutteilleTaker: function(state){
    state.bouteilleTaken ++;
  },
  resetVariables: function(state, placeName){
    state.activeObject = "";
    state.objects = null;
    state.bouteilleTaken = 0;
  },
  setActiveObject: function(state, object){
    console.log(object)
    state.activeObject = object.name;
  },
  initObjects: function(state){
    state.objects = objectsYml;
    console.log('objectsYml', objectsYml )
  },
  resetActiveObject: function(state){
    state.activeObject = "";
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}


