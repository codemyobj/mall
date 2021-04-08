<template>
  <div>
    <h2>分类</h2>
    <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import { backTopMixin } from "common/mixin";

export default {
  name: "Category",
  mixins: [backTopMixin],
  // 组件创建完后调用
};
</script>

<style scoped>
</style>
