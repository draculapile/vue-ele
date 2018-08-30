<template>
  <div class="tab border-1px">
    <router-link tag="div" class="tab-item" to="/goods">
      <span class="tab-link">点餐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/ratings">
      <span class="tab-link">评价</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/seller">
      <span class="tab-link">商家</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    background: white
    border-1px(rgb(238, 238, 238))
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 9px
        font-size: 16px
        font-weight: bold
        color: rgb(102, 102, 102)
      &.router-link-active
        .tab-link
          color: rgb(51, 51, 51)
          position: relative
          &:after
            display: block
            position: absolute
            left: 0
            bottom: 0
            width: 100%
            border-bottom: 2px solid rgb(35, 149, 255)
            border-radius: 1px
            content: ' '
</style>
