import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from "axios"
import VueAxios from "vue-axios"
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyDwCwqeShHe4OSqLC17vkF1haz3Up3O2k4",
  authDomain: "rezerwacje-24580.firebaseapp.com",
  databaseURL: "https://rezerwacje-24580-default-rtdb.firebaseio.com",
  projectId: "rezerwacje-24580",
  storageBucket: "rezerwacje-24580.appspot.com",
  messagingSenderId: "874565189812",
  appId: "1:874565189812:web:8beda69776bb962e0417e1",
  measurementId: "G-G8ZE0SNV4K"
});

export const db = firebase.firestore();

Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
