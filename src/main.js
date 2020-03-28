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
		updatePassage:function(passage){
			console.log(passage.name)
			if(passage && passage.name != "Introduction" && passage.name != "endIntro"){
				this.$store.commit("places/setActivePlace", passage.name);
				if(!this.$store.state.places.displayPlace){
    				this.$store.commit('places/toggleDisplayPlace', true);
				}
			} 
			else if(passage && passage.name){
				console.log('init')
				if(!this.$store.state.saveId){
					console.log('goTo')
					this.$store.dispatch("places/goTo", "outside")
				}

    			this.$store.commit('places/toggleDisplayPlace', true);
			}

        	this.$store.dispatch("saveGame");
		},
	},
	mounted: function () {
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


