<template>
  <div id="user-info">
    <a href="#" class="user-info_wrap">
      <div class="left">
        <div class="left-img">
          <img src="@/assets/img/profile/avatar.svg" alt />
        </div>
        <div class="left-text">
          <span>登录/注册</span>
          <span class="shouji">
            <img src="~@/assets/img/profile/sj.png" alt />
            <div>暂无绑定手机号</div>
          </span>
        </div>
      </div>
      <div class="right">
        <img src="~@/assets/img/profile/yjt.png" alt="">
      </div>
    </a>
  </div>
</template>

<script>
  ''
  export default {
    name: "UserInfo",
  };
</script>

<style scoped>
  #user-info {
    height: 90px;
    background-color: var(--color-tint);
  }

  .user-info_wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }

  .left {
    display: flex;
    align-items: center;
  }

  .left-img img {
    width: 80px;
  }

  .left-text {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    border-radius: 50%;
    color: #fff;
    font-size: 20px;
  }

  .left-text span:nth-child(2) {
    font-size: 14px;
    margin-top: 5px;
  }

  .shouji {
    display: flex;
    align-items: flex-start;
  }

  .shouji img {
    width: 25px;
    color: #fff;
  }

  .right {
    color: #fff;
  }

  .right img {
    width: 20px;
  }
</style>