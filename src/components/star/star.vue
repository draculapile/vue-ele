<template>
  <div class="star">
    <div class="star-top" :style="styleWidth">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="star-bottom">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      score: {
        type: Number
      }
    },
    computed: {
      styleWidth () {
        let scoreString = this.score + ''
        let posDecimal = scoreString.indexOf('.')
        if (posDecimal < 0) {
          posDecimal = scoreString.length
          scoreString += '.'
        }
        while (scoreString.length < posDecimal + 2) {
          scoreString += '0'
        }
        let scoreArr = scoreString.split('.')
        let integer = parseInt(scoreArr[0])
        let decimal = parseInt(scoreArr[1]) * 0.1
        let percent = (10 * integer + decimal * 8) / 48
        return `width: ${percent * 100}%`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .star
    position: relative
    display: table
    padding: 0
    height: 8px
    width: 48px
    font-size: 0
    span
      position: relative
      display: inline-block
      margin-right: 2px
      height: 8px
      width: 8px
      &:last-child
        margin-right: 0
    .star-top
      display: block
      position: absolute
      top: 0
      left: 0
      padding: 0
      z-index: 1
      overflow: hidden
      white-space: nowrap
      span
        &:after
          position: absolute
          top: 0
          right: 0
          bottom: 0
          left: 0
          content: ' '
          background-size: 8px 8px
          bg-image('star_on')
    .star-bottom
      display: block
      padding: 0
      z-index: 0
      span
        &:after
          position: absolute
          top: 0
          right: 0
          bottom: 0
          left: 0
          content: ' '
          background-size: 8px 8px
          bg-image('star_off')
</style>
