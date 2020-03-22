// import router from '@/router'

// initial state
const state = {
  inventory: [],
  // allNews: {},
  // displayingLastNews: false,
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
	addObject: function(state, object){
		state.inventory.push(object);
	},
	removeObject: function(state, object){
		for (var i = 0; i < state.inventory.length; i++) {
			if(state.inventory[i].name == object.name)
				state.inventory.splice(i,1);
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
