/* eslint no-unused-vars: "off", curly: "error" */

import Vue from 'vue'
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
	data () {
	  return {
	    publicPath: process.env.BASE_URL,
	  }
	},
	computed: {
	},
	methods:{
		story: function(){
			var story = document.getElementById("twee");
			if(story && story.contentWindow.story){
				return story.contentWindow.story;
			}
			else {
				return false;
			}
			// return false;
		},
		passage: function(){
			var story = document.getElementById("twee");
			if(story && story.contentWindow.passage){
				return story.contentWindow.passage;
			}
			else {
				return false;
			}
			// return false;
		},
		flashError: function(erorType, target){
			console.log("target = " + target)
			console.log("erorType = " + erorType)

			if(erorType == "weight"){
				var parentTarget = document.querySelector('#inventory-' + target + " .informations");

				parentTarget.classList.add("error");

				setTimeout(()=>{
					parentTarget.classList.remove("error");
				}, 500);
			}

			if(erorType == "space"){
				var parentTarget = document.querySelector('#inventory-' + target + " #" + target);
				parentTarget.classList.add("error");

				setTimeout(()=>{
					parentTarget.classList.remove("error");
				}, 500);
			}
		},
		updatePassage:function(passage){
			// console.log(passage.name)
			// console.log(passage.name.includes('Intro'))
			// console.log(passage.name.includes('Start'))

			if(passage && !passage.name.includes('Intro') && passage.name != "Start"){
				// console.log("toggleDisplayPlace")

				if(this.$store.state.places.activePlace != passage.name){
					this.$store.commit("places/setActivePlace", passage.name);
				}

				if(!this.$store.state.places.displayPlace){
    				this.$store.commit('places/toggleDisplayPlace', true);
				}
			}

        	this.$store.dispatch("saveGame");

        	if(!this.story().$vue){
        		this.story().$vue = this;
        	}
		},
		storyFunctions: function(name, payload){
			if(name == "toggle-place"){
				console.log('Lock room')
    			this.$store.commit('places/togglePlace', payload);
			}
		},
	},
	mounted: function () {
	}
})

const app = new Vue({
	store,
	render: h => h(App),
}).$mount('#app')

// store configaration
store.$app = app;
window.$app = app;


