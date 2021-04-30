<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <!-- 属性：topImages 传入值：top-images -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar @addCart="addToCart" class="detail-bottom" />
    <!-- <toast :message="message" :show="show" /> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComponents/DetailNavBar";
import DetailSwiper from "./childComponents/DetailSwiper";
import DetailBaseInfo from "./childComponents/DetailBaseInfo";
import DetailShopInfo from "./childComponents/DetailShopInfo";
import DetailGoodsInfo from "./childComponents/DetailGoodsInfo";
import DetailParamInfo from "./childComponents/DetailParamInfo";
import DetailCommentInfo from "./childComponents/DetailCommentInfo";
import DetailBottomBar from "./childComponents/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";

import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin";

import { mapActions } from "vuex";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    // Toast,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      // message: "",
      // show: false,
    };
  },
  created() {
    //1 保存传入的iid
    this.iid = this.$route.params.id;

    //2 根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      //1 获取顶部的轮播数据
      // console.log(res);
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      //2 获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      //3 创建店铺信息对象
      this.shop = new Shop(data.shopInfo);

      //4 保存商品的详情数据
      this.detailInfo = data.detailInfo;

      //5 获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      //6 获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
      /* 
      //1 第一次获取，值不对
      //值不对的原因：this.$refs.params.$el.offsetTop没有渲染
      this.themeTopYs = [];

      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

      console.log(this.themeTopYs);

      this.$nextTick(() => {
        //2 第二次获取：值不对
        //值不对的原因：图片没有计算在内
        //根据最新的数据对应的dom是已经被渲染出来了
        //但是图片依然是没有加载完的(目前获取到的offsetTop是不包含其中的图片的)
        //offsetTop值不对的时候，一般都是图片的问题
        this.themeTopYs = [];

        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

        console.log(this.themeTopYs);
      });
      */
    });

    //3 请求推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });

    //4 给 getThemeTopY 赋值(对给this.themeTopYs赋值的操作进行防抖)
    this.getThemeTopY = debounce(() => {
      // console.log(".---");
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);

      // console.log(this.themeTopYs);
    });
  },

  methods: {
    ...mapActions({
      add: "addCart",
    }),
    imageLoad() {
      this.refresh();
      this.getThemeTopY();
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },
    contentScroll(position) {
      //1 获取y值
      const positionY = -position.y;

      //2 positionY和主题中的值进行对比
      //[0, 15911, 17183, 17399, Number.MAX_VALUE]

      //positionY 在0和15911之间，index = 0
      //positionY 在=15911和17183之间，index = 1
      //positionY 在=17183和17399之间，index = 2
      //positionY 在17183和非常大的值之间，index = 3

      //positionY 大于或者等于17399值，index = 3
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        // console.log(i + 1);
        // if (
        //   positionY > this.themeTopYs[i] &&
        //   positionY < this.themeTopYs[i + 1]
        // ) {
        //   console.log(i);
        // }

        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }

        // if (
        //   this.currentIndex !== i &&
        //   ((i < length - 1 &&
        //     positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i + 1]) ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))
        // ) {
        //   this.currentIndex = i;
        //   // console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndex;
        // }
      }
      //3 是否显示回到顶部
      this.listenShowBackTop(position);
    },
    addToCart() {
      //1 获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //2 将商品添加到购物车里(1.promis 2.mapActions)
      // this.$store.cartList.push(product)
      // this.$store.commit("addCart", product);
      this.add(product).then((res) => {
        // this.show = true;
        // this.message = res;

        // setTimeout(() => {
        //   this.show = false;
        //   this.message = "";
        // }, 1500);
        this.$toast.show(res);
      });

      // this.$store.dispatch("addCart", product).then((res) => {
      //   console.log(res);
      // });

      //3 添加到购物车成功
    },
  },

  mounted() {},

  destroyed() {
    this.$bus.$off("itemImgLoad", this.itemImgListener);
  },
};
</script>
<style scoped>
#detail {
  height: 100vh;
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  /* height: calc(100% - 49px); */
  position: absolute;
  top: 44px;
  bottom: 59px;
}
</style>