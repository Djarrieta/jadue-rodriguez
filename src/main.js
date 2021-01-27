
import Vue from 'vue'
import App from '@/App.vue'
import '@/registerServiceWorker'
import router from '@/router'
import store from '@/store'
import vuetify from './plugins/vuetify';

Vue.use(require('vue-moment'));

import VueTextAreaAutosize from 'vue-textarea-autosize'
Vue.use(VueTextAreaAutosize)

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

Vue.config.productionTip = false

// var firebaseConfig = {
//   apiKey: "AIzaSyDwSzrgmOTBBu23b_TM6g4sMENAz5bOk9Y",
//   authDomain: "adreco-11ef9.firebaseapp.com",
//   databaseURL: "https://adreco-11ef9.firebaseio.com",
//   projectId: "adreco-11ef9",
//   storageBucket: "adreco-11ef9.appspot.com",
//   messagingSenderId: "854957939355",
//   appId: "1:854957939355:web:0d572fb2b1e278e57b843e"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAT3rGJ6wAil-o9UMr-bJs6E8F6f--k6NA",
  authDomain: "jaduerodriguez-d624d.firebaseapp.com",
  projectId: "jaduerodriguez-d624d",
  storageBucket: "jaduerodriguez-d624d.appspot.com",
  messagingSenderId: "56911758200",
  appId: "1:56911758200:web:3add6d4770f9a0a0107e8d"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var storage = firebase.storage();

firebase.auth().onAuthStateChanged((u)=>{
  if(u){
    db.collection("users").doc(u.uid.toString()).get()
    .then(u=>{
      store.state.currentUser={...u.data(),uid:u.id}
      mountApp()
    })
  }else{
    store.state.currentUser=null
    mountApp()
  }
})
function mountApp(){
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
}
export { db,storage};