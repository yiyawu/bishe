<template>
    <div id="user">
        <div class="header-search">
            <el-input v-model="nickName" size="small" style="width: 200px;" placeholder="搜索用户昵称"></el-input>
            <el-button size="small" @click="getUserInfo">搜索</el-button>
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
                nickName:'',
                pageSetting:{
                    currentPage:1,
                    total:0,
                    pageSize:5
                },
                tableSetting:{
                    tableData:[],
                    column:[
                        {
                            prop:'userId',
                            label:'用户Id'
                        },
                        {
                            prop:'avatarUrl',
                            label:'头像',
                            type:'image'
                        },
                        {
                            prop:'nickName',
                            label:'微信昵称'
                        },
                        {
                            prop:'authFlag',
                            label:'认证状态'
                        },
                        {
                            prop:'trueName',
                            label:'真实姓名'
                        },
                        {
                            prop:'phone',
                            label:'手机号'
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
            this.getUserInfo()
        },
        methods:{
            getUserInfo(){
                let token = window.sessionStorage.getItem("token");
                if(this.nickName == ''){
                this.$http.get("searchUsers",token).then(res => { 
                        console.log(res)
                        this.makePaging(res)
                        this.loading = false
                })
                }
                else {
                var params = {
                    nickName: this.nickName,
                    token: token
                }
                this.$http.post("searchUsers",params).then(res => { 
                        console.log(res)
                        this.makePaging(res)
                        this.loading = false
                })        
                }
            },
            makePaging(val) {
                this.pageSetting.total = val.data.userInfo.length
                        //利用js实现分页
                        var k = this.pageSetting.pageSize * (this.pageSetting.currentPage - 1)
                        //当前页面到第几个数结束
                        var i = this.pageSetting.pageSize * this.pageSetting.currentPage
                        //每次都new一个数组存放分页数据
                        //当前页面从第几个数开始
                        if(val.data.userInfo.length > i){
                        let a = new Array
                        for(let j = k ;j < i; j++){
                            a.push(val.data.userInfo[j])
                            this.loading = false
                        }
                        this.tableSetting.tableData = a
                        console.log(this.tableSetting.tableData)
                        }
                        else{
                            let b = new Array
                        for(let j = k ;j < val.data.userInfo.length; j++){
                            b.push(val.data.userInfo[j])
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
                this.getUserInfo()
            },
            handleSizeChange(val){
                console.log(`每页 ${val} 条`)
                this.pageSetting.currentPage = val
                this.loading = true
                this.getUserInfo()
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
                    this.$http.post("deleteUsers",params).then(res => { 
                        console.log(res) 
                        console.log()
                        if(res.status == 200){
                            this.getUserInfo()
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
