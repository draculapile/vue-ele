<template>
  <div class="seller">
    <div class="seller-info">
      <h1 class="title">商家信息</h1>
      <div class="pics-wrapper">
        <ul class="pic-list">
          <li v-for="pic in seller.pics" :key="pic.id" class="pic-item">
            <img v-lazy="pic" width="76" height="76">
          </li>
        </ul>
      </div>
      <div class="seller-des">
        <span class="des">{{seller.des}}</span>
      </div>
    </div>
    <split></split>
    <div class="seller-detail">
      <ul>
        <li v-for="info in seller.infos" :key="info.id" class="info-item">
          <span class="info-title">{{info.title}}</span>
          <span class="info-des">{{info.des}}</span>
        </li>
      </ul>
    </div>
    <split></split>
    <div class="seller-intellgence">
      <span class="text">营业资质</span>
    </div>
    <div class="tip-off">
      <p class="tip">举报商家</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Split from 'base/split/split'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      Split
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .seller
    background: white
    .seller-info
      padding: 16px
      .title
        margin-bottom: 12px
        font-size: 16px
        font-weight: bold
      .pics-wrapper
        margin-bottom: 16px
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 8px
      .seller-des
        font-size: 14px
        color: rgb(102, 102, 102)
        line-height: 18px
    .seller-detail
      padding: 0 16px
      .info-item
        display: flex
        justify-content: space-between
        font-size: 14px
        line-height: 18px
        padding: 16px 0
        border-1px(rgb(238, 238, 238))
        &:last-child
          border-none()
        .info-title
          font-weight: bold
        .info-des
          color: rgb(102, 102, 102)
          max-width: 160px
          text-align: right
    .seller-intellgence
      padding: 16px
      .text
        font-size: 14px
        font-weight: bold
    .tip-off
      padding: 16px
      background: rgb(238, 238, 238)
      .tip
        padding: 14px
        background: white
        text-align: center
        font-size: 16px
        font-weight: bold
</style>