// initial state

import placesYml from './../../places.yml'
import objectsYml from './../../objects.yml'

const state = {
  activePlace: "outside",
  lastActivePlace: false,
  places: {},
  player: [],
  playerMaximunWeight: 40,
  playerActualWeight: 0,
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

      // define parent places to the inventory --------
      for (var place in state.places) {
        if(state.places[place].inventory){
          dispatch('defineInventoryParentPlaces', { inventory: state.places[place].inventory, parentPlaceName: place});
        }
      }

    }

    if(!state.activePlace && !rootState.gameStarted){
      //first place of the game
      // dispatch("goTo", "outside");
    }

  },
  reset: function({dispatch, state, commit}, placeName){
    commit("resetVariables");
  },
  updatePlaceWeight: function({dispatch, state, commit}, placeName){
    if(placeName == "hands"){
      commit("resetPlayerWeight");
      if(state.player){
        dispatch("getInventoryWeight",
            {
              inventory: state.player,
              targetPlaceName: placeName
            }
          );
      }
    }
    else {
      commit("resetPlaceWeight", placeName);
      if(state.places[placeName].inventory){
        dispatch("getInventoryWeight",
          {
            inventory: state.places[placeName].inventory,
            targetPlaceName: placeName
          }
        );
      }
    }
  },
  getInventoryWeight: function({dispatch, state, commit}, payload){

    var inventory = payload.inventory;

    for (var i = 0; i < inventory.length; i++) {
      // console.log("payload = ", payload);
      commit("addWeightToPlace", { placeName: payload.targetPlaceName, weight: objectsYml[inventory[i].name].weight})

      if(objectsYml[inventory[i].name].place && objectsYml[inventory[i].name].place.inventory){
        dispatch("getInventoryWeight",
          {
            inventory: objectsYml[inventory[i].name].place.inventory,
            targetPlaceName: payload.targetPlaceName
          }
        );
      }
    }
  },
  defineInventoryParentPlaces: function({dispatch, commit}, payload){
    var targetInventory = payload.inventory;
    var place = payload.parentPlaceName;

    for (var i = 0; i < targetInventory.length; i++) {
      // console.log("iObject = ", targetInventory[i]);
      if(objectsYml[targetInventory[i].name].place){
        commit('setSpaceParent', { placeName: targetInventory[i].name, parentName: place });
        dispatch('defineInventoryParentPlaces', { inventory: objectsYml[targetInventory[i].name].place.inventory, parentPlaceName: targetInventory[i].name} );
      }
    }
  },
  goTo: function({commit, dispatch}, place){
    console.log("GoTo = " + place);
    
    commit('setActivePlace', place);
    dispatch('updatePlaceWeight', place);

    if(this.$app && this.$app.story().passages){      
      var passagesFiltered = this.$app.story().passages.filter((passage) => {
        return passage.name == place;
      })

      console.log(passagesFiltered)

      if(passagesFiltered.length){

        this.$app.story().show(place);
      }
    }

    dispatch("saveGame", null, { root: true });
    console.log('tried to save')
  },
  createNewPlace: function({commit, dispatch}, payload){
    // console.log("create New place!!!");
    commit('createNewPlace', payload);
    // dispatch("goTo", payload.name);
  },
}

// mutations
const mutations = {
  resetVariables: function(state, placeName){
    state.activePlace = "outside";
    state.lastActivePlace = false;
    state.places = {};
    state.player = [];
    state.playerMaximunWeight = 40;
    state.playerActualWeight = 0;
    state.playerWidth = 80;
    state.playerHeight = 80;
    state.displayPlace = false;
  },
  resetPlaceWeight: function(state, placeName){
    state.places[placeName].actualWeight = 0;
  },
  resetPlayerWeight: function(state){
    state.playerActualWeight = 0;
  },
  addWeightToPlace: function(state, payload){
      if(payload.placeName == "hands"){
        state.playerActualWeight += payload.weight;
      }
      else{
        // console.log("payload.placeName = ", payload.placeName);
        // console.log("state.places[payload.placeName] = ", state.places[payload.placeName]);

        state.places[payload.placeName].actualWeight += payload.weight;

        // this.$app.$set(state.places, payload.placeName, state.places[payload.placeName]);
      }
  },
  setConnectionsToPlaceObject: function(state, payload){
    console.log("payload.placeObj.place = " + payload.placeObj.place);
    console.log("state.activePlace = " + state.activePlace);
    console.log('payload = ', payload)
    console.log('payload = ', payload.placeObj.place !== state.activePlace)
    if(payload.placeObj.place !== state.activePlace){
      var place = state.places[payload.name];
      console.log('place = ', place)
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

    if(state.places[place]){
      console.log('setting last active place ...')
      console.log("checkAllParent(state.places[place], state.places) = " + checkAllParent(state.places[place], state.places));
      if(!state.lastActivePlace){
        state.lastActivePlace = place;
      }
      else if(checkAllParent(state.places[place], state.places)){
        console.log('setted')
        state.lastActivePlace = state.activePlace;
      }

      state.activePlace = place;
    }
  },
  resetPlayer: function(state){
    state.player = [];
  },
  initPlaces: function(state, rootState){
    // state.places = placesYml;

    for (var place in placesYml) {
      var newPlace = placesYml[place];
      newPlace.actualWeight = 0;
      newPlace.haveEnoughSpace = false;
      this.$app.$set(state.places, place, newPlace);
    }
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
  addAllObjectSpaces: function(state){
    for (var iObjectName in objectsYml) {
      if(objectsYml[iObjectName].place){
        this.$app.$set(state.places, iObjectName, {
                        name: objectsYml[iObjectName].place.name,
                        width: objectsYml[iObjectName].place.width,
                        height: objectsYml[iObjectName].place.height,
                        scrollable: objectsYml[iObjectName].place.scrollable,
                        infinite: objectsYml[iObjectName].place.infinite,
                        maximumWeight: objectsYml[iObjectName].place.maximumWeight,
                        inventory: objectsYml[iObjectName].place.inventory,
                        actualWeight: 0,
                        connections: [],
                      });
        // console.log("Place = " + iObjectName + " added.");
      }
    }
  },
  setSpaceParent: function(state, payload){
    // console.log("setSpaceParent = ", payload);
    var PlaceWithParent = state.places[payload.placeName];
    PlaceWithParent.parentPlace = payload.parentName;
    this.$app.$set(state.places, payload.placeName, PlaceWithParent);
  },
  addObject: function(state, payload){
    if(payload.place != "hands"){
      state.places[payload.place].inventory.push(payload.object);
    }else {
      state.player.push(payload.object);
    }

    // if place is object, update parent
    if(state.places[payload.object.name]){
      state.places[payload.object.name].parentPlace = payload.place;
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


// helper ---------

function checkAllParent(targetPlace, places){
  // return true if no hand parent or grant parent
  var booleanParent = true;

  if(targetPlace.parentPlace && targetPlace.parentPlace != "hands"){
    while (targetPlace.parentPlace && booleanParent) {
      if(targetPlace.parentPlace && targetPlace.parentPlace == "hands"){
        booleanParent = false;
      }
      else{
        targetPlace = places[targetPlace.parentPlace];
      }

    }
  }
  if(targetPlace.parentPlace && targetPlace.parentPlace == "hands"){
    booleanParent = false;
  }

  return booleanParent;
}
