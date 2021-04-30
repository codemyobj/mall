import { debounce } from "common/utils";
import BackTop from "components/content/backTop/BackTop";
import { POP, NEW, SELL } from './const'

export const itemListenerMixin = {
  data() {
    return {
      ItemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 100);
    this.itemImgListener = () => {
      this.refresh();
    };
    this.$bus.$on("itemImgLoad", this.itemImgListener);
    // console.log('我是混入内容');
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },
    listenShowBackTop(position) {
      this.isShowBackTop = -position.y > 1000;
    },
  }
}

export const tabControlMixin = {
  data() {
    return {
      currentType: POP
    }
  },
  methods: {
    //事件监听相关的方法
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
      }
    }
  }
}