<template>
  <div>
    <transition name="cshow">
      <div class="shopcart" ref="shopcart" :style="transformStyle" v-show="shopcartShow">
        <div class="content" @click="toggleList">
          <div class="content-left">
            <div class="logo-wrapper">
              <div class="logo" :class="{'highlight': totalCount > 0}">
                <i class="icon-cart" :class="{'highlight': totalCount > 0}"></i>
              </div>
              <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
            </div>
            <div class="price-desc">
              <div class="price" :class="{'highlight': totalCount > 0}">{{totalPrice}}</div>
              <div class="desc">另需配送费{{seller.deliveryPrice}}元</div>
            </div>
          </div>
          <div class="content-right">
            <div class="pay" :class="payClass">{{payDesc}}</div>
          </div>
        </div>
        <div class="ball-container">
          <div v-for="ball in balls" :key="ball.id">
            <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
              <div class="ball" v-show="ball.show">
                <div class="inner inner-hook"></div>
              </div>
            </transition>
          </div>
        </div>
        <transition name="fold">
          <div class="shopcart-list" v-show="!fold">
            <div class="list-header">
              <h1 class="title">已选商品</h1>
              <span class="empty" @click="showConfirm">清空</span>
            </div>
            <scroll class="list-content" ref="listContent">
              <ul>
                <li class="food" v-for="food in selectFoods" :key="food.id">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span>￥{{food.price*food.count}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" @add="add"></cartcontrol>
                  </div>
                </li>
              </ul>
            </scroll>
          </div>
        </transition>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Cartcontrol from 'components/cartcontrol/cartcontrol'

  export default {
    props: {
      selectFoods: {
        type: Array,
        default: function () {
          return []
        }
      },
      seller: {
        type: Object
      },
      scrollY: {
        type: Number
      },
      pScrollY: {
        type: Number
      },
      transformFlag: {
        type: Boolean,
        default: false
      },
      contentFlag: {
        type: Boolean
      }
    },
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      }
    },
    created () {
      this.click = true
    },
    computed: {
      totalPrice () {
        if (this.selectFoods.length === 0) {
          return '未选购商品'
        } else {
          let total = 0
          this.selectFoods.forEach((food) => {
            total += food.price * food.count
          })
          return `￥${total}`
        }
      },
      totalCount () {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc () {
        if (this.totalPrice === '未选购商品') {
          return `￥${this.seller.minPrice}起送`
        } else if (parseInt(this.totalPrice.slice(1)) < this.seller.minPrice) {
          let diff = this.seller.minPrice - parseInt(this.totalPrice.slice(1))
          return `还差￥${diff}起送`
        } else {
          return '去结算'
        }
      },
      payClass () {
        if (parseInt(this.totalPrice.slice(1)) >= this.seller.minPrice) {
          return 'enough'
        } else {
          return 'not-enough'
        }
      },
      listShow () {
        if (!this.totalCount) {
          return false
        }
        if (this.totalCount > 0 && !this.fold) {
          return true
        }
        if (!this.fold) {
          this.$nextTick(() => {
            this.$refs.listContent.refresh()
          })
        }
        return false
      },
      transformStyle () {
        if (this.transformFlag) {
          return `transform: translate3d(0, 58px, 0)`
        } else {
          return 'transform: translate3d(0, 0, 0)'
        }
      },
      shopcartShow () {
        return this.contentFlag
      }
    },
    methods: {
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeDrop (el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            if (this.transformFlag) {
              y -= 58
            }
            if (this.pScrollY < 0 && this.transformFlag) {
              y += 58
            }
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
            el.style.transform = `translate3d(0, ${y}px, 0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
            inner.style.transform = `translate3d(${x}px, 0, 0)`
          }
        }
      },
      dropping (el, done) {
        /* eslint-disable no-unused-vars */
        // 触发浏览器重绘
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)'
          el.style.transform = 'translate3d(0, 0, 0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0, 0, 0)'
          inner.style.transform = 'translate3d(0, 0, 0)'
          el.addEventListener('transitionend', done)
        })
      },
      afterDrop (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      toggleList () {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      hideList () {
        this.fold = true
      },
      add (target) {
        this.drop(target)
      },
      empty () {
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      },
      showConfirm () {
        this.$emit('showConfirm')
      }
    },
    watch: {
      selectFoods (newFood) {
        if (newFood.length === 0) {
          this.fold = true
        }
      },
      pScrollY (newVal) {
        let translateY = 58 - (58 / 44) * -newVal
        if (newVal < 0 && newVal > -44) {
          this.$refs.shopcart.style['transform'] = `translate3d(0, ${translateY}px, 0)`
        } else if (newVal < -44) {
          this.$refs.shopcart.style['transform'] = `translate3d(0, 0, 0)`
        }
        if (newVal >= 0 && newVal < 50) {
          this.$refs.shopcart.style['transform'] = `translate3d(0, 58px, 0)`
        }
        if (newVal >= 50) {
          this.$refs.shopcart.style['transform'] = `translate3d(0, 0, 0)`
        }
      },
      scrollY (newVal) {
        if (newVal > 0 && newVal < 58) {
          let translateY = Math.min(newVal, 58)
          this.$refs.shopcart.style['transform'] = `translate3d(0, ${translateY}px, 0)`
        } else if (newVal > 58) {
          this.$refs.shopcart.style.display = 'none'
        } else {
          this.$refs.shopcart.style.display = ''
          this.$refs.shopcart.style['transform'] = `translate3d(0, 0, 0)`
        }
        if (isNaN(newVal)) {
          this.$refs.shopcart.style.display = 'none'
        }
      }
    },
    components: {
      Cartcontrol,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    opacity: 0.99
    transform: translate3d(0, 0, 0)
    &.cshow-enter-active, &.cshow-leave-active
      transition: all 0.2s
    &.cshow-enter, &.cshow-leave-active
      transform: translate3d(0, 100%, 0)
    .content
      display: flex
      font-size: 0
      .content-left
        flex: 1
        background: rgb(86, 86, 86)
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: rgb(86, 86, 86)
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: rgb(136, 136, 136)
            text-align: center
            &.highlight
              background: rgb(33, 146, 247)
            .icon-cart
              line-height: 44px
              font-size: 28px
              color: rgb(178, 178, 178)
              &.highlight
                color: white
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: white
            background: rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price-desc
          display: inline-block
          color: rgb(150, 149, 148)
          margin: 9px 0
          .price
            font-size: 16px
            margin-bottom: 2px
            &.highlight
              color: white
          .desc
            font-size: 12px
      .content-right
        flex: 0 0 110px
        width: 110px
        .pay
          height: 48px
          line-height: 48px
          font-size: 16px
          color: rgb(178, 178, 178)
          text-align: center
          &.not-enough
            background: rgb(105, 105, 105)
          &.enough
            background: rgb(0, 215, 98)
            color: white
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(33, 146, 247)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      top: 0
      left: 0
      width: 100%
      z-index: -1
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-to
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 16px
        background: rgb(236, 236, 238)
        color: rgb(102, 102, 102)
        .title
          float: left
          font-size: 14px
        .empty
          float: right
          font-size: 12px
      .list-content
        padding: 0 16px
        max-height: 350px
        overflow: hidden
        background: white
        .food
          position: relative
          padding: 16px 0
          box-sizing: border-box
          border-1px(rgb(238, 238, 238))
          .name
            line-height: 20px
            font-size: 14px
          .price
            position: absolute
            right: 90px
            bottom: 16px
            line-height: 20px
            font-size: 14px
            color: rgb(255, 83, 57)
          .cartcontrol-wrapper
            position: absolute
            right: -6px
            bottom: 8px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    opacity: 0.7
    background: rgba(128, 128, 128, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.4s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(128, 128, 128, 0)
</style>