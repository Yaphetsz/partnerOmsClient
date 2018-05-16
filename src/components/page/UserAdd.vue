<template>
    <div class="personal-info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>用户</el-breadcrumb-item>
                <el-breadcrumb-item>{{pageStatus==='edit'?'编辑':'添加'}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="panel-body page-wrap">
            <el-form ref="form" status-icon :model="form" :rules="rules" label-width="130px" class="demo-ruleForm">
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="form.name" placeholder="请填写姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="请填写手机号，用手机号登录"></el-input>
                </el-form-item>
                <el-form-item label="归属合作方：" prop="partnerArr" >
                    <el-select
                        v-model="form.partnerArr"
                        multiple
                        filterable
                        remote
                        reserve-keyword
                        placeholder="输入合作方模糊查询"
                        :remote-method="partnerRemoteMethod"
                        :loading="loading">
                        <el-option
                            v-for="item in partnerOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item style="text-align:center;margin-left: -100px;">
                    <el-button type="primary" @click="save('form')">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        name: "",
        data() {
            var checkMobile = (rule, value, callback) => {
                let that = this;
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                }
                let mobile = value.toString();
                mobile = mobile.replace(/\s/g, '');
                if (mobile.length !== 11) {
                    return callback(new Error('手机号不是11位'));
                }
                let params = {mobile:mobile,pageStatus:that.pageStatus,id:that.form.id}
                that.$axios.get('/api/user/checkMobile',{params}).then(function (res) {
                    if (res.status === 200 && res.data.code === 200) {
                        return callback()
                    } else {
                        return callback(new Error(res.data.msg));
                    }
                }).catch((err)=>{
                    that.form.mobile = '';
                    return callback(err);
                })
            };
            var checkName = (rule, value, callback) => {
                let that = this;
                if (!value) {
                    return callback(new Error('不能为空'));
                }
                let name = value.toString();
                name = name.replace(/\s/g, '');
                if (!name) {
                    return callback(new Error('不能为空'));
                }
                let params = {name:name,pageStatus:that.pageStatus,id:that.form.id}
                that.$axios.get('/api/user/checkName',{params}).then(function (res) {
                    if (res.status === 200 && res.data.code === 200) {
                        return callback()
                    } else {
                        return callback(new Error(res.data.msg));
                    }
                }).catch((err)=>{
                    return callback(err);
                })
            };
            return {
                pageStatus: 'add', // 页面默认添加 add ,edit
                loading: false,
                form: {
                    id: '',
                    name: '',
                    mobile: '',
                    partnerArr: ''
                },
                partnerOptions: [],
                rules: {
                    name: [
                        { validator: checkName, required: true,  trigger: 'blur'}
                    ],
                    mobile: [
                        { validator: checkMobile, required: true,  trigger: 'blur'}
                    ],
                    partnerArr: [
                        {required: true, message: '请选择归属合作方', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            save(formName) {
                let that = this;
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = {
                            id: that.form.id,
                            name: that.form.name,
                            mobile: that.form.mobile,
                            partnerArr: that.form.partnerArr
                        };
                        let url = '/api/user/add';
                        if (that.pageStatus === 'edit') {
                            url = '/api/user/edit';
                        }
                        that.$axios.post(url, params).then((res) => {
                            if(res.data.code === 200){
                                that.$message({type: 'success', message: '保存成功'});
                                that.$router.push({name: 'UserList'}) // 跳转列表页
                            }else{
                                that.$message({type: 'error', message: res.data.msg});
                            }
                        }).catch((error) => {
                            console.log(error)
                            that.$message({type: 'error', message: error});
                        })
                    }
                });
            },
            partnerRemoteMethod(val) {
                console.log(val)
                console.log('this.form.partnerArr')
                console.log(this.form.partnerArr)
                let that = this;
                if (val) {
                    that.loading = true;
                    let url = '/api/partner/name/' + val.trim();
                    that.$axios.get(url).then((res) => {
                        that.loading = false;
                        if (res.data.code === 200) {
                            console.log(res.data.data)
                            let arr = res.data.data;
                            that.partnerOptions = arr.map(function (o) {
                                return {value: o.id, label: o.name}
                            })
                        } else {
                            console.log(res.data)
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            },
        },
        beforeMount () {
            let that = this
            that.pageStatus = that.$route.params.pageStatus || 'add'; // 刷新默认 添加页面
            that.form.id = that.$route.params.id || '';
            if (that.pageStatus === 'edit') {
                that.$axios.get('/api/user/id/' + that.form.id).then(function (res) {
                    if (res.status === 200 && res.data.code === 200) {
                        console.log(res.data.data);
                        that.partnerOptions = res.data.data.partner;
                        that.form.name = res.data.data.name;
                        that.form.mobile = res.data.data.mobile;
                        that.form.partnerArr = res.data.data.partner.map(function (item) {
                            return item.value;
                        });
                        console.log('that.form.partnerArr:'+that.form.partnerArr)
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .el-form {
        margin-left: 20px;
    }

    .el-select {
        width: 317px;
    }

    .el-input {
        width: 317px;
    }

    .el-button {
        width: 100px;
    }
</style>
