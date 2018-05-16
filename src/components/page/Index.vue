<template>
    <el-container style="height:100%;">
        <el-header>
            <div id="oms_comm_header"></div>
        </el-header>
        <el-container class="content-page" style="margin-top:60px;">
            <div class="left el-aside">
                <v-sidebar></v-sidebar>
            </div>
            <el-main>
                <router-view class="content-part">
                </router-view>
                <el-footer style="padding: 0 500px 0 0;"><v-footer></v-footer></el-footer>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
</script>
<style>
    .left{
      width: 250px;
      border-right: 1px solid #ececec;
    }

    .el-header {
        padding: 0 !important;
    }
    .el-main {
      padding: 0!important;
      padding-bottom: 60px!important;
    }
    .content-part{
      padding: 20px;
    }
    .block{
      margin-bottom: 20px;
    }
    
    .el-footer {
        width: 100%;
        position: fixed;
        bottom: 0;
        color: #333;
        background: #fff;
        text-align: center;
        line-height: 60px;
        z-index: 100;
        padding: 0 500px 0 0;
    }
</style>
