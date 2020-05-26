<template>
    <div id="question">
        <div class="header-search">
            <el-input v-model="cameraName" placeholder="搜索设备" style="width: 200px;" size="small"></el-input>
            <el-button size="small" @click="getCameras">搜索</el-button>
            <el-button size="small" @click="dialogVisible = true">增加设备</el-button>
        </div>
        <tablelist :loading="loading" :table-setting="tableSetting" @control="handlecontrol"></tablelist>

        <!--分页-->
        <div class="pagination">
            <el-pagination :current-page="pageSetting.currentPage"
                           :page-size="pageSetting.pageSize"
                           :total="pageSetting.total"
                           layout="total, prev, pager, next, jumper"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange">

            </el-pagination>
        </div>

        <!--add machine dialog-->
        <el-dialog title="增加设备" :visible.sync="dialogVisible" width="40%">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-form-item label="设备名" prop="Name" class="name">
                        <el-input v-model="form.cameraName" size="small" type="text"></el-input>
                    </el-form-item>
                </el-row> 
                <el-row>
                    <el-form-item label="设备IP" prop="IP">
                        <ipaddress ref="ip" v-model="form.ip"></ipaddress>
                    </el-form-item>
                </el-row>
                <el-row>  
                    <el-form-item label="所属地址" prop="Address">
                        <el-input v-model="form.cameraAddress" size="small" type="textarea"></el-input>
                    </el-form-item>
                </el-row>    
            </el-form>
            <div style="margin-left: 80px;margin-top: 30px;">
                <el-button type="primary" @click="handleSubmit('ruleForm')">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!--edit machine dialog-->
        <el-dialog title="增加设备" :visible.sync="editDialogVisible" width="40%">
            <el-form ref="editform" :model="form" :rules="editRule" label-width="80px">
                <el-row>
                    <el-form-item label="设备名" prop="cameraName">
                        <el-input v-model="form.cameraName" size="small" type="text"></el-input>
                    </el-form-item>
                </el-row> 
                <el-row>
                    <el-form-item label="设备IP" prop="cameraIP">
                        <ipaddress ref="ip" v-model="form.ip"></ipaddress>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="所属地址" prop="address">
                        <el-input v-model="form.cameraAddress" size="small" type="textarea"></el-input>
                    </el-form-item>
                </el-row>    
            </el-form>
            <div style="margin-left: 80px;margin-top: 30px;">
                <el-button type="primary" @click="handleEditSubmit('editform')">确 定</el-button>
                <el-button @click="editDialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ipaddress from '@/components/IPaddressInput'
    export default{
        components: {
            ipaddress
        },
        data() {
            var validateNull = (rule,value,callback) =>{
                if(!value){
                    callback(new Error('该值不为空'))
                }else{
                    callback()
                }
            }
            return {
                cameraName:'',
                loading:false,
                dialogVisible:false,
                editDialogVisible:false,
                file:'',
                pageSetting:{
                    currentPage:1,
                    total:0,
                    pageSize:5
                },
                flag:[
                    {
                        value: '0',
                        label: '激活'
                    },
                    {
                        value: '1',
                        label: '休眠'
                    },
                ],
                tableSetting:{
                    tableData:[],
                    column:[
                        {
                            prop:'cameraId',
                            label:'设备编号'
                        },
                        {
                            prop:'cameraName',
                            label:'设备名'
                        },
                        {
                            prop:'cameraIP',
                            label:'设备IP'
                        },
                        {
                            prop:'address',
                            label:'所属地址'
                        },
                        {
                            prop:'flag',
                            label:'当前状态'
                        },
                    ],
                    control:[
                        {
                            type:'edit',
                            name:'修改'
                        },
                        {
                            type:'delete',
                            name:'删除'
                        }
                    ]
                },
                form:{
                    cameraName:null,
                    cameraAddress:null,
                    ip:null,
                },
                rules:{
                    cameraName:{ validator:validateNull,trigger:'change'},
                    cameraAddress:{ validator:validateNull,trigger:'change' },
                    ip:{ validator:validateNull,trigger:'change' },
                },
                editRule:{
                    cameraName:{ validator:validateNull,trigger:'change'},
                    ip:{ validator:validateNull,trigger:'change'},
                    cameraAddress:{ validator:validateNull,trigger:'change' },
                }
            }
        },computed:{
        },
        watch:{
            dialogVisible:function () {
                if(!this.dialogVisible){
                    this.$refs['ruleForm'].resetFields();
                }
            },
            editDialogVisible:function () {
                if(!this.editDialogVisible) {
                    this.form.cameraName=''
                    this.form.ip=''
                    this.form.cameraAddress=''
                    if (this.$refs['ruleForm']) {
                        this.$refs['ruleForm'].resetFields();
                    }
                }
            },
        },
        mounted(){
            this.loading = true
            this.getCameras()
        },
        methods: {
            getCameras(){
                let token = window.sessionStorage.getItem("token");
                if(this.cameraName == ''){
                this.$http.get("getCamera",token).then(res => { 
                        console.log(res)
                        this.makePaging(res)
                        this.loading = false
                })
                }
                else { 
                    var params = {
                        cameraName:this.cameraName,
                        token: token
                    }
                    console.log(params)
                    this.$http.post("searchCamera",params).then(res => { 
                            console.log(res) 
                            if(res.status == 200) {
                                this.dialogVisible = false
                                this.makePaging(res)
                                this.$message.success('查找成功')
                                this.loading = false
                            }
                    })
                }
                
            },
             makePaging(val) {
                this.pageSetting.total = val.data.cameraInfo.length
                        for(var r of val.data.cameraInfo){
                            if(r.flag == '0') {
                                r.flag = '休眠'
                            } else {
                                r.flag = '激活'
                            }
                        }
                        //利用js实现分页
                        var k = this.pageSetting.pageSize * (this.pageSetting.currentPage - 1)
                        //当前页面到第几个数结束
                        var i = this.pageSetting.pageSize * this.pageSetting.currentPage
                        //每次都new一个数组存放分页数据
                        //当前页面从第几个数开始
                        if(val.data.cameraInfo.length > i){
                        let a = new Array
                        for(let j = k ;j < i; j++){
                            a.push(val.data.cameraInfo[j])
                            this.loading = false
                        }
                        this.tableSetting.tableData = a
                        console.log(this.tableSetting.tableData)
                        }
                        else{
                            let b = new Array
                        for(let j = k ;j < val.data.cameraInfo.length; j++){
                            b.push(val.data.cameraInfo[j])
                            this.loading = false
                        }
                        this.tableSetting.tableData = b
                        console.log(this.tableSetting.tableData)
                        }
            },
            handleSizeChange(val){
                this.loading = true
                this.pageSetting.currentPage = val
                this.getCameras()
            },
            handleCurrentChange(val){
                this.loading = true
                this.pageSetting.currentPage = val
                this.getCameras()
            },
            handlecontrol(params){
                console.log(params)
                if(params.item.type === 'delete'){
                    this.cameraDel(params.scope)
                }else if(params.item.type === 'edit'){
                    this.handleEdit(params.scope)
                }
            },
            //保存设备
            handleSubmit(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        console.log(this.returnParams())
                        this.loading = true
                        var params = this.returnParams()
                        let token = window.sessionStorage.getItem("token");
                        params.token = token   
                        console.log(params)             
                        //post请求localhost:3000/addCamera的api接口
                        this.$http.post("addCamera",params).then(res => { 
                        console.log(res) 
                        if(res.data.code == 200) {
                            this.dialogVisible = false
                            this.getCameras()
                            this.$message.success('新增成功')
                        }
                        });
                    }
                })
            },
            //修改设备
            handleEditSubmit(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        //修改题目
                        console.log(this.returnParams())
                        this.loading = true
                        var params = this.returnParams()
                        let token = window.sessionStorage.getItem("token");
                        params.token = token 
                        params.cameraId = this.form.cameraId  
                        console.log(params)  
                        //post请求localhost:3000/updateCamera的api接口
                        this.$http.post("updateCamera",params).then(res => { 
                        console.log(res) 
                        if(res.data.code == 200) {
                            this.editDialogVisible = false
                            this.getCameras()
                            this.$message.success('修改成功')
                        }
                        });
                    }
                })
            },
            //删除设备
            cameraDel(scope){
                this.$confirm('确定删除？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    //this.loading = true
                    let token = window.sessionStorage.getItem("token");
                    var params = scope.row
                    params.token = token
                    console.log(params)
                    this.$http.post("deleteCamera",params).then(res => { 
                        console.log(res) 
                        if(res.data.code == 200){
                            this.getCameras()
                            this.$message.success('删除成功')
                        }
                    });
                }).catch(()=>{
                    this.loading = false
                    this.$message({
                        type:'info',
                        message: '已取消删除'
                    })
                })
            },
            handleEdit(scope){
                this.editDialogVisible = true
                this.form.cameraId = scope.row.cameraId
                this.form.cameraName = scope.row.cameraName
                this.form.cameraAddress = scope.row.cameraAddress
                this.form.ip = scope.row.ip
                console.log(this.form)
            },
            returnParams(){
                console.log(this.form.ip)
                console.log(this.form.cameraAddress)
                var itemArr = []
                var params = {
                    cameraName: this.form.cameraName,
                    ipaddress:this.form.ip,
                    cameraAddress:this.form.cameraAddress,
                }
                return params
            }
        }
    }
</script>

<style>
    .avatar-uploader {
        display: inline-block;
        height: 60px;
        width: 60px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .name{
        width: 48%;
        text-align: center;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
    }
    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
    .select-group {
        display: flex;
        flex-direction: column;
    }
</style>