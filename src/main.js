/**
 * 入口js
 */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {Button} from 'mint-ui'
import './mock/mockServer'//使用Mock请求模拟数据

Vue.component(Button.name,Button)//使用<mt-button/>
new Vue({
  el:"#app",
  render:h => h(App),
  router,  //使用vue-router
  store    //使用vuex
})
