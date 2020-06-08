// initial state

// import placesYml from './../../places.yml'
// import objectsYml from './../../objects.yml'

var lang = new URL(location.href).searchParams.get('lang');

import placesYmlFr from './../../places.yml'
import objectsYmlFr from './../../objects.yml'

import placesYmlEn from './../../places-en.yml'
import objectsYmlEn from './../../objects-en.yml'

var placesYml;
var objectsYml;

console.log('window.lang', window.lang)

if(lang == "en"){
  placesYml = placesYmlEn;
  objectsYml = objectsYmlEn;
}else{
  placesYml = placesYmlFr;
  objectsYml = objectsYmlFr;
}


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
  gameVars: {
    livraison: false,
  }
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

      if(objectsYml[inventory[i].name].place && objectsYml[inventory[i].name].place.inventory != null){
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
    console.log("targetInventory = ", targetInventory);
    var targetInventory = payload.inventory;
    var place = payload.parentPlaceName;

    for (var i = 0; i < targetInventory.length; i++) {
    //   // console.log("iObject = ", targetInventory[i].name);
    //   // console.log("iObject = ", objectsYml[targetInventory[i].name]);
      if(objectsYml[targetInventory[i].name] != null && objectsYml[targetInventory[i].name].place){

        try {
          commit('setSpaceParent', { placeName: targetInventory[i].name, parentName: place });
          if( objectsYml[targetInventory[i].name].place.inventory != null){
            dispatch('defineInventoryParentPlaces', { inventory: objectsYml[targetInventory[i].name].place.inventory, parentPlaceName: targetInventory[i].name} );
          }
        } catch(e) {
          // statements
          console.log("error in defineInventoryParentPlaces!");
          console.log(targetInventory);
          console.log(place);
          console.log(e);
        }
      }
    }
  },
  updateConnectionsConditions: function({commit, dispatch, state}){
    var placeObj = state.places[state.activePlace];

    for (var i = 0; i < placeObj.connections.length; i++) {
      if (placeObj.connections[i].condition == true || placeObj.connections[i].condition == false) {
        commit('setConnectionsAvaibility', {connection: placeObj.connections[i], value: placeObj.connections[i].condition })
      }
      else{
        commit('setConnectionsAvaibility', {connection: placeObj.connections[i], value: checkConnectionSpecialCondition({ condition: placeObj.connections[i].condition, placeObj: placeObj, activePlace: state.activePlace}) })

        // this.$app.$set(placeObj.connections[i], "available",);
      }
      // console.log("connections[i] = " + connections[i]);
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

      // console.log(passagesFiltered)

      if(passagesFiltered.length){

        this.$app.story().show(place);
      }
    }

    dispatch("checkForInventoryEvent");

    commit("objects/resetActiveObject", null, {root: true});
    dispatch("checkForSpecialEvent");


    this.$app.$nextTick(() => {
      dispatch("updateConnectionsConditions");
    })

    dispatch("saveGame", null, { root: true });
    // console.log('tried to save')
  },
  createNewPlace: function({commit, dispatch}, payload){
    // console.log("create New place!!!");
    commit('createNewPlace', payload);
    // dispatch("goTo", payload.name);
  },
  checkForInventoryEvent: function({commit, dispatch, state}){
    for (var i = 0; i < state.player.length; i++) {

      if(objectsYml[state.player[i].name].events){
        for(const eventObjProperty in objectsYml[state.player[i].name].events){
          var payload = {...objectsYml[state.player[i].name].events[eventObjProperty].params};

          if(payload.path == 'enter'){
            if(state.activePlace == payload.place){
              dispatch(objectsYml[state.player[i].name].events[eventObjProperty].name, payload);
            }
          }else if(payload.path == 'exit'){
            if(state.lastActivePlace == payload.place){
              dispatch(objectsYml[state.player[i].name].events[eventObjProperty].name, payload);
            }
          }

        }
      }
    }
  },
  checkForSpecialEvent: function({commit, dispatch, state}){
    if(this.$app.passage().name == "livraison" && state.gameVars['livraison'] == false){
      commit("addObject", { place: "palier", object: { name: "carton-pomme-1"} });
      commit("addObject", { place: "palier", object: { name: "carton-pomme-2"} });
      commit("toggleGameVar", 'livraison');
      console.log("Pomme livrais");
    }
    // pourquoi autant de pomme
  },

  // inventory events -------------------------

  goPassage: function({commit, dispatch, state}, payload){
    // console.log("passages = " , this.$app.story().passages);
    var passagesFiltered = this.$app.story().passages.filter((passage) => {
      return passage.name == payload.passage;
    })
    console.log("go passage !! = ", passagesFiltered);

    if(passagesFiltered.length){
      this.$app.story().show(payload.passage);
    }
  },
  setTweeVariable: function({commit, dispatch, state}, payload){

    if(!this.$app.story().state[payload.name]){
      this.$app.story().state[payload.name] = 0;
    }

    if(payload.increment){
      console.log(payload.name)
      console.log(payload.value)
      this.$app.story().state[payload.name] += payload.value;
      console.log(this.$app.story().state[payload.name] )
    }
    else if(payload.decrement){
      this.$app.story().state[payload.name] -= payload.value;
    }
    else{
      this.$app.story().state[payload.name] = payload.value;
    }
  },
}

