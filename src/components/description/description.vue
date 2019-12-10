<template>
  <div class="description">
    <div class="avatar-favorite">
      <div class="avatar" ref="avatar">
        <img :src="seller.avatar">
      </div>
      <div class="favorite" ref="favorite" @click="toggleFavorite">
        <i :class="favoriteIcon"></i>
      </div>
      <div class="text-wrapper">
        <transition name="show">
          <div class="text" v-show="textShow">
            <span :class="isFavoriteClass">{{isFavoriteText}}</span>
          </div>
        </transition>
      </div>
    </div>
    <div class="name">{{seller.name}}</div>
    <div class="seller-des">
      <div class="star-wrapper">
        <star :score="seller.score" class="seller-star"></star>
        <span class="score">{{seller.score | formatScore}}</span>
      </div>
      <div class="sell-count">月售{{seller.sellCount}}</div>
      <div class="delivery-des">{{seller.deliveryDescription}}约{{seller.deliveryTime}}分钟</div>
    </div>
    <div class="coupon-wrapper">
      <div class="coupon">
        <div class="coupon-left">
          <span class="symbol">￥</span>
          <span class="sum">6</span>
          <span class="des">无门槛</span>
        </div>
        <div class="coupon-right">
          <span class="receive">领取</span>
          <div class="circle-top"></div>
          <div class="circle-bottom"></div>
        </div>
      </div>
    </div>
    <div class="supports-bulletin" ref="brief" v-show="!detailShow">
      <div class="supports-wrapper" v-if="seller.supports">
        <span :class="supportMap[seller.supports[0].type]" class="support-icon"></span>
        <span class="support">{{seller.supports[0].description}}</span>
        <div class="more" @click="unfold">
          <span>{{seller.supports.length}}个优惠</span>
          <i class="icon-unfold"></i>
        </div>
      </div>
      <div class="bulletin">公告：{{seller.bulletin}}</div>
    </div>
    <div class="detail" ref="detail" v-show="detailShow">
      <div class="total-supports">
        <h2 class="title">优惠</h2>
        <i class="icon-unfold" @click="fold"></i>
        <div class="item">
          <ul>
            <li v-for="support in seller.supports" :key="support.id" class="support-item">
              <span :class="supportMap[support.type]" class="support-icon"></span>
              <span class="support">{{support.description}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="services">
        <h2>服务</h2>
        <div class="services-item" v-if="seller.services">
          <span class="service-icon"></span>
          <span class="service">{{seller.services[0].description}}</span>
        </div>
      </div>
      <div class="detail-bulletin">
        <h2>公告</h2>
        <div class="bulletin">{{seller.bulletin}}</div>
      </div>
    </div>
    <div class="fold" @click="fold">
      <i class="icon-fold"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Star from 'components/star/star'
  import { formatScore } from 'common/js/score'
  import { saveToLocal, loadFromLocal } from 'common/js/store'

  export default {
    props: {
      seller: {
        type: Object
      },
      scale: {
        type: Number
      },
      dscrollY: {
        type: Number
      }
    },
    data () {
      return {
        detailShow: false,
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false)
        })(),
        textShow: false
      }
    },
    created () {
      this.supportMap = ['decrease', 'member', 'discount', 'first-order', 'present', 'special']
    },
    computed: {
      favoriteIcon () {
        return this.favorite ? 'icon-favorite' : 'icon-unfavorite'
      },
      isFavoriteClass () {
        return this.favorite ? '' : 'favorite-text'
      },
      isFavoriteText () {
        return this.favorite ? '已取消' : '已收藏'
      }
    },
    methods: {
      toggleFavorite () {
        this.favorite = !this.favorite
        this.textShow = true
        setTimeout(() => {
          this.textShow = false
        }, 800)
        saveToLocal(this.seller.id, 'favorite', this.favorite)
      },
      unfold () {
        this.detailShow = true
        this.$emit('unfold')
      },
      fold () {
        this.detailShow = false
        this.$emit('fold')
      }
    },
    filters: {
      formatScore (score) {
        return formatScore(score)
      }
    },
    watch: {
      scale (newVal) {
        this.$refs.avatar.style['transform'] = `scale(${newVal})`
        this.$refs.favorite.style['transform'] = `scale(${newVal})`
        if (newVal < 0.4) {
          this.$refs.avatar.style.display = 'none'
          this.$refs.favorite.style.display = 'none'
        } else {
          this.$refs.avatar.style.display = ''
          this.$refs.favorite.style.display = ''
        }
      },
      dscrollY (newVal) {
        if (newVal > 3 || isNaN(newVal)) {
          this.detailShow = true
        } else {
          this.detailShow = false
        }
      }
    },
    components: {
      Star
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .description
    background: white
    position: fixed
    top: 125px
    left: 0
    bottom: 0
    width: 100%
    box-sizing: border-box
    padding-top: 30px
    text-align: center
    .avatar-favorite
      width: 100%
      height: 76px
      position: absolute
      top: -60px
      text-align: center
      .avatar
        display: inline-block
        width: 76px
        height: 76px
        transform-origin: bottom
        img
          width: 100%
          height: 100%
          border-radius: 2px
      .favorite
        position: absolute
        top: 42px
        right: 16px
        width: 34px
        height: 34px
        box-shadow: 1px 1px 5px 2px rgb(240, 240, 240)
        display: flex
        align-items: center
        justify-content: center
        border-radius: 50%
        background: white
        .icon-favorite
          color: rgb(255, 76, 98)
          font-size: 20px
        .icon-unfavorite
          color: rgb(255, 76, 98)
          font-size: 24px
      .text-wrapper
        position: absolute
        top: 42px
        right: 35px
        overflow: hidden
        width: 68px
        height: 34px
        z-index: -1
        .text
          position: relative
          top: 7px
          width: 100%
          height: 20px
          padding-left: 12px
          border-radius: 10px
          text-align: left
          background: white
          box-shadow: 1px 1px 5px 2px rgb(240, 240, 240)
          &.show-enter-active, &.show-leave-active
            transition: all 0.5s
          &.show-enter, &.show-leave-to
            transform: translate3d(55px, 0, 0)
        span
          font-size: 10px
          line-height: 20px
          color: rgb(102, 102, 102)
        .favorite-text
          color: rgb(255, 76, 98)
    .name
      font-weight: bold
      font-size: 20px
    .seller-des
      margin-top: 12px
      font-size: 0
      color: rgb(102, 102, 102)
      .star-wrapper
        display: inline-block
        .seller-star
          display: inline-block
          vertical-align: middle
        .score
          margin-left: 4px
          font-size: 14px
          vertical-align: middle
      .sell-count
        display: inline-block
        position: relative
        margin: 0 16px
        font-size: 14px
        vertical-align: middle
        &:before
          content: ''
          display: block
          position: absolute
          top: 15%
          left: -8px
          height: 70%
          border-left: 2px solid rgb(238, 238, 238)
        &:after
          content: ''
          display: block
          position: absolute
          top: 15%
          right: -8px
          height: 70%
          border-left: 2px solid rgb(238, 238, 238)
      .delivery-des
        display: inline-block
        font-size: 14px
        vertical-align: middle
    .coupon-wrapper
      margin: 14px 0
      .coupon
        width: 130px
        height: 24px
        border-radius: 2px
        margin: 0 auto
        background: rgb(255, 229, 120)
        color: rgb(125, 73, 15)
        font-size: 0px
        .coupon-left
          display: inline-block
          width: 95px
          .symbol
            font-size: 10px
            font-weight: bold
          .sum
            font-size: 14px
            font-weight: bold
            margin-left: -2px
          .des
            font-size: 12px
            line-height: 24px
            margin-left: 10px
        .coupon-right
          display: inline-block
          position: relative
          width: 35px
          .receive
            font-size: 12px
            line-height: 24px
          .circle-top
            position: absolute
            top: -2px
            left: -2px
            width: 4px
            height: 4px
            border-radius: 50%
            background: white
          .circle-bottom
            position: absolute
            bottom: -2px
            left: -2px
            width: 4px
            height: 4px
            border-radius: 50%
            background: white
    .supports-bulletin
      padding: 0 38px
      @media only screen and (max-width: 320px)
        padding: 0 20px
      .supports-wrapper
        font-size: 0
        position: relative
        padding-left: 4px
        text-align: left
        .support-icon
          display: inline-block
          vertical-align: middle
          width: 24px
          height: 14px
          margin-right: 6px
          background-size: 100% 100%
          &.decrease
            bg-image('decrease')
          &.member
            bg-image('member')
          &.discount
            bg-image('discount')
          &.first-order
            bg-image('first_order')
          &.present
            bg-image('present')
          &.special
            bg-image('special')
        .support
          line-height: 16px
          font-size: 10px
          vertical-align: middle
          color: rgb(102, 102, 102)
        .more
          display: inline-block
          position: absolute
          right: 0
          font-size: 10px
          line-height: 16px
          vertical-align: middle
          color: rgb(153, 153, 153)
      .bulletin
        margin: 10px 0
        font-size: 12px
        line-height: 16px
        color: rgb(153, 153, 153)
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
    .detail
      position: absolute
      top: 128px
      left: 0
      bottom: 0
      width: 100%
      padding: 0 16px
      box-sizing: border-box
      text-align: left
      z-index: -1
      .total-supports
        position: relative
        .title
          display: inline-block
          font-size: 16px
          line-height: 18px
          font-weight: bold
          margin-bottom: 16px
          @media only screen and (max-width: 320px)
            margin-bottom: 12px
        .icon-unfold
          display: inline-block
          position: absolute
          right: 0
          transform: rotate(180deg)
          font-size: 18px
          line-height: 18px
          font-weight: bold
          color: rgb(187, 187, 187)
        .item
          .support-item
            margin-bottom: 10px
            @media only screen and (max-width: 320px)
              margin-bottom: 5px
            &:last-child
              margin-bottom: 0
            .support-icon
              display: inline-block
              vertical-align: middle
              width: 24px
              height: 14px
              margin-right: 6px
              background-size: 100% 100%
              &.decrease
                bg-image('decrease')
              &.member
                bg-image('member')
              &.discount
                bg-image('discount')
              &.first-order
                bg-image('first_order')
              &.present
                bg-image('present')
              &.special
                bg-image('special')
            .support
              line-height: 16px
              font-size: 10px
              vertical-align: middle
              color: rgb(102, 102, 102)
      .services
        margin-top: 16px
        @media only screen and (max-width: 320px)
          margin-top: 12px
        h2
          font-size: 16px
          font-weight: bold
          margin-bottom: 16px
          @media only screen and (max-width: 320px)
            margin-bottom: 12px
        .services-item
          display: flex
          font-size: 0
          .service-icon
            flex: 0 0 42px
            display: inline-block
            width: 42px
            height: 16px
            margin-right: 6px
            background-size: 100% 100%
            bg-image('guarantee')
          .service
            flex: 1
            display: inline-block
            font-size: 10px
            line-height: 16px
            color: rgb(102, 102, 102)
      .detail-bulletin
        margin-top: 16px
        @media only screen and (max-width: 320px)
          margin-top: 12px
        h2
          font-size: 16px
          font-weight: bold
          margin-bottom: 16px
          @media only screen and (max-width: 320px)
            margin-bottom: 12px
        .bulletin
          font-size: 10px
          line-height: 16px
          color: rgb(102, 102, 102)
    .fold
      position: absolute
      bottom: 28px
      width: 100%
      text-align: center
      color: rgb(204, 204, 204)
      @media only screen and (max-width: 320px)
        bottom: 5px
</style>
