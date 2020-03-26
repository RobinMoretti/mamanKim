// initial state

import objectsYml from './../../objects.yml'

const state = {
  activeObject: "",
  objects: null,
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
  // goTo: function({commit}, place){
  //   console.log('goTo')
  //   commit('setActivePlace', place);
  //   this.$app.story.show(place);
  // }
}

// mutations
const mutations = {
  setActiveObject: function(state, object){
    console.log(object)
    state.activeObject = object.name;
  },
  initObjects: function(state){
    state.objects = objectsYml;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}


