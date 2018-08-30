<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" @focus="focus" @blur="blur">
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      placeholder: {
        type: String,
        default: '想吃什么搜一搜'
      }
    },
    methods: {
      focus () {
        this.$emit('focus')
      },
      blur () {
        this.$emit('blur')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .search-box
    display: flex
    align-items: center
    justify-content: center
    box-sizing: border-box
    padding-left: 80px
    width: 100%
    height: 28px
    background: white
    border-radius: 2px
    .icon-search
      font-size: 14px
      color: rgb(153, 153, 153)
    .box
      flex: 1
      font-size: 14px
      outline: 0
      margin-left: 5px
      &::placeholder
        color: rgb(153, 153, 153)
</style>