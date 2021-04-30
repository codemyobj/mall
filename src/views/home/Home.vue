<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav">
      <div slot="center">首页</div>
    </nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />
    <!-- @pullingUp="loadMore" -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl2" />
      <good-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { itemListenerMixin, backTopMixin, tabControlMixin } from "common/mixin";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodList,
    Scroll,
  },
  mixins: [itemListenerMixin, backTopMixin, tabControlMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      currentType: "pop",
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  destroyed() {
    console.log("home destroy");
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    //1 保存Y值
    this.saveY = this.$refs.scroll.getScrollY();
    // console.log(this.saveY);

    //2 取消全局事件的监听
    this.$bus.$off("itemImgLoad", this.itemImgListener);
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {},
  methods: {
    //事件监听相关的方法
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    contentScroll(position) {
      //1 判断BackTop是否显示
      // position.y > 1000
      this.listenShowBackTop(position);

      //2 决定tabControl是否吸顶(position:fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.currentType);

      this.$refs.scroll.scroll.refresh();
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    // 网络请求相关的方法
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        //完成了上拉加载更多
        this.$refs.scroll.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  /* position: relative; */
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
  /* margin-top: 2px; */
  /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.content {
  /* height: calc(100% - 49px); */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-control {
  position: relative;
  z-index: 9;
  top: -1px;
}
</style>
