<template>
    <div id="question">
        <div class="header-search">
            <el-select v-model="value" placeholder="请选择" size="small">
                <el-option
                        v-for="item in questionType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="value1" placeholder="标题搜索" style="width: 200px;" size="small"></el-input>
            <el-button size="small" @click="getQuestions">搜索</el-button>
            <el-button size="small" @click="dialogVisible = true">增加题目</el-button>
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

        <!--add question dialog-->
        <el-dialog title="增加题目" :visible.sync="dialogVisible" width="40%">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-form-item label="题目" prop="title">
                        <el-input v-model="form.questionName" size="small" type="textarea"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="题目类型" label-width="80px" prop="type">
                        <el-select v-model="form.questionType" placeholder="请选择" size="small">
                            <el-option
                                    v-for="item in questionType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="答案选项" label-width="80px" prop="checkitems">
                        <!-- 判断 -->
                        <el-checkbox-group v-if="form.questionType === '0'" v-model="form.choseList" :max="1" class="select-group">
                            <el-checkbox v-for="(item,index) in form.checkitems" :label="index" :key="item.id"  style="margin:0">
                                <el-input v-model="item.item" size="small"></el-input>
                                <el-button v-if="form.checkitems.length < 2 " type="text" @click="addOption"><i class="el-icon-circle-plus-outline"/></el-button>
                                <el-button v-if="form.checkitems.length > 1 " type="text" @click="removeOption(index)"><i class="el-icon-remove-outline"/></el-button>
                            </el-checkbox>
                        </el-checkbox-group>
                        <!-- 单选 -->
                        <el-checkbox-group v-else-if="form.questionType === '1'" v-model="form.choseList" :max="1" class="select-group">
                            <el-checkbox v-for="(item,index) in form.checkitems" :label="index" :key="item.id"  style="margin:0">
                                <el-input v-model="item.item" size="small"></el-input>
                                <el-button v-if="form.checkitems.length < 6 " type="text" @click="addOption"><i class="el-icon-circle-plus-outline"/></el-button>
                                <el-button v-if="form.checkitems.length > 1 " type="text" @click="removeOption(index)"><i class="el-icon-remove-outline"/></el-button>
                            </el-checkbox>
                        </el-checkbox-group>
                        <!--多选-->
                        <el-checkbox-group v-else-if="form.questionType === '2'" v-model="form.choseList" :max="form.checkitems.length" class="select-group">
                            <el-checkbox v-for="(item,index) in form.checkitems" :label="index" :key="index" style="margin:0">
                                <el-input v-model="item.item" size="small"></el-input>
                                <el-button v-if="form.checkitems.length < 6 " type="text" @click="addOption"><i class="el-icon-circle-plus-outline"/></el-button>
                                <el-button v-if="form.checkitems.length > 1 " type="text" @click="removeOption(index)"><i class="el-icon-remove-outline"/></el-button>
                            </el-checkbox>
                        </el-checkbox-group>
                        <div v-else>请选择题目类型</div>
                    </el-form-item>
                </el-row>
            </el-form>
            <div style="margin-left: 80px;margin-top: 30px;">
                <el-button type="primary" @click="handleSubmit('ruleForm')">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!--edit querstion dialog-->
        <el-dialog title="修改题目" :visible.sync="editDialogVisible" width="40%">
            <el-form ref="editform" :model="form" :rules="editRule" label-width="80px">
                <el-row>
                    <el-form-item label="题目" prop="title">
                        <el-input v-model="form.questionName" size="small" type="textarea"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="题目类型" label-width="80px" prop="type">
                        <el-select v-model="form.questionType" placeholder="请选择" size="small">
                            <el-option
                                    v-for="item in questionType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="答案选项" label-width="80px" prop="checkitems">
                        <!-- 判断 -->
                        <el-checkbox-group v-if="form.questionType === '0'" v-model="form.choseList" :max="1" class="select-group">
                            <el-checkbox v-for="(item,index) in form.checkitems" :label="index" :key="item.id"  style="margin:0">
                                <el-input v-model="item.item" size="small"></el-input>
                                <el-button v-if="form.checkitems.length < 2 " type="text" @click="addOption"><i class="el-icon-circle-plus-outline"/></el-button>
                                <el-button v-if="form.checkitems.length > 1 " type="text" @click="removeOption(index)"><i class="el-icon-remove-outline"/></el-button>
                            </el-checkbox>
                        </el-checkbox-group>
                        <!-- 单选 -->
                        <el-checkbox-group v-else-if="form.questionType === '1'" v-model="form.choseList" :max="1" class="select-group">
                            <el-checkbox v-for="(item,index) in form.checkitems" :label="index" :key="item.id"  style="margin:0">
                                <el-input v-model="item.item" size="small"></el-input>
                                <el-button v-if="form.checkitems.length < 6 " type="text" @click="addOption"><i class="el-icon-circle-plus-outline"/></el-button>
                                <el-button v-if="form.checkitems.length > 1 " type="text" @click="removeOption(index)"><i class="el-icon-remove-outline"/></el-button>
                            </el-checkbox>
                        </el-checkbox-group>
                        <!--多选-->
                        <el-checkbox-group v-else-if="form.questionType === '2'" v-model="form.choseList" :max="form.checkitems.length" class="select-group">
                            <el-checkbox v-for="(item,index) in form.checkitems" :label="index" :key="index" style="margin:0">
                                <el-input v-model="item.item" size="small"></el-input>
                                <el-button v-if="form.checkitems.length < 6 " type="text" @click="addOption"><i class="el-icon-circle-plus-outline"/></el-button>
                                <el-button v-if="form.checkitems.length > 1 " type="text" @click="removeOption(index)"><i class="el-icon-remove-outline"/></el-button>
                            </el-checkbox>
                        </el-checkbox-group>
                        <div v-else>请选择题目类型</div>
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
    export default{
        data() {
            var validateNull = (rule,value,callback) =>{
                if(!value){
                    callback(new Error('该值不为空'))
                }else{
                    callback()
                }
            }
            var validateArr = (rule,value,callback)=>{
                var isNull = false
                for(var v of value){
                    if (v.value === '') {
                        isNull = true
                    }
                }
                if (isNull) {
                    callback(new Error('题目选项不可为空'))
                } else if (value.length <= 1) {
                    callback(new Error('题目选项不可只有1项'))
                } else if (this.form.choseList.length === 0) {
                    callback(new Error('请勾选题目正确选项'))
                } else {
                    callback()
                }
            }
            return {
                value: '',
                value1:'',
                loading:false,
                dialogVisible:false,
                editDialogVisible:false,
                file:'',
                questionType:[
                    {
                        value: '0',
                        label: '判断'
                    },
                    {
                        value: '1',
                        label: '单选'
                    },
                    {
                        value: '2',
                        label: '多选'
                    },
                ],
                pageSetting:{
                    currentPage:1,
                    total:0,
                    pageSize:5
                },
                tableSetting:{
                    tableData:[],
                    column:[
                        {
                            prop:'questionId',
                            label:'题目编号'
                        },
                        {
                            prop:'questionName',
                            label:'题目'
                        },
                        {
                            prop:'questionType',
                            label:'题目类型'
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
                    questionName:'',
                    questionType:'',
                    choseList:[],
                    checkitems:[
                        {
                            item:''
                        }
                    ]
                },
                rules:{
                    questionName:{ validator:validateNull,trigger:'change'},
                    questionType:{ validator:validateNull,trigger:'change' },
                    checkitems:{ validator: validateArr,trigger:'change'}
                },
                editRule:{
                    questionName:{ validator:validateNull,trigger:'change'},
                    questionType:{ validator:validateNull,trigger:'change' },
                }
            }
        },
        watch:{
            dialogVisible:function () {
                if(!this.dialogVisible){
                    this.$refs['ruleForm'].resetFields();
                }
            },
            editDialogVisible:function () {
                if(!this.editDialogVisible) {
                    this.form.questionName=''
                    this.form.questionType=''
                    if (this.$refs['ruleForm']) {
                        this.$refs['ruleForm'].resetFields();
                    }
                }
            }
        },
        mounted(){
            this.getQuestions()
        },
        methods: {
            getQuestions(){
                let token = window.sessionStorage.getItem("token");
                if(this.value == '' && this.value1 == ''){
                this.$http.get("getQuestion",token).then(res => { 
                        console.log(res)
                        this.makePaging(res)
                })
                }
                else{
                    var params = {
                        questionType:this.value,
                        questionName:this.value1,
                        token: token
                    }
                    console.log(params)
                    this.$http.post("searchQuestion",params).then(res => { 
                            console.log(res) 
                            if(res.status == 200) {
                                this.dialogVisible = false
                                this.makePaging(res)
                                this.$message.success('查找成功')
                            }
                    })
                }
            },
            makePaging(val) {
                this.pageSetting.total = val.data.questionInfo.length
                        for(var r of val.data.questionInfo){
                            if(r.questionType == '0') {
                                r.questionType = '判断'
                            } else if(r.questionType == '1') {
                                r.questionType = '单选'
                            }else {
                                r.questionType = '多选'
                            }
                        }
                        //利用js实现分页
                        var k = this.pageSetting.pageSize * (this.pageSetting.currentPage - 1)
                        //当前页面到第几个数结束
                        var i = this.pageSetting.pageSize * this.pageSetting.currentPage
                        //每次都new一个数组存放分页数据
                        //当前页面从第几个数开始
                        if(val.data.questionInfo.length > i){
                        let a = new Array
                        for(let j = k ;j < i; j++){
                            a.push(val.data.questionInfo[j])
                            this.loading = false
                        }
                        this.tableSetting.tableData = a
                        console.log(this.tableSetting.tableData)
                        }
                        else{
                            let b = new Array
                        for(let j = k ;j < val.data.questionInfo.length; j++){
                            b.push(val.data.questionInfo[j])
                            this.loading = false
                        }
                        this.tableSetting.tableData = b
                        console.log(this.tableSetting.tableData)
                        }
            },
            handleSizeChange(val){
                this.loading = true
                this.pageSetting.currentPage = val
                this.getQuestions()
            },
            handleCurrentChange(val){
                this.loading = true
                this.pageSetting.currentPage = val
                this.getQuestions()
            },

            handlecontrol(params){
                console.log(params)
                if(params.item.type === 'delete'){
                    this.questionDel(params.scope)
                }else if(params.item.type === 'edit'){
                    this.handleEdit(params.scope)
                }
            },
            handleChange(file, fileList){
                console.log(file)
                console.log(fileList)
                this.file = fileList[fileList.length -1 ]
            },
            addOption(){
                this.form.checkitems.push({
                    item:''
                })
            },
            removeOption(index){
                this.form.checkitems.splice(index, 1)
            },
            handleSubmit(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        //保存题目
                        console.log(this.returnParams())
                        this.loading = true
                        var params = this.returnParams()
                        let token = window.sessionStorage.getItem("token");
                        params.token = token   
                        console.log(params)             
                        //post请求localhost:3000/addQuestion的api接口
                        this.$http.post("addQuestion",params).then(res => { 
                        console.log(res) 
                        if(res.data.code == 200) {
                            this.dialogVisible = false
                            this.getQuestions()
                            this.$message.success('新增成功')
                        }
                        })
                    }
                })
            },
            handleEditSubmit(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        //修改题目
                        console.log(this.returnParams())
                        this.loading = true
                        var params = this.returnParams()
                        let token = window.sessionStorage.getItem("token");
                        params.token = token 
                        params.questionId = this.form.questionId  
                        console.log(params)  
                        //post请求localhost:3000/updateQuestion的api接口
                        this.$http.post("updateQuestion",params).then(res => { 
                        console.log(res) 
                        if(res.data.code == 200) {
                            this.editDialogVisible = false
                            this.getQuestions()
                            this.$message.success('修改成功')
                        }
                        });
                    }
                })
            },
            questionDel(scope){
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
                    this.$http.post("deleteQuestion",params).then(res => { 
                        console.log(res) 
                        if(res.data.code == 200){
                            this.getQuestions()
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
                this.form.questionId = scope.row.questionId
                this.form.questionName = scope.row.questionName
                this.form.questionType = scope.row.questionType
                console.log(this.form)
            },
            returnParams(){
                console.log(this.form.checkitems)
                console.log(this.form.choseList)
                var itemArr = []
                for(var c of this.form.checkitems){
                    itemArr.push({
                        item:c.item,
                        isRight:0
                    })
                }
                 
                for(var q of this.form.choseList){
                    itemArr[q].isRight = 1
                }
                
                var params = {
                    questionName:this.form.questionName,
                    questionType:this.form.questionType,
                    choseList:itemArr,
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