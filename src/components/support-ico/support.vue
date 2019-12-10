<template>
  <span class="support-ico" :class="iconCls"></span>
</template>

<script>
  export default {
    name: 'support-ico',
    props: {
      size: {
        type: Number
      },
      type: {
        type: Number
      }
    },
    computed: {
      iconCls () {
        const classMap = []
        return `icon-${this.size} ${classMap[this.type]}`
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~common/stylus/mixin'

  .support-ico
    display: inline-block
    background-repeat: no-repeat

    .icon-1
      width: 12px
      height: 12px
      background-size: 12px 12px

      &.decrease
        bg-image('decrease_1')

      &.discount
        bg-image('discount_1')

      &.guarantee
        bg-image('guarantee_1')

      &.invoice
        bg-image('invoice_1')

      &.special
        bg-image('special_1')
</style>
