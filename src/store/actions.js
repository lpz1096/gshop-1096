/**
 * 包含多个通过 mutations 间接更新 state 数据的方法的对象
 */

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
import {
  reqAddress,
  reqFootTypes, reqShopGoods, reqShopInfo,
  reqShopList, reqShopRatings, reqUserInfo,
  reqSearchShops
} from '../api'
export default {
  //异步请求地址信息
  async getAddress({commit,state}){
    const {longitude,latitude} = state
    const geohash = latitude + ',' + longitude
    const result = await reqAddress(geohash);
    if(result.code === 0){
      const address = result.data
      commit(RECEIVE_ADDRESS,{address})
    }
  },
  //异步请求食品类型
  async getFoottypes({commit}){
    const result = await reqFootTypes();
    if(result.code === 0){
      const footTypes = result.data
      commit(RECEIVE_FOOTTYPES,{footTypes})
    }
  },
  //异步请求商家列表
  async getShoplist({commit,state}){
    const {longitude,latitude} = state
    const result = await reqShopList(latitude,longitude);
    if(result.code === 0){
      const shopList = result.data
      commit(RECEIVE_SHOPLIST,{shopList})
    }
  },
  //同步保存用户信息
  saveUserInfo({commit},userInfo) {
    commit(RECEIVE_USERINFO, {userInfo})
  },
  //异步保存用户信息
  async getSeesionUserInfo({commit}) {
    const result = await reqUserInfo()
    if(result.code === 0) {
      const userInfo = result.data
      commit(RECEIVE_USERINFO, {userInfo})
    }
  },
  //异步退出登录
  async logOut({commit}) {
    const result = await reqLogout()
    if(result.code === 0) {
      commit(RESET_USERINFO)
    }
  },
  //商家食物
  async getShopGoods({commit},callBack) {
    const result = await reqShopGoods()
    if(result.code === 0) {
      const shopGoods = result.data
      commit(RECEIVE_SHOPGOODS,{shopGoods})
      //更新数据之后调用回调函数
      callBack && callBack() //&&如果callBack为null则不执行
    }
  },
  //商家评论
  async getShopRatings({commit},callBack) {
    const result = await reqShopRatings()
    if(result.code === 0) {
      const shopRatings = result.data
      commit(RECEIVE_SHOPRATINGS,{shopRatings})
      callBack && callBack()
    }
  },
  //商家信息
  async getShopInfo({commit}) {
    const result = await reqShopInfo()
    if(result.code === 0) {
      const shopInfo = result.data
      commit(RECEIVE_SHOPINFO,{shopInfo})
    }
  },
  //添加到购物车的加减控件
  updateFoodCount({commit},{food,isAdd}){
    if(isAdd) {
      commit(ADDRECEIVE_FOODCOUNT,{food})
    }else{
      commit(DELRECEIVE_FOODCOUNT,{food})
    }
  },
  //异步搜索得到商家集
 async getSearchShops({commit,state},keyword){
   const {longitude,latitude} = state
   const geohash = latitude + ',' + longitude
   const result = await reqSearchShops(geohash,keyword)
   if(result.code === 0) {
     const searchshops = result.data
     commit(RECEIVE_SEARCHSHOPS,{searchshops})
   }
 }
}
