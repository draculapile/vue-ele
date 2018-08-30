<template>
  <div class="header">
    <div class="search">
      <div class="back">
        <i class="icon-back"></i>
      </div>
      <div class="search-box-wrapper" ref="searchBox">
        <search-box></search-box>
      </div>
      <div class="icons" ref="icons">
        <div class="search-icon">
          <i class="icon-search"></i>
        </div>
        <div class="bulk-purchase">
          <i class="icon-bulk-purchase"></i>
        </div>
      </div>
      <div class="more">
        <i class="icon-more"></i>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'components/search-box/search-box'

  export default {
    props: {
      seller: {
        type: Object
      },
      opacity: {
        type: Number
      }
    },
    watch: {
      opacity (newVal) {
        this.$refs.searchBox.style.opacity = newVal
        this.$refs.icons.style.opacity = 1 - newVal
      }
    },
    components: {
      SearchBox
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .header
    position: relative
    width: 100%
    .bg-image
      height: 100%
      width: 100%
      background-size: cover
      box-shadow: 0px 1px 80px 2px rgb(165, 162, 161) inset
    .search
      display: flex
      position: absolute
      top: 0
      width: 100%
      height: 44px
      padding: 8px 0 8px 0
      box-sizing: border-box
      z-index: 11
      color: white
      .back
        flex: 1
        display: flex
        align-items: center
        justify-content: center
        .icon-back
          font-size: 24px
      .icons
        position: absolute
        right: 50px
        width: 76px
        height: 28px
        display: flex
        font-size: 18px
        opacity: 1
        .search-icon
          flex: 1
          display: flex
          align-items: center
          justify-content: center
        .bulk-purchase
          flex: 1
          display: flex
          align-items: center
          justify-content: center
      .search-box-wrapper
        flex: 5.5
        opacity: 0
      .more
        flex: 1
        display: flex
        align-items: center
        justify-content: center
        .icon-more
          font-size: 24px
</style>