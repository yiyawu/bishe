const userModel = require('../../mysql/index.js');
const checkToken = require('../../middlewares/check.js').checkToken
const buildToken = require('../../middlewares/check.js').buildToken
exports.getSignin = async ctx => {
    await checkToken(ctx.token)
}
exports.postSignin = async ctx => {
    //获取请求的数据
    console.log(ctx.request);
    let { username, password }  = ctx.request.body;
    console.log(username);
    await userModel.checkLogin(username).then(result => {
        let res = result; 
        if (res.length && username === res[0]['userName'] && password === res[0]['passWord']){
            console.log(res)
            ctx.session = {
                user: res[0]['userName'],
                id: res[0]['Id']
            }
            let token = buildToken(ctx.session);
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: '登录成功',
                token: token,
            }
            console.log('Bearer  ' + token)
            console.log('ctx.session.id', ctx.session.id)
            console.log('session', ctx.body)
            console.log('登录成功')
        } else {
            ctx.body = {
                code: 500,
                message: '用户名或密码错误'
            }
            console.log('用户名或密码错误!')
          }
    })
}
