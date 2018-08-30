import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Goods = () => import('components/goods/goods')
const Ratings = () => import('components/ratings/ratings')
const Seller = () => import('components/seller/seller')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      component: Goods
    },
    {
      path: '/ratings',
      component: Ratings
    },
    {
      path: '/seller',
      component: Seller
    }
  ]
})
