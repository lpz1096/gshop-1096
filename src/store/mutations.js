/**
 * 包含多个直接更新 state 数据的方法的对象
 */
import Vue from 'vue'
import {
  RECEIVE_ADDRESS,
  RECEIVE_FOOTTYPES,
  RECEIVE_SHOPLIST,
  RECEIVE_USERINFO,
  RESET_USERINFO,
  RECEIVE_SHOPGOODS,
  RECEIVE_SHOPRATINGS,
  RECEIVE_SHOPINFO,
  ADDRECEIVE_FOODCOUNT,
  DELRECEIVE_FOODCOUNT,
  RECEIVE_SEARCHSHOPS
} from './mutations-type'
export default {
  [RECEIVE_ADDRESS](state,{address}){
    state.address = address
  },
  [RECEIVE_FOOTTYPES](state,{footTypes}){
    state.footTypes = footTypes
  },
  [RECEIVE_SHOPLIST](state,{shopList}){
    state.shopList = shopList
  },
  [RECEIVE_USERINFO](state,{userInfo}){
    state.userInfo = userInfo
  },
  [RESET_USERINFO](state){
    state.userInfo = {}
  },
  [RECEIVE_SHOPGOODS](state,{shopGoods}){
    state.shopGoods = shopGoods
  },
  [RECEIVE_SHOPRATINGS](state,{shopRatings}){
    state.shopRatings = shopRatings
  },
  [RECEIVE_SHOPINFO](state,{shopInfo}){
    state.shopInfo = shopInfo
  },

  [ADDRECEIVE_FOODCOUNT](state,{food}){
    if(food.count){
      food.count ++
    }else{
      Vue.set(food, 'count', 1) // 让新增的属性也有数据绑定
      state.cartFoods.push(food);//添加到购物车
    }
  },
  [DELRECEIVE_FOODCOUNT](state,{food}){
    if(food.count){
      food.count --
      if(food.count === 0){
        state.cartFoods.splice(state.cartFoods.indexOf(food),1)
      }
    }
  },
  [RECEIVE_SEARCHSHOPS](state,{searchshops}){
    state.searchShops = searchshops
  }
}
