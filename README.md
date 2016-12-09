##根据产品需求，需要仿照淘宝海淘菜单栏实现左右滑动切换数据的效果（手机版的）
###主要思路：
####1.使用vue.js实现双向数据绑定实现实时刷新数据，数据是来源于本地的json文件
####2.swiper实现菜单栏左右滑动效果
###关键核心代码
<pre><code>
     var mySwiper1 = new Swiper('.model-orders-nav-wrapper', {
              slidesPerView: "auto", /*设置slider容器能够同时显示的slides数量(carousel模式)。可以设置为number或者 'auto'则自动根据slides的宽度来设定数量。*/
              freeMode: false, /*自动贴合*/
              freeModeSticky: true, /*自动贴合。*/
              centeredSlides: true, /*设定为true时，活动块会居中，而不是默认状态下的居。*/
              slideToClickedSlide: true, /*设置为true则swiping时点击slide会过渡到这个slide。*/
              onInit: function (swiper) { /*回调函数，初始化后执行。*/

              },

              onSlideChangeStart: function (swiper) {

              },
              onSlideChangeEnd: function (swiper) {
                  //获取active的索引值
                  var activeIndex=mySwiper1.activeIndex;
                  vue1.modelDataActive=vue1.modelData[activeIndex];


              }

          });
</pre></code>
###效果图：
![仿淘宝海淘网左右滑动菜单栏效果](https://github.com/nobrokenboy/swiper-leftright-slide/blob/master/slideleftRight.gif)
###[戳我进入展示页面](http://nobrokenboy.me/swiper-leftright-slide/2016-10-13-swiper-menu.html)
###扫我看看
![效果图](https://github.com/nobrokenboy/swiper-leftright-slide/blob/master/leftright.png)
