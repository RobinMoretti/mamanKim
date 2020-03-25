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
