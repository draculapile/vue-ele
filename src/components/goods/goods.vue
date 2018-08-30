<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul>
          <li v-for="(item,index) in goods"
              :key="item.id"
              class="menu-item"
              :class="{'current':currentIndex===index}"
              @click="scrollToTop">
            <p class="text">
              <span class="icon" :class="classMap[item.type]" v-show="item.type >= 0"></span>{{item.name}}
            </p>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper">
        <ul>
          <li v-for="item in goods" :key="item.id" class="food-list" ref="foodList">
            <div class="title-desc">
              <h1 class="title">{{item.name}}</h1>
              <span v-show="item.description" class="desc">{{item.description}}</span>
            </div>
            <ul>
              <li @click="selectFood(food,$event)" v-for="food in item.foods" :key="food.id" class="food-item">
                <div class="icon">
                  <img v-lazy="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="info" v-html="food.info"></p>
                  <div class="extra">
                    <span v-show="food.sellCount">月售{{food.sellCount}}</span>
                    <span class="rating" v-show="food.sellCount">好评率{{food.rating}}%</span>
                  </div>
                  <div class="price-cartcontrol">
                    <span>￥</span>
                    <span class="number">{{food.price}}</span>
                    <div class="cartcontrol-wrapper">
                      <cartcontrol @add="addFood" :food="food"></cartcontrol>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Cartcontrol from 'components/cartcontrol/cartcontrol'

  const ERR_OK = 0
  const debug = process.env.NODE_ENV !== 'production'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        listHeight: [],
        foodList: [],
        currentIndex: 0,
        selectedFood: {},
        goods: []
      }
    },
    computed: {
      selectFoods () {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created () {
      const goodsUrl = debug ? '/api/goods' : 'http://degula.site/vue-ele/api/goods'
      this.$http.get(goodsUrl).then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.goods = response.data
          this.$nextTick(() => {
          this._calculateHeight()
          this.$emit('getArgs', [this.listHeight, this.foodList])
          })
        }
      })
      this.classMap = ['hot', 'promotion']
      // this.$nextTick(() => {
      //   this._calculateHeight()
      //   this.$emit('getArgs', [this.listHeight, this.foodList])
      // })
    },
    methods: {
      _calculateHeight () {
        let foodList = this.$refs.foodList
        this.foodList = foodList
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      addFood (target) {
        this.$emit('drop', target)
      },
      // 点击展开食物详情页food层
      selectFood (food, event) {
        if (!event._constructed) {
          return
        }
        this.$emit('getSelectedFood', food)
      },
      scrollToTop () {
        this.$emit('scrollToTop')
      }
    },
    watch: {
      selectFoods (newVal) {
        this.$emit('getSelectFoods', newVal)
      }
    },
    components: {
      Cartcontrol
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .goods
    display: flex
    width: 100%
    overflow: hidden
    background: white
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: rgb(248, 248, 248)
      .menu-item
        width: 80px
        height: auto
        padding: 18px 6px 18px 16px
        box-sizing: border-box
        min-height: 48px
        max-height: 78px
        &.current
          background: white
          .icon
            &.hot
              bg-image('hot')
            &.promotion
              bg-image('promotion')
          .text
            font-weight: 700
        .icon
          display: inline-block
          vertical-align: top
          width: 14px
          height: 14px
          margin-right: 6px
          background-size: 14px 14px
          background-repeat: no-repeat
          &.hot
            bg-image('hot-gray')
          &.promotion
            bg-image('promotion-gray')
        .text
          width: 56px
          height: auto
          min-height: 14px
          max-height: 42px
          line-height: 14px
          font-size: 14px
          color: rgb(106, 106, 106)
          overflow: hidden
          word-break: break-word
          display: -webkit-box
          -webkit-line-clamp: 3
          -webkit-box-orient: vertical
          text-overflow: ellipsis
    .foods-wrapper
      flex: 1
      width: 0
      .title-desc
        padding-left: 12px
        height: 38px
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        .title
          font-size: 16px
          line-height: 38px
          display: inline-block
        .desc
          font-size: 12px
          color: rgb(153, 153, 153)
          display: inline-block
      .food-item
        display: flex
        padding-left: 12px
        margin-bottom: 20px
        &:last-child
          margin-bottom: 0
        .icon
          flex: 0 0 95px
          margin-right: 10px
          font-size: 0
          @media only screen and (max-width: 320px)
            flex: 0 0 70px
          img
            width: 95px
            height: 95px
            @media only screen and (max-width: 320px)
              width: 70px
              height: 70px
        .content
          flex: 1
          width: 0
          padding-right: 16px
          .name
            font-size: 16px
            font-weight: bold
          .info, .extra
            font-size: 12px
            color: rgb(153, 153, 153)
          .info
            margin: 12px 0
            @media only screen and (max-width: 320px)
              margin: 8px 0
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            max-height: 12px
          .extra
            width: 100%
            height: 12px
            .rating
              margin-left: 6px
          .price-cartcontrol
            position: relative
            margin-top: 8px
            font-size: 14px
            color: rgb(255, 83, 57)
            .number
              font-size: 18px
              font-weight: bold
              margin-left: -5px
            .cartcontrol-wrapper
              position: absolute
              right: 0
              bottom: -9px
</style>