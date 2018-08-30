<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseFood">
        <span class="inner icon-remove"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add" @click.stop.prevent="addFood"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addFood (event) {
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }

        this.$emit('add', event.target)
      },
      decreaseFood (event) {
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      opacity: 1
      transform: translate3d(0, 0, 0)
      .inner
        display: inline-block
        padding: 6px
        line-height: 24px
        font-size: 24px
        color: rgb(35, 150, 255)
        transition all 0.4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(102, 102, 102)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(35, 150, 255)
</style>