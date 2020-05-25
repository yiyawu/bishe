<template>
    <div class="loginbox">
        <!-- 文字部分 -->
        <div>
            <p>毕业设计后台管理系统</p>
        </div>
        <!-- 头像区域 -->
        <div class= "loginimg">
           <img src="../assets/logo.png" alt="">
        </div>
        <!-- 登录表单区域 -->
        <el-form ref="loginformref" :model="loginform" :rules="loginRules" label-width="-1px" class="loginform">
            <!-- 用户名 -->
            <el-form-item prop="username" label="账号">
                <el-input v-model="loginform.username" prefix-icon="el-icon-search"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password" label="密码">
                <el-input type="password" v-model="loginform.password" prefix-icon="el-icon-search"></el-input>
            </el-form-item>
        <!-- 登录按钮区域 -->
            <el-form-item class="buttons">
              <el-button @click="onSubmit" type="primary">登录</el-button>
              <el-button @click="resetForm" type="info">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    
</template>

<script>
export default {
    data() {
        return {
            //登录表单的数据绑定对象
            loginform: {
                username: '',
                password: ''
            },
            loginRules: {
                // 验证用户名
                username: [
                    { required: true, message: "请输入登录账号", trigger:"blur"},
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码
                password: [
                    { required: true, message: "请输入登录密码", trigger:"blur"},
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        onSubmit() {
            this.$refs.loginformref.validate((valid) => {
                if (valid) {
                    //post请求localhost:3000/login的api接口
                    this.$http.post("login",this.loginform).then(res => { 
                        console.log(res) 
                        if(res.data.code !== 200) return this.$message.error("登录失败！");
                        this.$message.success("登录成功！");
                        window.sessionStorage.setItem("token", res.data.token);
                        console.log(res.data.token)
                        this.$router.push("/home");
                        });
                }   else {
                        console.log('error submit!!');
                        return false;
                    }
        });
        },
        resetForm() {
            this.$refs.loginformref.resetFields();
            console.log('error submit!!');
        }
    }
}
</script>

<style>
html,body{
    background-color: #2b4b6b;
}
.loginbox {
    background-color: white;
    color: red;
    height: 350px;
    width: 450px;
    border-radius: 3px;
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
}
.loginimg{
    height: 130px;
    width: 130px;
    background-color: #ddd;
    border: 2px solid #eee;
    border-radius: 50%;
    color: black;
    position: absolute;
    transform: translate(100%, -50%);
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
}
.loginimg img{
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #fff;
}
.loginform{
    position: absolute;
    padding: 0 20px;
    width: 100%;
    bottom: 16px;
    box-sizing: border-box;
}
.buttons{
    display: flex;
    justify-content: flex-end;
}
</style>