// mutations
const mutations = {
  toggleGameVar: function(state, varName){
    state.gameVars[varName] = !state.gameVars[varName];
  },
  setConnectionsAvaibility: function(state, payload){
    console.log("payload.value = " + payload.value);
    this.$app.$set(payload.connection, "available", payload.value);
  },
  togglePlace: function(state, payload){
    this.$app.$set(state.places[payload.place], "locked",  payload.value);
  },
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
    state.gameVars = {
      livraison: false
    }
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
        state.places[payload.placeName].actualWeight += payload.weight;
      }
  },
  setConnectionsToPlaceObject: function(state, payload){
    // console.log("payload.placeObj.place = " + payload.placeObj.place);
    // console.log("state.activePlace = " + state.activePlace);
    // console.log('payload = ', payload)
    // console.log('payload = ', payload.placeObj.place !== state.activePlace)
    if(payload.placeObj.place !== state.activePlace){
      var place = state.places[payload.name];
      // console.log('place = ', place)
      place.connections = [payload.placeObj];

      this.$app.$set(state.places, payload.name, place);
    }
    // state.places[payload.name].connections = []

  },
  checkPlaceWeight: function(state, placeName){
    // console.log("checkPlaceWeight = " + placeName);
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
    if(state.places[place] && place != state.activePlace){
      if(!state.lastActivePlace){
        state.lastActivePlace = place;
      }
      else if(checkAllParent(state.places[state.activePlace], state.places)){
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
      if(newPlace.inventory == null){
        newPlace.inventory = [];
      }
      this.$app.$set(state.places, place, newPlace);
    }
  },
  addAllObjectSpaces: function(state){
    for (var iObjectName in objectsYml) {
      if(objectsYml[iObjectName].place){

        var newPlace = {
            name: objectsYml[iObjectName].place.name,
            description: objectsYml[iObjectName].description,
            width: objectsYml[iObjectName].place.width,
            height: objectsYml[iObjectName].place.height,
            scrollable: objectsYml[iObjectName].place.scrollable,
            infinite: objectsYml[iObjectName].place.infinite,
            maximumWeight: objectsYml[iObjectName].place.maximumWeight,
            inventory: objectsYml[iObjectName].place.inventory != null ? objectsYml[iObjectName].place.inventory: [],
            actualWeight: 0,
            connections: [],
        }

        this.$app.$set(state.places, iObjectName, newPlace);
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

function checkConnectionSpecialCondition(payload){
  if(payload.condition == "topAvailable"){
    var objectsDiv = document.getElementById(payload.activePlace).getElementsByClassName("object");
    var actualFictifHeight = objectsDiv[objectsDiv.length-1].offsetTop;
    var topLimit = payload.placeObj.topAvailable.top;

    if(actualFictifHeight <= topLimit){
      return true;
    }else {
      return false;
    }
  }
}

function checkAllParent(targetPlace, places){
  // return true if no hand parent or grant parent
  var booleanParent = true;

  if(targetPlace.parentPlace != null && targetPlace.parentPlace != "hands"){
    while (targetPlace.parentPlace != null && booleanParent) {
      if(targetPlace.parentPlace != null && targetPlace.parentPlace == "hands"){
        booleanParent = false;
      }
      else{
        targetPlace = places[targetPlace.parentPlace];
      }
    }
  }

  if(targetPlace.parentPlace != null && targetPlace.parentPlace == "hands"){
    booleanParent = false;
  }

  return booleanParent;
}
