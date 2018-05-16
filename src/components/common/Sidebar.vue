<template>
    <div class="">
      <h4 class="system-title">合伙人管理</h4>
      <el-menu
            :default-active="path"
            class="el-menu-vertical-demo"
            unique-opened
            router
            height="100%"
            @open="handleOpen"
            style="border-right:none"
            >
            <template v-for="(item,index) in menus">
               <template v-if="!item.isLeaf">
                   <el-submenu :index="item.id">
                       <template slot="title">
                           {{ item.name}}
                       </template>
                       <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.url"
                                     v-if="subItem.isLeaf">
                           {{ subItem.name}}
                       </el-menu-item>
                       <el-submenu v-if="!subItem.isLeaf" v-for="(subItem,i) in item.subs" :key="i" :index="subItem.id" >
                           <template slot="title">{{ subItem.name}}</template>
                           <el-menu-item v-for="(data,n) in subItem.subs" :key="n"  :index="data.url">
                               {{data.name}}
                           </el-menu-item>
                       </el-submenu>
                   </el-submenu>
               </template>
               <template v-else>
                   <el-menu-item :index="item.url" >
                       {{ item.name}}
                   </el-menu-item>
               </template>
           </template>
        </el-menu>
    </div>

</template>

<script>
    import AuthUser from '../../api/AuthUserApi';
    export default {
        data() {
            return {
                menus: []
            }
        },
        computed: {
            path() {
                console.log(this.$route.path, "------------------");
                return this.$route.path;
                //localStorage.setItem("id",keyPath)
            },
            loca() {
                var str = localStorage.getItem("id")
                return str;
            }
        },
        mounted() {
            this.userObj = JSON.parse(localStorage.getItem('userObj'))
        },
        created() {
          let self = this;
          let authUser = new AuthUser();
          authUser.getMenus()
            .then((res)=>{
    				console.log('menus',res)
               if(res.data.code==200){
                   self.menus = res.data.data.menus;
               }
          });
        },
        methods: {
            handleOpen(key, keyPath) {
                //console.log(key,"key-----")
                localStorage.setItem("id", keyPath)
            },
        }
    }
</script>

<style>
.system-title{
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  /* text-align: center; */
}
</style>
