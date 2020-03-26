// initial state

import placesYml from './../../places.yml'
import objectsYml from './../../objects.yml'


const state = {
  activePlace: null,
  places: null,
  player: [],
  playerMaximunWeight: 40,
  playerWidth: 80,
  playerHeight: 80,
  displayPlace: false,
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
  handsObject: function(state){
    var hands = {
      name: 'hands',
      width: state.playerWidth,
      height: state.playerHeight,
    }

    return hands;
  }

}

// actions
const actions = {
  init: function({dispatch, commit, state, rootState}){

    commit('toggleDisplayPlace', false);

    if(!rootState.gameStarted){
      commit('initPlaces');
      commit('addAllObjectSpaces');

    }

    commit('toggleDisplayPlace', true);

    if(!state.activePlace && !rootState.gameStarted){
      //first place of the game
      dispatch("goTo", "garage");
    }

  },
  goTo: function({commit}, place){
    console.log("GoTo = " + place);
    commit('setActivePlace', place);

    if(this.$app){
      if(this.$app.story.passages[place]){
        this.$app.story.show(place);
      }
    }
  },
  createNewPlace: function({commit, dispatch}, payload){
    console.log("create New place!!!");
    commit('createNewPlace', payload);
    // dispatch("goTo", payload.name);
  },
}

// mutations
const mutations = {
  setConnectionsToPlaceObject: function(state, payload){
    // console.log("payload.placeObj.place = " + payload.placeObj.place);
    // console.log("state.activePlace = " + state.activePlace);
    if(payload.placeObj.place != state.activePlace){
      place = state.places[payload.name];
      place.connections = [payload.placeObj];

      this.$app.$set(state.places, payload.name, place);
    }
    // state.places[payload.name].connections = []

  },
  checkPlaceWeight: function(state, placeName){
    console.log("checkPlaceWeight = " + placeName);
    if(!state.places[placeName].actualWeight){
      state.places[placeName].actualWeight = this.$app.getPlaceWeight(placeName);
    }
  },
  createNewPlace: function(state, payload){
    this.$app.$set(state.places, payload.name, payload.place);
  },
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
  initPlaces: function(state, rootState){
    state.places = placesYml;

    // var weight = 0;


    // for (var property in state.places) {
    //   // console.log("property = ", property);
    //   // console.log("this.$app. = ", this.$app);
    //   // console.log("this.$app.getPlaceWeight(property) = " + this.$app.getPlaceWeight(property));
    //   weight += this.$app.getPlaceWeight(property);
    //   console.log('weight ==== ' + weight)
    //   state.places[property].actualWeight = weight;
    //   // console.log("state.places[property] = ", state.places[property]);

    //   // this.$app.$set(state.places[property], actualWeight, weight);
    // }
  },
  addAllObjectSpaces: function(state, rootState){
    console.log(" 1  objectsYml = ", objectsYml);

    for (var iObjectName in objectsYml) {

      console.log("objectsYml = ", objectsYml);
      console.log("iObjectName = ", iObjectName);
      console.log("objectsYml[iObjectName] = ", objectsYml[iObjectName]);

      if(objectsYml[iObjectName].place){
        console.log("having place...");

        this.$app.$set(state.places, iObjectName, {
                        name: objectsYml[iObjectName].place.name,
                        width: objectsYml[iObjectName].place.width,
                        height: objectsYml[iObjectName].place.height,
                        scrollable: objectsYml[iObjectName].place.scrollable,
                        infinite: objectsYml[iObjectName].place.infinite,
                        maximumWeight: objectsYml[iObjectName].place.maximumWeight,
                        inventory: objectsYml[iObjectName].place.inventory,
                      });

        console.log("Place = " + iObjectName + " added.");
      }

    }
  },
  addObject: function(state, payload){
    // console.log(payload)
    if(payload.place != "hands"){
      state.places[payload.place].inventory.push(payload.object);

      var weight = state.places[payload.place].actualWeight + payload.object.weight;
      this.$app.$set(state.places[payload.place], actualWeight, weight);
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
    // console.log("inventory = ", inventory);
    // console.log("inventory = ", payload.object);
    for (var i = 0; i < inventory.length; i++) {
      if(inventory[i].name == payload.object.name){

        // if(payload.place != "hands"){
        //   var weight = state.places[payload.place].actualWeight - payload.object.weight;
        //   this.$app.$set(state.places[payload.place], actualWeight, weight);
        // }

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