<template>
    <div id="user">
        <div class="header-search">
            <el-input v-model="roomName" size="small" style="width: 200px;" placeholder="搜索会议名称"></el-input>
            <el-button size="small" @click="getMeetingInfo">搜索</el-button>
        </div>
        <tablelist :loading="loading" :table-setting="tableSetting" @control="handlecontrol"></tablelist>

        <div class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageSetting.currentPage"
                    :page-size="pageSetting.pageSize"
                    layout="total,prev, pager, next, jumper"
                    :total="pageSetting.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default{
        data() {
            return {
                loading:false,
                roomName:'',
                pageSetting:{
                    currentPage:1,
                    total:0,
                    pageSize:5
                },
                tableSetting:{
                    tableData:[],
                    column:[
                        {
                            prop:'roomNo',
                            label:'会议编号'
                        },
                        {
                            prop:'roomName',
                            label:'会议名称'
                        },
                        {
                            prop:'attendeeArray',
                            label:'参与人员'
                        },
                        {
                            prop:'template',
                            label:'会议模式'
                        },
                        {
                            prop:'userId',
                            label:'发起人'
                        },
                        {
                            prop:'creatAt',
                            label:'开始时间'
                        }
                    ],
                    control:[
                        {
                            type:'delete',
                            name:'删除'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.loading = true
            this.getMeetingInfo()
        },
        methods:{
            getMeetingInfo(){
                let token = window.sessionStorage.getItem("token");
                console.log(this.roomName)
                if(this.roomName == ''){
                this.$http.get("getMeeting",token).then(res => { 
                        console.log(res)
                        this.makePaging(res)
                        this.loading = false
                })
                }
                else {
                var params = {
                    roomName: this.roomName,
                    token: token
                }
                this.$http.post("getMeeting",params).then(res => { 
                        console.log(res)
                        this.makePaging(res)
                        this.loading = false
                })        
                }
            },
            makePaging(val) {
                console.log(val)
                this.pageSetting.total = val.data.roomInfo.length
                        //利用js实现分页
                        var k = this.pageSetting.pageSize * (this.pageSetting.currentPage - 1)
                        //当前页面到第几个数结束
                        var i = this.pageSetting.pageSize * this.pageSetting.currentPage
                        //每次都new一个数组存放分页数据
                        //当前页面从第几个数开始
                        if(val.data.roomInfo.length > i){
                        let a = new Array
                        for(let j = k ;j < i; j++){
                            a.push(val.data.roomInfo[j])
                            this.loading = false
                        }
                        this.tableSetting.tableData = a
                        console.log(this.tableSetting.tableData)
                        }
                        else{
                            let b = new Array
                        for(let j = k ;j < val.data.roomInfo.length; j++){
                            b.push(val.data.roomInfo[j])
                            this.loading = false
                        }
                        this.tableSetting.tableData = b
                        console.log(this.tableSetting.tableData)
                        }
            },
            handleCurrentChange(val){
                console.log(`当前页: ${val}`)
                this.pageSetting.currentPage = val
                this.loading = true
                this.getMeetingInfo()
            },
            handleSizeChange(val){
                console.log(`每页 ${val} 条`)
                this.pageSetting.currentPage = val
                this.loading = true
                this.getMeetingInfo()
            },
            handlecontrol(params){
                console.log(params)
                if(params.item.type === 'delete'){
                    this.delete(params.scope)
                }
            },
            delete(scope){
                this.$confirm('确定删除此用户','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let token = window.sessionStorage.getItem("token");
                    var params = scope.row
                    params.token = token
                    console.log(params)
                    this.$http.post("deleteMeeting",params).then(res => { 
                        console.log(res) 
                        console.log()
                        if(res.status == 200){
                            this.getMeetingInfo()
                            this.$message.success('删除成功')
                            this.loading = false
                        }
                    });
                }).catch(()=>{
                    this.loading = false
                    this.$message({
                        type:'info',
                        message: '已取消删除'
                    })
                })
            }
        }
    }
 
</script>
