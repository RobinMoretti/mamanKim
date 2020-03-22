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

const app = new Vue({
	router: router,
	store,
	render: h => h(App),
}).$mount('#app')

// store configaration
store.$app = app;
router.$app = app;
