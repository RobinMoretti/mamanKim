/* eslint no-unused-vars: "off", curly: "error" */

import Vue from 'vue'
import router from './router';
import App from './App.vue'
import store from './store'

import PObject from './components/Object.vue'
Vue.component('PObject', PObject);

import Inventory from './components/Inventory.vue'
Vue.component('inventory', Inventory);

Vue.config.productionTip = false

window.passage = null;

import styles from 'normalize.css'

import objectsYml from './objects.yml'

Vue.mixin({
	// data: function () {
	// 	return {
	// 	}
	// },
	computed: {
		story: function(){
			var story = document.getElementById("twee");

			if(story && story.contentWindow.story){
				return story.contentWindow.story;
			}

			return false;
		},
	},
	methods:{
		updatePassage:function(passage){
			if(passage && passage.name != "Introduction"){
				this.$store.commit("places/setActivePlace", passage.name);
			}
			// this.$router.push(passage.name);
		},
		getPlaceWeight: function(placeName){
			var storeStates = this.$store.state.places;
		    var place = storeStates.places[placeName];
		    var objects = objectsYml;
			var weight = 0;

			    // console.log("inventory = ", inventory);
			    // console.log("objects = ", objects);
			    // console.log("placeName = ", placeName);
		    if(place && place.inventory){
		    	var inventory = place.inventory;

				var index = 0;
				for (var i = 0; i < inventory.length; i++) {

					// console.log("inventory.length[i] = ", objects[inventory[i].name]);

					var detailObject = objects[inventory[i].name];
					// si l'object est une place et quil nexiste pas déja, lajouter au places disponible
					// if(detailObject.place && !storeStates.places[inventory[i].name]){
					// 	console.log("detailObject.place = " + detailObject.name);
					// 	console.log("detailObject.place = " + detailObject.place);
					// 	console.log("storeStates.places[inventory[i].name] = " + storeStates.places[inventory[i].name]);
			  //           this.$store.dispatch("places/createNewPlace",
			  //             {
			  //               place: {
			  //                 name: detailObject.place.name,
			  //                 width: detailObject.place.width,
			  //                 height: detailObject.place.height,
			  //                 scrollable: detailObject.place.scrollable,
			  //                 infinite: detailObject.place.infinite,
			  //                 maximumWeight: detailObject.place.maximumWeight,
			  //                 inventory: detailObject.place.inventory,
			  //               },
			  //               name: inventory[i].name,
			  //             }
			  //           );

	    //   				// this.$store.commit('places/checkPlaceWeight', inventory[i].name);
					// }

					weight += detailObject.weight;
				}
		    }

			return weight;


		//       // for (var x = 0; x < state.places[property].inventory.length; x++) {
		//       //   var objectName = state.places[property].inventory[x].name;
		//       //   if(objectsYml[objectName]){

		//       //     var detailObject = objectsYml[objectName];

		//       //     weight += detailObject.weight;

		//       //     if(detailObject.place){
		//       //       for (var i = 0; i < detailObject.place.length; i++) {
		//       //         Things[i]
		//       //       }
		//       //     }

		//       //   }
		//       // }

		},
	}
})

const app = new Vue({
	router: router,
	store,
	render: h => h(App),
}).$mount('#app')

// store configaration
store.$app = app;
router.$app = app;
window.$app = app;
