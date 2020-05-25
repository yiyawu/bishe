const userModel = require('../../mysql/index.js');
const koa2Req = require('koa2-request');
const moment = require('moment');
const wxconfig = require("../../config/default.js");
const md5 = require('md5');
exports.getAuthorize = async ctx => {
    console.log(ctx.request.body);
    let code = ctx.request.body.code; 
    let appid = wxconfig.appid;
    let secret = wxconfig.secret;
    let nickName = ctx.request.body.nickName;
    let avatarUrl = ctx.request.body.avatarUrl;
    console.log(code);
    console.log(wxconfig.appid);
    console.log(wxconfig.secret);
    //请求微信服务器换取openid和sessionkey。
    let url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&js_code='+code+'&grant_type=authorization_code'
    let res = await koa2Req(url);
    let {session_key, openid} = JSON.parse(res.body);   
    //ctx.body = res.body;
    time = moment().format('YYYY-MM-DD,HH:mm:ss');
    console.log(session_key, openid, time);
    //生成通过MD5加密sessionkey生成sessionid
    let sessionId = md5(session_key);
    console.log(sessionId);
    //添加授权信息
    await userModel.getAuthorize([session_key, nickName, avatarUrl, openid,time, sessionId]).then(result => {
        console.log(result);
        let userId = result.insertId;
        if(userId != null){
            console.log(userId);
            ctx.body = {
                message: '授权成功',
                userId: userId,
                sessionId: sessionId,
                code:200
            }
        } else {
            ctx.body = {
                message: '授权失败',
                code: 500
            }
        }
        
    })
}
exports.getSignin = async ctx => {
    console.log(ctx.request.query);
    let userId = ctx.request.query.userId;
    let nickName = ctx.request.query.nickName;
    let avatarUrl = ctx.request.query.avatarUrl;
    console.log(ctx.request.query.nickName);
    console.log(ctx.request.query.avatarUrl);
    await userModel.addUser(userId, nickName, avatarUrl).then(result => {
        console.log(result);
        ctx.body = {
            code: 200,
            message: '登录成功',
        }
    })
}
exports.postSignin = async ctx => {
    ctx.body = {
        code: 200,
        message: '登录成功',
    }
}

exports.addAuthFlag = async ctx => {
    let userId = ctx.request.query.userId
    await userModel.addUserAuthFlag(userId).then(result =>{
        console.log(result)
        ctx.body = {
            code: 200,
            authFlag: 1,
            message: '认证成功',
        }
    })
}

exports.getAuthFlag = async ctx => {
    let userId = ctx.request.query.userId
    await userModel.getUserAuthFlag(userId).then(result =>{
        console.log(result)
        let authFlag = JSON.stringify(result)
        console.log(authFlag.substr(1,14))
        console.log(JSON.parse(authFlag.substr(1,14)))
        ctx.body = JSON.parse(authFlag.substr(1,14))
    })
}
exports.postUserInfo = async ctx => {
    let userId = ctx.request.body.userId
    let sex = ctx.request.body.sex
    let phone = Number(ctx.request.body.phone) 
    let email = ctx.request.body.email
    let trueName = ctx.request.body.name

    console.log(ctx.request.body)
    await userModel.getUserInfo([userId, trueName, phone, email, sex]).then(result =>{
         console.log(result)
         ctx.body = {
            isRegist : 1
         }
    })
}

