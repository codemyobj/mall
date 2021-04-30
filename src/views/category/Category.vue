<template>
  <div id="catagory">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem" />

      <scroll id="tab-content">
        <div>
          <tab-content-category :subcategories="showSubcategory" />
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";

import TabMenu from "./childComps/TabMenu";
import TabContentCategory from "./childComps/TabContentCategory";

import { getCategory, getSubCategory } from "network/category";

export default {
  name: "Category",
  props: {},
  data() {
    return {
      categories: [],
      categoryData: {},
      currentIndex: -1,
    };
  },
  components: {
    NavBar,
    TabMenu,
    TabContentCategory,
    Scroll,
  },
  created() {
    this._getCategory();
  },
  computed: {
    showSubcategory() {
      if (this.currentIndex === -1) return {};
      return this.categoryData[this.currentIndex].subcategories;
    },
  },
  methods: {
    _getCategory() {
      getCategory().then((res) => {
        // 获取分类数据
        this.categories = res.data.category.list;
        // 初始化每个类别的子数据
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {},
          };
        }
        // 请求第一个分类数据
        this._getSubcategories(0);
      });
    },
    _getSubcategories(index) {
      this.currentIndex = index;
      const mailkey = this.categories[index].maitKey;
      getSubCategory(mailkey).then((res) => {
        this.categoryData[index].subcategories = res.data;
        this.categoryData = { ...this.categoryData };
      });
    },
    //事件响应相关的方法
    selectItem(index) {
      this._getSubcategories(index);
    },
  },
};
</script>
<style scoped>
#category {
  height: 100vh;
}
.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 49px;

  display: flex;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
  position: relative;
  z-index: 1;
}
#tab-content {
  height: 100%;
  flex: 1;
}
</style>