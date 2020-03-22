// initial state
const state = {
  places: {
    "vestibule": [
      { name: "carte", weight: 0.2 },
    ],
    "salle-de-bain": [
      { name: "savon", weight: 0.5 },
    ],
    "hands": [
    ]
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
}

// actions
const actions = {
  // init: function({commit, state, dispatch}){
  //   // get last news date
  //   dispatch("getLastNewsDate").then(
  //     (date) => {
  //       if(state.lastReadNewsDate == null || state.lastReadNewsDate < date){

  //         dispatch("getLastNews").then(
  //           () => {
  //             commit("setLastNews");
  //             commit("displayLastNews");
  //           });
  //       }
  //     }
  //   );
  //   //check with lastReadNewsDate
  //   // if not read load it and display it
  //   // else do nothing
  // },
}

// mutations
const mutations = {
	addObject: function(state, payload){
		state.places[payload.place].push(payload.object);
	},
	removeObject: function(state, payload){
    var inventory = state.places[payload.place];
    console.log(inventory);
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
