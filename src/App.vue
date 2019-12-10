<template>
  <div id="app">
    <v-header :seller="seller" :bgImageUrl="bgImageUrl" :scrollY="scrollY"></v-header>
    <cube-scroll class="scroll-wrapper"
      direction="vertical"
      :scroll-events="scrollEvents"
      :options="scrollOptions"
      @scroll="onWrapperScroll">
      <tab :tabs="tabs"></tab>
    </cube-scroll>
    
  </div>
</template>

<script>
  // import qs from 'query-string'
  import { getSeller } from 'api'
  import VHeader from 'components/v-header/v-header'
  import Goods from 'components/goods/goods'
  import Ratings from 'components/ratings/ratings'
  import Seller from 'components/seller/seller'
  import Tab from 'components/tab/tab'

  export default {
    name: 'app',
    data() {
      return {
        seller: {},
        bgImageUrl: '',
        scrollOptions: {
          probeType: 3,
          directionLockThreshold: 0
        },
        scrollEvents: ['scroll'],
        scrollY: 0
      }
    },
    created() {
      this._getSeller()
    },
    computed: {
      tabs() {
        return [
          {
            label: '点餐',
            component: Goods,
            data: {
              seller: this.seller
            }
          },
          {
            label: '评价',
            component: Ratings,
            data: {
              seller: this.seller
            }
          },
          {
            label: '商家',
            component: Seller,
            data: {
              seller: this.seller
            }
          }
        ]
      }
    },
    methods: {
      _getSeller() {
        getSeller().then((seller) => {
          this.seller = seller
          this.bgImageUrl = seller.background
        })
      },
      onWrapperScroll(pos) {
        this.scrollY = pos.y
      }
    },
    components: {
      VHeader,
      Tab
    }
  }
</script>
<style lang="stylus">
  #app
    .scroll-wrapper
      width: 100%
      height: auto
      position: fixed
      overflow: visible
      top: 300px
      left: 0
      right: 0
      bottom: 0
</style>
