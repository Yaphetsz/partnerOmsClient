<template>
    <div class="look-info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="panel-body">
            <div class="panel-heading searchDiv">
                <el-row class="page-wrap">
                    <el-date-picker
                        v-model="createdAt"
                        type="daterange"
                        :clearable=false
                        unlink-panels
                        range-separator='-'
                        :editable=false
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions2"
                        @change='dateChange'>
                    </el-date-picker>
                    <el-select
                        v-model="orgId"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="机构名称模糊查询"
                        :remote-method="orgRemoteMethod"
                        @change="orgChage"
                        :loading="loading">
                        <el-option
                            v-for="item in orgOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="partnerType" placeholder="请选择合作方类型">
                        <el-option
                            v-for="item in partnerTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" @click="search" style="margin-left:10px;">查询</el-button>
                </el-row>
            </div>
            <el-tabs type="border-card"  v-model="tabModel"  @tab-click="tabChange">
              <el-tab-pane label="车辆" name="bike">
                <div class="page-wrap">
                  <div id="echart1" :style="{width: '100%', height: '300px'}"></div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="订单"  name="order">
                <div class="page-wrap">
                  <div id="echart2" :style="{width: '100%', height: '300px'}"></div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="租金"  name="income">
                <div class="page-wrap">
                  <div id="echart3" :style="{width: '100%', height: '300px'}"></div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div class="page-wrap wrap-around content-group">
                <div class="bike-content" v-for="(item,index) in contentList" :key='index'>
                    <h2>{{item.num}}</h2>
                    <p>{{item.content}}</p>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import echarts from 'echarts'
    export default {
        name: "",
        data() {
            return {
                partnerObj:{'1':'平台方', '2':'合作方', '3':'渠道方', '4':'居间方', '5':'渠道方秘书', '6':'运营方', '7':'运营方秘书'},
                loading :false,
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近7天',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近30天',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近90天',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                },
                createdAt: [],  // 时间
                orgId: '',    // 机构id
                tableData: [],
                orgOption: [],
                partnerTypeOptions: [],
                partnerType: '',
                tabModel: 'bike',
                contentList: [],
                currentLine: "1",
                lineOption: "",
                charts: '',
                titleName: '',
                unitName: '',
            }
        },
        methods: {
            dateChange(val){
                console.log(val);
                console.log(this.createdAt);
            },
            search() {
                let that = this;
                that.query('bike');
                that.tabModel='bike';
                that.currentLine=1;
            },
            tabChange(tab, event) {
                let that = this;
                console.log(that.tabModel);
                let type = that.tabModel;
                that.query(type);
                if(type=='bike'){
                    that.currentLine=1;
                }else if(type=='order'){
                    that.currentLine=2;
                }else if(type=='income'){
                    that.currentLine=3;
                }
            },
            orgRemoteMethod(val) {
                console.log(val)
                let that = this;
                if (val) {
                    let url = '/api/org/name/' + val;
                    that.$axios.get(url).then((res) => {
                        if (res.data.code === 200) {
                            console.log(res)
                            let arr = res.data.data;
                            that.orgOption = arr.map(function (o) {
                                return {value: o.id, label: o.name}
                            });
                        } else {
                            console.log(res.data.data)
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            },
            orgChage(val){

                // 查询该机构的所有的合作方角色类型,通过机构id
                let that = this;
                that.partnerType = '';
                if (val) {
                    let url = '/api/org/partner/' + val;
                    that.$axios.get(url).then((res) => {
                        console.log(res,"orgChage");
                        if (res.data.code === 200) {
                            let arr = res.data.data;
                            that.partnerTypeOptions = arr.map(function (o) {
                                return {value: o.partner_id+','+o.role_type, label: that.partnerObj[(o.role_type).toString()] +'-'+o.name}
                            });
                        } else {
                            console.log(res.data.data)
                            that.partnerTypeOptions=[];
                        }
                    }).catch((error) => {
                        console.log(error)
                        that.partnerTypeOptions=[];
                    })
                }
            },
            //填充生成折线图配置项
            insertOption(data,which){
                switch (which) {
                    case 'bike':
                    titleName = '车辆';
                    unitName = '次'
                    break;

                    case 'order':
                    titleName = '订单';
                    unitName = '单'
                    break;

                    case 'income':
                    titleName = '租金';
                    unitName = '元'
                    break;
                }
                let option = {
                    title:{
                        text: this.titleName
                    },
                    xAxis: {
                        type: 'category',
                        data: data.chartX,
                    },
                    yAxis: {
                        type: 'value',
                        name: this.unitName
                    },
                    series: [{
                        type:'line',
                        data:data.chartData,
                    }]
                };
                this.lineOption = option;
            },
            // 绘制折线图
            draw(id){
                let that = this;
                let option = that.lineOption;
                that.charts = echarts.init(document.getElementById(id));
                that.charts.setOption(option);
                window.onresize = function () {
                    echarts.init(document.getElementById(id)).resize();
                };
            },
            query(type){
                let that = this;
                var type = type || 'bike';
                let createAt = that.createdAt;
                let orgId = that.orgId;
                let partnerType = that.partnerType;
                console.log('createAt',createAt)
                console.log('orgId',orgId)
                console.log('partnerType',partnerType)

                if(!orgId || (createAt.length === 0) ){
                    that.$message.error('请选择时间段和机构');
                    return;
                }
                if(type === 'income'){
                    if(!partnerType){
                        that.$message.error('请选择合作方');
                        return;
                    }
                }
                let params = {createAt: createAt, orgId:orgId,partnerType:partnerType,type: type}; //默认查询车辆信息
                console.log("params::::",params);
                that.$axios.get('/api/statistics/data', {params: params}).then(function (res) {
                    console.log('res::::',res);
                    if (res.data.code === 200) {
                        if(type=='bike'){
                            that.titleName='车辆日均出租频次';
                            that.unitName='次';
                        }else if(type=='order'){
                            that.titleName='车辆订单数';
                            that.unitName='单';
                        }else if(type=='income'){
                            that.titleName='车辆租金收入';
                            that.unitName='元';
                        }
                        that.insertOption(res.data.data,'echart'+that.currentLine);
                        that.draw('echart'+that.currentLine);
                        that.contentList = res.data.data.contentList;
                        for(let i=0;i<that.contentList.length;i++){
                            if(that.contentList[i].num=="" || that.contentList[i].num==null){
                                that.contentList[i].num=0;
                            }
                        }
                    } else {
                        that.lineOption = '';
                        that.contentList = [];
                        that.$message.error(res.msg);
                    }
                }).catch((error) => {
                    console.log(`查询err: ${error}`)
                    that.lineOption = '';
                    that.contentList = [];
                    that.$message.error(error);
                })
            },
        },
        mounted () {

        }
    }
</script>
<style scoped>
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
    .search-input{
        margin-left: 10px;
    }
    .look-info .el-input{
        width: 200px;
    }
    .look-info .el-select{
        margin-left: 10px;
    }
    .content-group{
        margin-top: 20px;
    }
    .bike-content{
        text-align: center;
        padding: 10px 20px;
    }
    .bike-content:last-child{
        border-right: none;
        padding-right: 20px;
    }
    .el-tabs__item{
        width: 100px!important;
    }
    #echart1 div{
        width: 100%;
    }
    canvas{
        width: 100%;
    }
</style>
