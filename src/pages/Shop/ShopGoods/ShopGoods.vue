<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li class="menu-item" v-for="(good,index) in shopGoods"
              :class='{current:currentIndex === index}' @click="clickItem(index)">
            <span class="text bottom-border-1px">
            <img class="icon" v-if="good.icon"
                 :src="good.icon">
            {{good.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul ref="foodUl">
          <li class="food-list-hook" v-for="good in shopGoods">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="food in good.foods"
                  @click="clickShowFood(food)">
                <div class="icon">
                  <img width="57" height="57"
                       :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售 {{food.sellCount}} 份</span>
                    <span>好评率 {{food.rating}}%</span></div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food"/>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <Food ref="food" :food="food"/>
    <ShopCart/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import BScroll from 'better-scroll'
  import CartControl from '../../../components/CartControl/CartControl'
  import Food from '../../../components/Food/Food'
  import ShopCart from '../../../components/ShopCart/ShopCart'
  export default {
    data(){
      return {
        scrollY:0,//滚动的y轴值
        tops:[],  //每一个右边foods <li/>的高度集合
        food: {}, // 需要显示的food
      }
    },
    mounted(){
      this.$store.dispatch("getShopGoods",() => {
        this.$nextTick(() => {
          this._initScroll()
          this._initTops()
        })
      })
    },
    components:{
      CartControl,
      Food,
      ShopCart
    },
    computed:{
      ...mapState(['shopGoods']),
      //依据右边滚动位置选择左边Item
      currentIndex(){
        const {scrollY,tops} = this
        const index = tops.findIndex((top,index) => {
          //当scrollY大等于top && 当scrollY小于下一个top时
          return scrollY >= top && scrollY < tops[index+1]
        })
        return index
      }
    },
    methods:{
      //Better-Scroll滚动 && 计算scrollY
      _initScroll(){
        this.menuBScrool = new BScroll('.menu-wrapper')
        this.foodsBScrool = new BScroll('.foods-wrapper',{
          probeType:2
        })
        this.foodsBScrool.on('scroll',({x,y}) => {
          this.scrollY = Math.abs(y)
        })//滑动事件
        this.foodsBScrool.on('scrollEnd',({x,y}) => {
          this.scrollY = Math.abs(y)
        })//滑动结束事件
      },
      // 计算每个右边 ul下所有的子 li 的高度 集合在tops中
      _initTops(){
        const tops = []
        let top = 0
        //计算top保存在tops
        tops.push(top)
        // 得到 ul 下所有的子 li
        const arrItem = this.$refs.foodUl.getElementsByClassName('food-list-hook');
        Array.prototype.slice.call(arrItem).forEach((item,index) => {
          top += item.clientHeight
          tops.push(top)
        })//伪数组转换
        this.tops = tops
      },
      //点击左边Item滚动右边
      clickItem(index){
        console.log(index)
        const top = this.tops[index]
        this.scrollY = top
        this.foodsBScrool.scrollTo(0,-top,300)
      },
      clickShowFood(food){
        this.food = food
        this.$refs.food.toggleShow()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
