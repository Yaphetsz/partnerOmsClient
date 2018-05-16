<template>
    <div class="personal-info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>合伙机构</el-breadcrumb-item>
                <el-breadcrumb-item>{{pageStatus==='edit'?'编辑':'添加'}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="panel-body page-wrap">
            <el-form ref="form" status-icon :model="form" :rules="rules" label-width="130px" class="demo-ruleForm">
                <el-form-item label="机构编号：" prop="id">
                    <el-input v-model="form.id" :disabled="setDisabled"  placeholder="请先确定机构编号已存在智享云中"></el-input>
                </el-form-item>
                <el-form-item label="机构名称：" prop="name">
                    <el-input v-model="form.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="机构类型：" prop="type">
                    <el-select v-model="form.type" placeholder="请选择类型">
                        <el-option
                            v-for="item in typeOptions"
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
            var checkOrgId = (rule, value, callback) => {
                let that = this;
                if(that.pageStatus === 'edit'){
                    return callback();
                }
                that.form.id = '';
                if (!value) {
                    return callback(new Error('机构编号不能为空'));
                }
                let val = value.toString();
                val = val.replace(/\s/g, '');
                if (!val) {
                    return callback(new Error('机构编号不能为空'));
                }
                that.$axios.get('/api/org/checkId/' + val).then(function (res) {
                    if (res.status === 200 && res.data.code === 200) {
                        that.form.id = res.data.data.id;
                        that.form.name = res.data.data.name;
                        return callback()
                    } else {
                        that.form.id = '';
                        that.form.name = '';
                        console.log(res.data.msg)
                        return callback(new Error(res.data.msg));
                    }
                }).catch((err)=>{
                    that.form.id = '';
                    that.form.name = '';
                    return callback(err);
                })
            };
            return {
                pageStatus: 'add', // 页面默认添加 add ,edit
                form: {
                    id: '',
                    name: '',
                    type: ''
                },
                setDisabled: false,
                typeOptions: [{
                    value: '02',
                    label: '自营'
                }, {
                    value: '03',
                    label: '城市联营'
                }, {
                    value: '04',
                    label: '景区联营'
                }, {
                    value: '05',
                    label: '直营'
                }],
                rules: {
                    id: [
                        {required: true, message: '请输入机构编号', trigger: 'blur,change'},
                        { validator: checkOrgId, trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入机构', trigger: 'blur,change'}
                    ],
                    type: [
                        {required: true, message: '请选择机构类型', trigger: 'blur,change'}
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
                            type: that.form.type
                        };
                        let url = '/api/org/add';
                        if (that.pageStatus === 'edit') {
                            url = '/api/org/edit';
                        }
                        that.$axios.post(url, params).then((res) => {
                            if(res.data.code === 200){
                                that.$message({type: 'success', message: '保存成功'});
                                that.$router.push({name: 'OrgList'}) // 跳转列表页
                            }else{
                                that.$message({type: 'error', message: res.data.msg});
                            }
                        }).catch((error) => {
                            console.log(error)
                            that.$message({type: 'error', message: error});
                        })
                    }
                });
            }
        },
        beforeMount () {
            let that = this
            that.pageStatus = that.$route.params.pageStatus;
            that.id = that.$route.params.id || '';
            if (that.pageStatus === 'edit') {
                that.setDisabled = true;
                that.$axios.get('/api/org/id/' + that.id).then(function (res) {
                    if (res.status === 200 && res.data.code === 200) {
                        that.form = res.data.data[0]
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
