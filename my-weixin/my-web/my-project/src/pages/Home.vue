<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img scr="" alt="">
        <span>视频会议后台管理系统</span>
      </div>
    <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router>
          <el-menu-item index="/pages/Users">
            <i class="el-icon-location"></i>
            <span slot="title">查看用户</span>
          </el-menu-item>
          <el-menu-item index="/pages/Question">
            <i class="el-icon-setting"></i>
            <span slot="title">题目录入</span>
          </el-menu-item>
          <el-menu-item index="/pages/Camera">
            <i class="el-icon-setting"></i>
            <span slot="title">设备设置</span>
          </el-menu-item>
          <el-menu-item index="/pages/History">
            <i class="el-icon-menu"></i>
            <span slot="title">历史数据</span>
          </el-menu-item> 
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view>
        </router-view>
      </el-main>
    </el-container>
  </el-container> 
</template>

<script>
export default {
   methods: {
     logout(){
       window.sessionStorage.clear();
       this.$router.push('/login')
     }
   }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.home-container{
  height: 100%;
}
.el-header {
  background-color: #2b4b70;
  display: flex;
  justify-content:  space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  
}
.el-header .div {
  display: flex;
  align-items: center;
}
.el-header .div .span {
  margin-left: 15px;
}
.el-aside {
  background-color: #2b4b6b;
}
.el-main {
  background-color: #eaedf1;
}

</style>
