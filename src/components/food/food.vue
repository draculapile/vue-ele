<template>
  <div>
    <transition name="fold">
      <scroll class="food"
              v-show="showFlag"
              ref="food"
              @scroll="scroll"
              @scroll-end="scrollEnd"
              :listen-scroll-end="listenScrollEnd"
              :listen-scroll="listenScroll"
              :probe-type="probeType">
        <div class="food-content">
          <div class="image-header" ref="foodImage">
            <img :src="food.icon">
            <div class="close" @click="hide" v-show="!fixedIcon">
              <i class="icon-close"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="count-rating">
              <span v-show="food.sellCount">月售{{food.sellCount}}</span>
              <span class="rating" v-show="food.sellCount">好评率{{food.rating}}%</span>
            </div>
            <div class="price-cartcontrol">
              <span class="symbol">￥</span>
              <span class="number">{{food.price}}</span>
              <div class="cartcontrol-wrapper">
                <cartcontrol @add="addFood" :food="food"></cartcontrol>
              </div>
            </div>
            <div class="brief" ref="brief">
              <div class="des">
                <p v-html="food.info"></p>
              </div>
              <div class="border"></div>
              <div class="recommend">
                <i class="icon-good"></i>
                <span>有人为你推荐了该商品</span>
              </div>
              <div class="more" @click="scrollToTop">
                <i class="icon-fold"></i>
              </div>
            </div>
            <div class="des-total" ref="desTotal">
              <p v-html="food.info"></p>
            </div>
            <div class="food-rating">
              <h1 class="rating-title">商品评价</h1>
              <div class="border"></div>
              <div class="rating-wrapper">
                <ul>
                  <li v-for="(rating, index) in food.ratings" :key="rating.id" class="rating-item">
                    <div class="user-avatar" :style="{backgroundPosition: 0+'px '+(-index)*32+'px'}">
                      <img class="avatar" :src="rating.avatar" v-show="rating.avatar">
                    </div>
                    <div class="rating-des">
                      <span class="name">{{rating.username}}</span>
                      <div class="satisfy">
                        <span class="item">商品：</span>
                        <span class="satisfaction" :class="classMap[rating.rateType]">{{satisfied(rating.rateType)}}</span>
                      </div>
                      <div class="rating-content">
                        <p class="text" v-show="rating.text">{{rating.text}}</p>
                        <div class="rating-img" v-show="rating.images" v-for="image in rating.images" :key="image.id">
                          <div class="img-wrapper">
                            <img v-lazy="image.url" width="90" height="90">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="rating-time">{{rating.rateTime | formatDate}}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </transition>
    <div class="food-fixed" ref="fixed" v-show="fixedShow">
      <div class="fixed-image">
        <img :src="food.icon" class="fimg">
      </div>
      <div class="fixed-content">
        <h1 class="title">{{food.name}}</h1>
        <div class="count-rating">
          <span v-show="food.sellCount">月售{{food.sellCount}}</span>
          <span class="rating" v-show="food.sellCount">好评率{{food.rating}}%</span>
        </div>
        <div class="price-cartcontrol">
          <span class="symbol">￥</span>
          <span class="number">{{food.price}}</span>
          <div class="cartcontrol-wrapper">
            <cartcontrol @add="fixedAddFood" :food="food"></cartcontrol>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="food-mask" v-show="showFlag"></div>
    </transition>
    <div class="fixed-close-icon" v-show="fixedIcon" @click="hide">
      <i class="icon-close"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { formatDate } from 'common/js/date'
  import Scroll from 'base/scroll/scroll'
  import Cartcontrol from 'components/cartcontrol/cartcontrol'

  export default {
    props: {
      food: {
        type: Object
      },
      deviceHeight: {
        type: Number
      }
    },
    data () {
      return {
        showFlag: false,
        scrollY: 0,
        scrollEndY: 0
      }
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
      this.listenScrollEnd = true
      this.classMap = ['v-satisfied', 'satisfied', 'unsatisfied']
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.food.refresh()
      })
    },
    computed: {
      fixedShow () {
        if (this.scrollY < this.scrollHeight && this.showFlag) {
          return true
        }
        return false
      },
      fixedIcon () {
        if (this.scrollY < -this.diffTop && this.showFlag) {
          return true
        }
        return false
      }
    },
    methods: {
      scroll (pos) {
        this.scrollY = pos.y
      },
      scrollEnd (pos) {
        this.scrollEndY = pos.y
      },
      show () {
        this.showFlag = true
        this.$refs.food.scrollTo(0, 0, 300)
        this.$emit('getFlag', this.showFlag)
      },
      hide () {
        this.showFlag = false
        this.$emit('getFlag', this.showFlag)
      },
      addFood (target) {
        this.$emit('drop', target)
        setTimeout(() => {
          this.hide()
        }, 500)
      },
      fixedAddFood (target) {
        this.$emit('drop', target)
      },
      scrollToTop () {
        this.$refs.food.scrollTo(0, -this.diffTop, 300)
      },
      satisfied (type) {
        if (type === 0) {
          return '非常满意'
        } else if (type === 1) {
          return '满意'
        } else {
          return '吐槽'
        }
      }
    },
    watch: {
      scrollY (newVal) {
        let percent = newVal / -44
        this.$refs.brief.style.opacity = Math.max(1 - percent * 1, 0)
        this.$refs.desTotal.style.opacity = Math.min(percent * 1, 1)
        this.$emit('getScrollY', newVal)
      },
      scrollEndY (newVal) {
        if (newVal > -30 && newVal < 0) {
          this.$refs.food.scrollTo(0, 0, 300)
        }
        if (newVal < -30 && newVal > -this.diffTop) {
          this.$refs.food.scrollTo(0, -this.diffTop, 300)
        }
      },
      showFlag () {
        this.$nextTick(() => {
          this.$refs.food.refresh()
          // 不同设备屏幕尺寸展示优化
          let imageHeight = this.$refs.foodImage.clientHeight
          let foodWrapperHeight = imageHeight + 248
          this.$refs.food.$el.style.height = `${foodWrapperHeight}px`
          this.$refs.fixed.style.height = `${imageHeight + 106}px`
          this.diffTop = this.deviceHeight - foodWrapperHeight
          let fixedTop = -imageHeight + 64
          this.$refs.fixed.style.top = `${fixedTop}px`
          this.scrollHeight = -(this.deviceHeight - foodWrapperHeight) + fixedTop
        })
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd')
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

  .food
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    z-index: 30
    background: white
    &.fold-enter-active, &.fold-leave-active
      transition: all 0.3s
    &.fold-enter, &.fold-leave-to
      transform: translate3d(0, 100%, 0)
    .food-content
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100%
        img
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
        .close
          position: absolute
          top: 16px
          right: 20px
          .icon-close
            display: block
            padding: 5px
            font-size: 18px
            color: white
      .content
        background: white
        padding: 14px
        position: relative
        .title
          line-height: 18px
          margin-bottom: 12px
          font-size: 18px
          font-weight: 600
        .count-rating
          margin-bottom: 16px
          font-size: 12px
          color: rgb(153, 153, 153)
          .rating
            margin-left: 6px
        .price-cartcontrol
          position: relative
          height: 24px
          margin-bottom: 10px
          .symbol
            line-height: 24px
            color: rgb(255, 83, 57)
          .number
            margin-left: -8px
            line-height: 24px
            font-size: 20px
            font-weight: bold
            color: rgb(255, 83, 57)
          .cartcontrol-wrapper
            display: inline-block
            position: absolute
            right: 0
            bottom: -8px
        .brief
          position: absolute
          top: 106px
          left: 14px
          right: 14px
          bottom: 0
          background: white
          z-index: 60
          .des
            height: auto
            min-height: 20px
            max-height: 60px
            color: rgb(122, 122, 122)
            p
              font-size: 12px
              line-height: 20px
              min-height: 20px
              max-height: 60px
              overflow: hidden
              display: -webkit-box
              -webkit-line-clamp: 3
              -webkit-box-orient: vertical
              text-overflow: ellipsis
          .border
            height: 14px
            width: 100%
            border-1px(rgb(238, 238, 238))
          .recommend
            padding-top: 12px
            .icon-good
              color: rgb(255, 83, 57)
              font-size: 14px
            span
              color: rgb(122, 122, 122)
              font-size: 14px
          .more
            padding-top: 20px
            text-align: center
            color: rgb(204, 204, 204)
            .icon-fold
              display: block
              font-size: 16px
        .des-total
          opacity: 0
          z-index: 10
          font-size: 12px
          line-height: 20px
          color: rgb(122, 122, 122)
        .food-rating
          font-size: 0
          margin-top: 24px
          padding-bottom: 14px
          .rating-title
            font-size: 14px
            line-height: 24px
          .border
            width: 100%
            height: 15px
            border-1px(rgb(238, 238, 238))
          .rating-wrapper
            .rating-item
              display: flex
              padding: 15px 15px 15px 0
              border-1px(rgb(238, 238, 238))
              &:last-child
                border-1px(white)
              .user-avatar
                flex: 0 0 32px
                vertical-align: top
                width: 32px
                height: 32px
                background-image: url('avatar.png')
                background-size: 100% 600%
                border-radius: 2px
                .avatar
                  width: 100%
                  height: 100%
                  border-radius: 2px
              .rating-des
                flex: 1
                margin-left: 8px
                .name
                  display: block
                  font-size: 14px
                  margin-bottom: 8px
                .satisfy
                  margin-bottom: 15px
                  font-size: 12px
                  .item
                    color: rgb(102, 102, 102)
                  .satisfaction
                    &.v-satisfied
                      color: rgb(255, 98, 4)
                    &.satisfied
                      color: rgb(255, 170, 12)
                    &.unsatisfied
                      color: rgb(119, 119, 119)
                .rating-content
                  .text
                    font-size: 14px
                    margin-bottom: 15px
                  .rating-img
                    display: inline-block
                    margin-right: 5px
                    &:last-child
                      margin-right: 0
                    img
                      width: 90px
                      height: 90px
              .rating-time
                position: absolute
                top: 15px
                right: 0
                color: rgb(156, 156, 156)
                font-size: 12px
                line-height: 14px
  .food-fixed
    position: fixed
    background: white
    width: 100%
    z-index: 35
    .fixed-image
      width: 100%
      height: 0
      padding-top: 100%
      position: relative
      .fimg
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
    .fixed-content
      background: white
      padding: 14px 14px 10px 14px
      border-1px(rgb(238, 238, 238))
      .title
        line-height: 18px
        margin-bottom: 12px
        font-size: 18px
        font-weight: 600
      .count-rating
        margin-bottom: 16px
        font-size: 12px
        color: rgb(153, 153, 153)
        .rating
          margin-left: 6px
      .price-cartcontrol
        position: relative
        height: 24px
        .symbol
          line-height: 24px
          color: rgb(255, 83, 57)
        .number
          margin-left: -8px
          line-height: 24px
          font-size: 20px
          font-weight: bold
          color: rgb(255, 83, 57)
        .cartcontrol-wrapper
          display: inline-block
          position: absolute
          right: 0
          bottom: -8px
          z-index: 80
  .food-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 20
    opacity: 0.5
    background: rgba(128, 128, 128, 0.9)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.4s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(128, 128, 128, 0)
  .fixed-close-icon
    position: fixed
    top: 16px
    right: 20px
    z-index: 35
    .icon-close
      display: block
      padding: 5px
      font-size: 18px
      color: white
</style>