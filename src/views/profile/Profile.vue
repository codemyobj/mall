<template>
  <div id="profile">
    <nav-bar class="nav-bar">
      <div slot="center">我的商城</div>
    </nav-bar>

    <user-info />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import UserInfo from "./childComps/UserInfo";

export default {
  name: "Profile",
  components: {
    NavBar,
    UserInfo,
  },
};
</script>

<style scoped>
#profile {
  background-color: #f2f2f2;
}
.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}
</style>
