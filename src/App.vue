<template>
  <div id="app">
    <div class="content" ref="content">
      <m-header :seller="seller" :opacity="opacity"></m-header>
      <div class="bg-image" :style="bgImage" ref="bgImage">
        <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <description :seller="seller" :scale="scale" :dscrollY="scrollY" @unfold="unfoldDetail" @fold="foldDetail" ref="des"></description>
      <transition name="fold">
        <scroll class="content-wrapper"
                v-show="contentFlag"
                ref="contentWrapper"
                @scroll="scroll"
                :listen-scroll="listenScroll"
                :probe-type="probeType"
                :style="bottomStyle">
          <div>
            <tab></tab>
            <keep-alive>
              <router-view @getArgs="getArgs"
                          @getSelectFoods="getSelectFoods"
                          @getSelectedFood="getSelectedFood"
                          @drop="drop"
                          @scrollToTop="scrollToTop"
                          :seller="seller"></router-view>
            </keep-alive>
          </div>
        </scroll>
      </transition>
      <tab class="fixed-tab" v-show="fixedTab"></tab>
      <scroll class="fixed-menu-wrapper"
              ref="fixedMenu"
              v-show="fixedContent">
        <ul>
          <li v-for="(item,index) in goods"
              class="menu-item"
              :key="item.id"
              :class="{'current':currentIndex===index}"
              @click.stop="selectMenu(index,$event)"
              ref="menuList">
            <p class="text">
              <span class="icon" :class="classMap[item.type]" v-show="item.type >= 0"></span>{{item.name}}
            </p>
          </li>
        </ul>
      </scroll>
      <div class="fixed-title-desc" v-show="fixedContent" ref="fixedTitleDesc">
        <h1 class="title">{{fixedTitle}}</h1>
        <span class="desc">{{fixedDesc}}</span>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="清空购物车？" confirmBtnText="清空"></confirm>
      <shopcart v-show="shopcartShow" :seller="seller" :selectFoods="selectFoods" :pScrollY="pScrollY" :scrollY="scrollY" :transformFlag="transformFlag" ref="shopcart" @showConfirm="showConfirm" :contentFlag="contentFlag"></shopcart>
      <food :food="selectedFood" :deviceHeight="deviceHeight" ref="food" @drop="drop" @getScrollY="getScrollY" @getFlag="getFlag"></food>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Description from 'components/description/description'
  import Tab from 'base/tab/tab'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import Shopcart from 'components/shopcart/shopcart'
  import Food from 'components/food/food'
  import { urlParse } from 'common/js/util'
  import { prefixStyle } from 'common/js/dom'

  const ERR_OK = 0
  const debug = process.env.NODE_ENV !== 'production'
  const transform = prefixStyle('transform')
  const RESERVED_HEIGHT = 44
  const SCALE_HEIGHT = 85
  const TITLE_HEIGHT = 38

  export default {
    data () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        },
        bgImageUrl: '',
        goods: [],
        scrollY: 0,
        scale: 1,
        opacity: 0,
        listHeight: [],
        foodList: [],
        selectFoods: [],
        currentIndex: 0,
        diff: 0,
        selectedFood: {},
        pScrollY: 0,
        transformFlag: false,
        contentFlag: true,
        deviceHeight: 0
      }
    },
    created () {
      const goodsUrl = debug ? '/api/goods' : 'http://degula.site/vue-ele/api/goods'
      this.$http.get(goodsUrl).then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.goods = response.data
        }
      })
      const sellerUrl = debug ? '/api/seller' : 'http://degula.site/vue-ele/api/seller'
      this.$http.get(sellerUrl + '?id=' + this.seller.id).then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data)
          this.bgImageUrl = this.seller.background
        }
      })
      this.probeType = 3
      this.listenScroll = true
      this.listenScrollEnd = true

      this.classMap = ['hot', 'promotion']
    },
    mounted () {
      this.deviceHeight = this.$refs.content.clientHeight
      this.minTranslateY = -125 + RESERVED_HEIGHT
      this.sTranslateY = 125 - SCALE_HEIGHT
    },
    computed: {
      bgImage () {
        return `background-image:url(${this.bgImageUrl})`
      },
      fixedTab () {
        if (this.scrollY <= -256) {
          return true
        }
        return false
      },
      fixedContent () {
        if (this.scrollY <= -256 && this.$route.path === '/goods') {
          return true
        }
        return false
      },
      fixedTitle () {
        return this.goods[this.currentIndex] ? this.goods[this.currentIndex].name : ''
      },
      fixedDesc () {
        return this.goods[this.currentIndex] ? this.goods[this.currentIndex].description : ''
      },
      shopcartShow () {
        if (this.$route.path === '/goods') {
          return true
        }
        return false
      },
      bottomStyle () {
        if (this.$route.path !== '/goods') {
          return 'bottom: 0'
        }
      }
    },
    methods: {
      scroll (pos) {
        this.scrollY = pos.y
      },
      getArgs (args) {
        this.listHeight = args[0]
        this.foodList = args[1]
      },
      getSelectFoods (args) {
        this.selectFoods = args
      },
      getSelectedFood (args) {
        if (args) {
          this.selectedFood = args
          this.$refs.food.show()
        }
      },
      drop (target) {
        this.$refs.shopcart.drop(target)
      },
      getFlag (args) {
        this.transformFlag = args
      },
      getScrollY (args) {
        this.pScrollY = args
      },
      _followScroll (index) {
        let menuList = this.$refs.menuList
        let el = menuList[index]
        this.$refs.fixedMenu.scrollToElement(el, 300, 0, -100)
      },
      selectMenu (index, event) {
        let foodList = this.foodList
        let el = foodList[index]
        this.$refs.contentWrapper.scrollToElement(el, 300, 0, 218)
      },
      scrollToTop () {
        this.$refs.contentWrapper.scrollTo(0, -256, 200)
      },
      showConfirm () {
        this.$refs.confirm.show()
      },
      confirmClear () {
        this.$refs.shopcart.empty()
        this.$refs.shopcart.hideList()
      },
      unfoldDetail () {
        this.contentFlag = false
      },
      foldDetail () {
        this.contentFlag = true
      }
    },
    watch: {
      scrollY (newVal) {
        if (newVal > 60) {
          this.contentFlag = false
        }
        let blur = 0
        let zIndex = 0
        let translateY = Math.min(Math.max(this.minTranslateY, newVal), 0)
        let percent = (Math.min((newVal + 10), 0)) / this.sTranslateY
        this.scale = Math.max(1 + percent, 0)
        this.opacity = Math.max(1 * -percent, 0)
        blur = Math.min(20, -percent * 20)
        if (newVal < 0) {
          this.$refs.des.$el.style[transform] = `translate3d(0, ${newVal}px, 0)`
        } else {
          this.$refs.des.$el.style[transform] = `translate3d(0, 0, 0)`
        }

        this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`

        this.$refs.filter.style['filter'] = `blur(${blur}px)`

        if (newVal < this.minTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        } else {
          this.$refs.bgImage.style.height = '125px'
        }
        this.$refs.bgImage.style.zIndex = zIndex

        if (newVal <= -256) {
          this.$refs.fixedMenu.refresh()
        }

        const listHeight = this.listHeight
        if (newVal > 0) {
          this.currentIndex = 0
          return
        }
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          let _scrollY_ = Math.abs(Math.round(newVal)) - 256
          if (!height2 || (_scrollY_ >= height1 && _scrollY_ < height2)) {
            this._followScroll(i)
            this.currentIndex = i
            this.diff = height2 - _scrollY_
            return
          }
        }
      },
      diff (newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixedTitleDesc.style[transform] = `translate3d(0, ${fixedTop}px, 0)`
      },
      $route () {
        if (this.scrollY <= -256) {
          this.$refs.contentWrapper.scrollTo(0, -256, 50)
          this.$nextTick(() => {
            this.$refs.contentWrapper.refresh()
          })
        }
      }
    },
    components: {
      Tab,
      Scroll,
      MHeader,
      Description,
      Shopcart,
      Food,
      Confirm
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .content
    width: 100%
    height: 100%
    position: fixed
    .content-wrapper
      position: fixed
      top: 300px
      bottom: 48px
      width: 100%
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 120%, 0)
    .bg-image
      position: relative
      width: 100%
      height: 125px
      background-size: cover
      overflow: hidden
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: inherit
        box-shadow: 0px 1px 80px 2px rgb(165, 162, 161) inset
    .bg-layer
      position: absolute
      height: 175px
      width: 100%
      background: white
    .fixed-tab
      position: absolute
      top: 44px
      z-index: 1
    .fixed-menu-wrapper
      position: fixed
      top: 84px
      bottom: 48px
      left: 0
      overflow: hidden
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
              bg-image('common/image/hot')
            &.promotion
              bg-image('common/image/promotion')
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
            bg-image('common/image/hot-gray')
          &.promotion
            bg-image('common/image/promotion-gray')
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
    .fixed-title-desc
      position: absolute
      top: 84px
      left: 80px
      right: 0
      height: 38px
      padding-left: 12px
      background: white
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
</style>