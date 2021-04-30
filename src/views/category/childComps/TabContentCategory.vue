<template>
  <div>
    <scroll class="content">
      <div v-if="subcategories.list" class="list">
        <div class="item" v-for="(item,index) in subcategories.list" :key="index">
          <a :href="item.link">
            <img class="item-img" :src="item.image" alt />
            <div class="item-text">{{item.title}}</div>
          </a>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "components/common/scroll/Scroll";

export default {
  name: "TabContentCategory",
  props: {
    subcategories: {
      type: Object,
      default() {
        return [];
      },
    },
  },
  components: {
    Scroll,
  },
};
</script>
<style scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.item {
  flex: 1;
  text-align: center;
  font-size: 12px;
}
.item-img {
  width: 70px;
}
.item-text {
  margin: 15px 0;
}
.content {
  height: 100%;
  padding: 10px;
}
</style>