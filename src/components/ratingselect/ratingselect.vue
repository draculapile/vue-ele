<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span @click="select(4,$event)" class="block positive" :class="{'active': selectType === 4}">{{desc.all}}<span class="count">({{ratings.length}})</span></span>
      <span @click="select(0,1,$event)" class="block positive" :class="{'active': selectType === 0 || selectType === 1}">{{desc.positive}}<span class="count">({{vpositives.length + positives.length}})</span></span>
      <span @click="select(2,$event)" class="block negative" :class="{'active': selectType === 2}">{{desc.negative}}<span class="count">({{negatives.length}})</span></span>
      <span @click="select(3,$event)" class="block positive" :class="{'active': selectType === 3}">{{desc.pic}}<span class="count">({{pics.length}})</span></span>
    </div>
    <div class="switch" :class="{'on': onlyContent}" @click="toggleContent">
      <i class="icon-selected"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const VPOSITIVE = 0
  const POSITIVE = 1
  const NEGATIVE = 2
  const ALL = 4

  export default {
    props: {
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意',
            pic: '有图'
          }
        }
      }
    },
    computed: {
      vpositives () {
        return this.ratings.filter((rating) => {
          return rating.rateType === VPOSITIVE
        })
      },
      positives () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      negatives () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      },
      pics () {
        return this.ratings.filter((rating) => {
          return rating.images.length > 0
        })
      }
    },
    methods: {
      select (type) {
        this.$emit('select', type)
      },
      toggleContent () {
        this.$emit('toggle')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .ratingselect
    padding: 0 15px
    .rating-type
      padding: 10px 0
      border-bottom: 1px dashed rgb(238, 238, 238)
      font-size: 0
      .block
        display: inline-block
        padding: 10px 14px
        margin-right: 7px
        border-radius: 4px
        font-size: 12px
        line-height: 12px
        color: rgb(109, 120, 133)
        &.active
          color: white
        .count
          margin-left: 2px
          font-size: 12px
        &.positive
          background: rgb(235, 245, 255)
          &.active
            background: rgb(35, 149, 255)
        &.negative
          background: rgb(245, 245, 245)
          &.active
            background: rgb(204, 204, 204)
    .switch
      padding: 10px 0
      line-height: 14px
      font-size: 0
      border-bottom 1px solid rgb(238, 238, 238)
      &.on
        .icon-selected
          color: rgb(76, 217, 100)
      .icon-selected
        display: inline-block
        margin-right: 6px
        font-size: 14px
        vertical-align: middle
      .text
        display: inline-block
        font-size: 12px
        color: rgb(102, 102, 102)
        vertical-align: middle
</style>