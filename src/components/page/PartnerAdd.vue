<template>
    <div class="personal-info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>合作方</el-breadcrumb-item>
                <el-breadcrumb-item>{{pageStatus==='edit'?'编辑':'添加'}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="panel-body page-wrap">
            <el-form ref="form" status-icon :model="form" :rules="rules" label-width="130px" class="demo-ruleForm">
                <el-form-item label="合作方：" prop="name">
                    <el-input v-model="form.name" placeholder="请填写合作方"></el-input>
                </el-form-item>

                <el-form-item label="选择类型：" prop="partner_type">
                    <el-select v-model="form.partner_type" placeholder="请选择类型">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父合作方：" prop="parent_id">
                    <el-select
                        v-model="form.parent_id"
                        filterable
                        remote
                        clearable
                        reserve-keyword
                        placeholder="输入名称模糊查询"
                        :remote-method="parentRemoteMethod"
                        :loading="loading">
                        <el-option
                            v-for="item in parentOption"
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
            return {
                pageStatus: 'add', // 页面默认添加 add ,edit
                loading: false,
                form: {
                    id: '',
                    name: '',
                    partner_type: '',
                    parent_id:''
                },
                typeOptions: [{
                    value: 2,
                    label: '公司'
                }, {
                    value: 1,
                    label: '个人'
                }],
                parentOption: [],
                rules: {
                    name: [
                        {required: true, message: '请填写名称', trigger: 'blur,change'}
                    ],
                    partner_type: [
                        {required: true, message: '请选择类型', trigger: 'blur,change'}
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
                            partner_type: that.form.partner_type,
                            parent_id: that.form.parent_id
                        };
                        let url = '/api/partner/add';
                        if (that.pageStatus === 'edit') {
                            url = '/api/partner/edit';
                        }
                        that.$axios.post(url, params).then((res) => {
                            if(res.data.code === 200){
                                that.$message({type: 'success', message: '保存成功'});
                                that.$router.push({name: 'PartnerList'}) // 跳转列表页
                            }else{
                                that.$message({type: 'error', message: res.data.msg || "合作方名称过长！"});
                            }
                        }).catch((error) => {
                            console.log(error)
                            that.$message({type: 'error', message: error});
                        })
                    }
                });
            },
            parentRemoteMethod (val) {
                let that = this;
                if (val) {
                    let url = '/api/partner/name/' + val.trim();
                    that.$axios.get(url).then((res) => {
                        if (res.data.code === 200) {
                            console.log(res.data.data)
                            let arr = res.data.data;
                            that.parentOption = arr.map(function (o) {
                                return {value: o.id, label: o.name}
                            })
                        } else {
                            console.log(res.data)
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            }
        },
        beforeMount () {
            let that = this
            that.pageStatus = that.$route.params.pageStatus;
            that.id = that.$route.params.id || '';
            if (that.pageStatus === 'edit') {
                that.$axios.get('/api/partner/id/' + that.id).then(function (res) {
                    if (res.status === 200 && res.data.code === 200) {
                        that.form = res.data.data
                        that.parentOption = [{value: res.data.data.parent_id, label: res.data.data.fatherName}]
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
