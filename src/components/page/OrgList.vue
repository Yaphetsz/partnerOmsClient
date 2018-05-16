<template>
    <div class="personal-info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>合伙机构</el-breadcrumb-item>
                <el-breadcrumb-item>列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="panel-body">
            <div class="panel-heading searchDiv">
                <el-row class="page-wrap">
                    <el-input v-model="name" placeholder="机构名称模糊查询"></el-input>
                    <div class="grid-content bg-purple btn-group">
                        <el-button type="primary" @click="search()">查询</el-button>
                        <router-link :to="{name: 'OrgAdd', params: {pageStatus:'add', id: ''}}">
                            <el-button type="info">添加</el-button>
                        </router-link>
                    </div>
                </el-row>
            </div>
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column label="机构名称" prop="name"></el-table-column>
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="类型" prop="type" :formatter="formatType"></el-table-column>
                <el-table-column label="添加时间" prop="ctime"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <router-link :to="{name: 'OrgAdd', params: {pageStatus:'edit', id: scope.row.id}}">
                            <el-button type="primary" size="mini">编辑</el-button>
                        </router-link>
                        <el-button type="danger" size="mini" @click="del(scope.row.id, scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="panel-footer">
            <v-page @getPageData="getTablePageData" :total-num="totalNum"></v-page>
        </div>
    </div>
</template>
<script>
    export default {
        name: "",
        data() {
            return {
                name: '',
                totalNum: 0,
                tableData: []
            }
        },
        methods: {
            getTablePageData(pagerObj) {
                let params = {
                    name: this.name,
                    currentPage: pagerObj.currentPage,
                    pageSize: pagerObj.pageSize
                }
                console.log(params)
                let that = this
                that.$axios.get('/api/org/list', {params: params}).then(function (res) {
                    if (res.status === 200 && res.data.code === 200) {
                        that.tableData = res.data.data.tableData
                        that.totalNum = res.data.data.totalNum
                    } else {
                        that.tableData = []
                        that.totalNum = 0
                    }
                }).catch((error) => {
                    console.log(`查询err: ${error}`)
                    that.tableData = []
                    that.totalNum = 0
                })
            },
            search() {
                let name = this.name && this.name.replace(/^\s+|\s+$/g, '');
                let params = {name: name};
                let that = this
                that.$axios.get('/api/org/list', {params: params}).then(function (res) {
                    if (res.status === 200 && res.data.code === 200) {
                        that.tableData = res.data.data.tableData
                        that.totalNum = res.data.data.totalNum
                    } else {
                        that.tableData = []
                        that.totalNum = 0
                    }
                }).catch((error) => {
                    console.log(`查询err: ${error}`)
                    that.tableData = []
                    that.totalNum = 0
                })
            },
            formatType(row, column, cellValue) {
                let text = '';
                let type = row.type;
                if(type === '01'){
                    text = '总部';
                }else if(type === '02'){
                    text = '自营';
                }else if(type === '03'){
                    text = '城市联营';
                }else if(type === '04'){
                    text = '景区联营';
                }else if(type === '05'){
                    text = '直营';
                }
                return text;
            },
            del (val, index) {
                let that = this
                that.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$axios.get('/api/org/del/' + val).then(function (res) {
                        if (res.status === 200 && res.data.code === 200) {
                            that.tableData.splice(index, 1);
                            that.$message({type: 'success', message: '删除成功!'})
                        } else {
                            console.log(res.data.msg);
                            that.$message({type: 'error', message: '删除失败'})
                        }
                    })
                }).catch(() => {
                    that.$message({type: 'info', message: '已取消删除'})
                })
            }
        },
        mounted () {
            let that = this
            that.$axios.get('/api/org/list').then(function (res) {
                if (res.status === 200 && res.data.code === 200) {
                    that.tableData = res.data.data.tableData
                    that.totalNum = res.data.data.totalNum
                }
            })
        }
    }
</script>
<style scoped>
    .el-input {
        width: 29.16667%!important;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 100px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .panel-footer {
        text-align: right;
    }
    .el-date-editor, .el-input, .el-select, .el-button{
        margin-bottom: 5px;
    }
</style>
