# vue-ele
基于Vue的仿新版饿了么商家点餐页面的WebApp
## 写在前
此项目是在学习完慕课网课程[完整项目流程Vue.js 开发饿了么App](https://coding.imooc.com/class/74.html)后，根据新版饿了么app的布局和动效自己倒腾出来的。代码质量不高，一些细节也并不完美，但毕竟是自己做的第一个完整项目，后续有新的思路或者好的实现方式，会不定期更新维护，谨此记录。

[项目地址](http://degula.site/vue-ele)

![](https://wx2.sinaimg.cn/mw690/006A3Arngy1fuphz6ira3j307s07sgld.jpg)
### 一些调试bug的经历
#### localhost:8080/undefined
一开始并没有注意到这个bug，因为本地开发时控制台Console里并没有报错。npm run build打包后，报错信息：

![](https://wx2.sinaimg.cn/mw690/006A3Arngy1fursth8kpej30jw031t8m.jpg)

404应该是有资源没有请求到，再看打包前，Network里也有一个：

![](https://wx3.sinaimg.cn/mw690/006A3Arngy1furstgk62fj311d0ldabx.jpg)

奇怪的是，本地调试时，程序里所有数据和图片都正常显示。。。

于是检查代码里为什么会有这个请求。

先排查了接口，仔细检查几遍后并无写错。

再看这个Network里的信息，请求类型是Img，就想到检查了所有跟图片有关的 `:src`  和一些背景图片的 `url()`  路径，无果（其实想想这部分写错的可能性不大，毕竟所有的图片都是正常显示的），再看下打包后的报错信息的定位：

![](https://wx3.sinaimg.cn/mw690/006A3Arngy1furstgx217j311r0130sk.jpg)

定位在App.vue:132，

![](https://wx1.sinaimg.cn/mw690/006A3Arngy1fursthyjsbj30e700za9v.jpg)

但是这段代码本身是没有问题的。

鉴于报错信息能给的提示实在有限，而且自己并不算是经验丰富，所以接下来采取了笨办法。将App.vue里引入的组件分别注释掉，再刷新页面查看网络请求，找到了源头：一个背景图片的组件。那么看一下相关代码：

    computed: {
        bgImage () {
            // console.log('1')  <==埋个伏笔
            return `background-image:url(${this.seller.background})`
        },
        // code
    }

`this.seller` 是来自同组件的 `created () {}` 钩子里的异步请求；并且有个自有属性 `background` ，值为一个图片的url，
    
    // 通过vue-resource发送的ajax请求
    this.$http.get('xxx').then((response) => {
        // code
        if (response.errno === ERR_OK) {
            this.seller = Object.assign({}, this.seller, response.data)
            // console.log('2')  <==埋个伏笔
        }
    })

`seller` 在 `data () {}` 里做了声明。

我们知道，Vue要求我们必须在初始化实例前声明根级响应式属性，而且，Vue的DOM更新，是异步的！

把上面代码中注释掉的部分，在控制台里打印：

![](https://wx4.sinaimg.cn/mw690/006A3Arngy1fursthm3faj30df02gmwz.jpg)

搞清楚了数据获取与页面更新的顺序，那么不难理解，由于Vue的机制，在这种情况（异步获取数据）下，依赖 `bgImage () {}` 返回值的元素，在插入页面时，并未立即获取到所需要的图片地址，而是在ajax回调里拿到数据后，重新渲染更新了视图。这也就导致了，run dev调试的时候，虽然整个页面都是正确显示的，但是 `computed () {}` 第一次并没有拿到图片的地址，不仔细观察网络请求的话，也难注意到有个 `localhost:8080/undefined` 请求。打包后调试，这个不起眼的 undefined 就会报一个 `404`。

解决方法自然也很简单，在 `data () {}` 里声明：

    imgUrl: ''  // 图片地址，默认为空字符串
    
回调里：

    this.seller = ...
    this.imgUrl = this.seller.background   // <== 添加 
    
这样的话计算属性里返回 `this.imgUrl` ，告诉Vue这个属性是有的，等一会就好啦。
#### someothers
开发过程中也遇到了其他一些小问题，简单做一下总结。比如：

- Cannot read property 'xx' of undefined，一般是拼写错误
- `v-show ` 条件渲染的组件，未渲染时候拿不到元素的宽高值，解决方法是： `watch` `v-show` 的标志位，值为 `true` 时获取需要的宽高数据

等等。
### 结语
虽然Vue的官方文档里也介绍了Vue的响应式原理和注意事项，但是在自己的实际开发过程中，才能更深刻的体会到它所言为何物。熟练使用工具或者框架是一回事，靠近原理部分，体会它的设计思想或者实现方式才能获得长足的进步。一点小小的感悟，如有错误，望不吝指正。

再次感谢[黄轶老师](https://github.com/ustbhuangyi)的课程！
