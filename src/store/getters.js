/**
 * 包含多个计算属性的方法的对象
 */
export default {
  totalCount(state){//购物车总数量
    return state.cartFoods.reduce((preTotls,food)=>preTotls+food.count,0)
  },
  totalPrice(state){//购物车总价格
    return state.cartFoods.reduce((preTotls,food)=>preTotls+food.price*food.count,0)
  }
}
