<template>
  <div class="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score | formatScore}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore | formatScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore | formatScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <rating-select @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings"></rating-select>
      <div class="rating-wrapper">
        <ul>
          <li v-for="(rating, index) in ratings" :key="rating.id" class="rating-item" v-show="needShow(rating.rateType, rating.images, rating.text)">
            <div class="user-avatar" :style="{backgroundPosition: 0+'px '+(-index)*32+'px'}">
              <img class="avatar" :src="rating.avatar" v-show="rating.avatar">
            </div>
            <div class="rating-des">
              <span class="name">{{rating.username}}</span>
              <div class="satisfy">
                <star :score="rating.score"></star>
                <span class="satisfaction" :class="classMap[rating.rateType]">{{satisfied(rating.rateType)}}</span>
              </div>
              <div class="rating-content">
                <div class="text" v-show="rating.text">
                  <p>{{rating.text}}</p>
                  <div class="reply" v-show="rating.reply">
                    <span class="triangle"></span>
                    <span>商家回复：{{rating.reply}}</span>
                  </div>
                </div>
                <div class="rating-img" v-show="rating.images" v-for="image in rating.images" :key="image.id">
                  <div class="img-wrapper">
                    <img v-lazy="image.url" width="90" height="90">
                  </div>
                </div>
              </div>
              <div class="recommend" v-show="rating.recommend.length > 0">
                <i class="icon-good"></i>
                <div class="recommend-goods">
                  <div class="goods-item" v-for="item in rating.recommend" :key="item.id">
                    <span class="goods-name">{{item}}</span>
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
</template>

<script type="text/ecmascript-6">
  import Star from 'base/star/star'
  import Split from 'base/split/split'
  import RatingSelect from 'components/ratingselect/ratingselect'
  import { formatScore } from 'common/js/score'
  import { formatDate } from 'common/js/date'

  const ALL = 4
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
        ratings: [],
        selectType: ALL,
        onlyContent: true
      }
    },
    created () {
      const ratingsUrl = debug ? '/api/ratings' : 'http://degula.site/vue-ele/api/ratings'
      this.$http.get(ratingsUrl).then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.ratings = response.data
        }
      })
      this.classMap = ['v-satisfied', 'satisfied', 'unsatisfied']
    },
    methods: {
      needShow (type, images, text) {
        if (this.onlyContent && !text && !images.length) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        }
        if (this.selectType === 3 && images.length > 0) {
          return true
        } else {
          return type === this.selectType
        }
      },
      selectRating (type) {
        this.selectType = type
      },
      toggleContent () {
        this.onlyContent = !this.onlyContent
      },
      satisfied (type) {
        if (type === 0) {
          return '超赞'
        } else if (type === 1) {
          return '满意'
        } else {
          return '吐槽'
        }
      }
    },
    filters: {
      formatScore (score) {
        return formatScore(score)
      },
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    components: {
      Star,
      Split,
      RatingSelect
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .ratings
    background: white
    .ratings-content
      .overview
        display: flex
        padding 16px 0 16px 0
        border-1px(rgb(238, 238, 238))
        .overview-left
          flex: 0 0 132px
          width: 132px
          text-align: center
          border-right: 1px solid rgb(230, 230, 230)
          @media only screen and (max-width: 320px)
            flex: 0 0 120px
            width: 120px
          .score
            margin-bottom: 10px
            font-size: 18px
            font-weight: bold
            color: rgb(255, 83, 57)
          .title
            font-size: 10px
            color: rgb(102, 102, 102)
            margin-bottom: 10px
          .rank
            font-size: 10px
            color: rgb(153, 153, 153)
        .overview-right
          flex: 1
          padding-left: 50px
          @media only screen and (max-width: 320px)
            padding-left: 20px
          .score-wrapper
            margin-bottom: 10px
            font-size: 0
            .title
              display: inline-block
              line-height: 18px
              font-size: 12px
              color: rgb(102, 102, 102)
            .star
              display: inline-block
              margin: 0 16px
            .score
              display: inline-block
              line-height: 18px
              font-size: 12px
              color: rgb(255, 83, 57)
          .delivery-wrapper
            font-size: 0
            .title
              line-height: 18px
              font-size: 12px
              color: rgb(102, 102, 102)
            .delivery
              margin-left: 16px
              font-size: 12px
              color: rgb(153, 153, 153)
      .rating-wrapper
        .rating-item
          display: flex
          padding: 15px
          font-size: 0
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
              .star
                display: inline-block
              .satisfaction
                margin-left: 5px
                &.v-satisfied
                  color: rgb(255, 98, 4)
                &.satisfied
                  color: rgb(255, 170, 12)
                &.unsatisfied
                  color: rgb(119, 119, 119)
              .delivery-time
                display: inline-block
                position: relative
                margin-left: 5px
                font-size: 12px
                color: rgb(102, 102, 102)
                &:before
                  content: ''
                  display: block
                  position: absolute
                  top: 20%
                  left: -8px
                  height: 60%
                  border-left: 1px solid rgb(221, 221, 221)
            .rating-content
              .text
                font-size: 14px
                line-height: 18px
                margin-bottom: 15px
                p
                  margin-bottom: 8px
                .reply
                  position: relative
                  padding: 6px 10px
                  background: rgb(243, 243, 243)
                  font-size: 14px
                  line-height: 16px
                  .triangle
                    position: absolute
                    left: 10px
                    top: -10px
                    width: 0
                    height: 0
                    overflow: hidden
                    border-width: 5px
                    border-style: solid
                    border-color: white white rgb(243, 243, 243) white
              .rating-img
                display: inline-block
                margin-right: 5px
                &:last-child
                  margin-right: 0
                img
                  width: 90px
                  height: 90px
            .recommend
              display: flex
              margin-top: 10px
              .icon-good
                flex: 0 0 14px
                font-size: 14px
                line-height: 18px
              .recommend-goods
                flex: 1
                margin-left: 8px
                .goods-item
                  display: inline-block
                  padding: 6px
                  margin-right: 6px
                  margin-bottom: 6px
                  background: rgb(235, 245, 255)
                  .goods-name
                    font-size: 12px
                    color: rgb(109, 120, 133)
          .rating-time
            position: absolute
            top: 15px
            right: 15px
            color: rgb(156, 156, 156)
            font-size: 12px
            line-height: 14px
</style>