/**
*
* Created by fu_gh on 2018-01-19 17:36
*/

<template>
    <div class='home'>
        <div class='panel-body'>
            <div style="padding-bottom: 100px;padding-top: 100px;">
            <h3  style="padding-bottom: 10px;">当前登录用户会话已过期!</h3>
            <el-button type='primary' @click='reLogin'>重新登录</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import AuthUser from '../../lib/AuthUser';
    export default {
        data(){
            return {
            }
        },
        methods:{
            //重新登录
            reLogin() {
                console.log('relogin start input');
                window.location = AuthUser.getSSOUrl() + '/api/employee/logout?returnUrl=' + encodeURIComponent(AuthUser.getInvalidBeforeUrl());
            }
        }
    }
</script>
<style>
    .home .panel-body{
      text-align: center;
    }
    .home .panel-body h3:last-child{
      margin-top: 20px;
        padding-bottom: 200px;
        padding-top:200px;
    }
</style>
