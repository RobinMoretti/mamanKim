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

window.lang = new URL(location.href).searchParams.get('lang');
if(!window.lang){
	window.lang = 'fr';
}

import VueI18n from 'vue-i18n'
import messages from './translation';

Vue.use(VueI18n)

const i18n = new VueI18n({
  	locale: window.lang, // set locale
  	messages, // set locale messages
	fallbackLocale: 'fr',
})

import EventBus from './event-bus';

Vue.mixin({
	data () {
	  return {
	    publicPath: process.env.BASE_URL,
	    lang: 'fr',
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
			// console.log("target = " + target)
			// console.log("erorType = " + erorType)

			if(erorType == "weight"){
				var parentTarget = document.querySelector('#inventory-' + target + " .informations");

				parentTarget.classList.add("error");

				setTimeout(()=>{
					parentTarget.classList.remove("error");
				}, 500);
			} else if(erorType == "space"){
       			EventBus.$emit('FLASH_IVENTORY', target);
			} else if(erorType == "targetIsChild"){
				var parentTarget = document.querySelector('#' + target.space + '-' + target.objectName);
				var parentTarget1 = document.querySelector('#inventory-' + target.target + " .place-inventory" );
				parentTarget.classList.add("error");
				parentTarget1.classList.add("error");

				setTimeout(()=>{
					parentTarget.classList.remove("error");
					parentTarget1.classList.remove("error");
				}, 500);

			}
		},
		updatePassage:function(passage){
			if(passage && !passage.name.includes('Intro') && passage.name == "endGame"){
				this.$store.dispatch("endGame");
			}
			else if(passage && !passage.name.includes('Intro') && passage.name != "Start"){
				// console.log("toggleDisplayPlace")

				if(this.$store.state.places.activePlace != passage.name){
					this.$store.commit("places/setActivePlace", passage.name);
				}

				if(!this.$store.state.places.displayPlace){
    				this.$store.commit('places/toggleDisplayPlace', true);
				}
			}

        	this.$store.dispatch("saveGame");
			
        	this.$store.dispatch("resetTimer");

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
	i18n,
    render: h => h(App)
}).$mount('#app')


// store configaration
store.$app = app;
window.$app = app;


