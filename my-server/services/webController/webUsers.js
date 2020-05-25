const userModel = require('../../mysql/index.js');
const checkToken = require('../../middlewares/check.js').checkToken
const koa2Req = require('koa2-request');

exports.getsearchUsers = async ctx => {
    let token = ctx.request.query.token;
    let res = checkToken(token);
    if (res = typeof(1)) {
        await userModel.searchUser().then(result => {
            console.log(result)
            ctx.body = {
                userInfo: result,
                code: 200,
                mes: "信息查询成功"
            }
        })
    }
    else {
        ctx.body = {
            code: 500,
            mes: "token验证错误"
        }
    }
}
exports.postsearchUsers = async ctx => {
    let token = ctx.request.body.token;
    let res = checkToken(token);
    let nickName = ctx.request.body.nickName
    console.log(nickName)
    console.log(ctx.request.body)
    if (res = typeof(1)) {
        await userModel.searchUserByName(nickName).then(result => {
            console.log(result)
            ctx.body = {
                userInfo: result,
                code: 200,
                mes: "信息查询成功"
            }
        })
    }
    else {
        ctx.body = {
            code: 500,
            mes: "token验证错误"
        }
    }
}
exports.postDeleteUsers = async ctx => {
    console.log(ctx.request.body)
    let userId = ctx.request.body.userId
    let token = ctx.request.body.token;
    let res = checkToken(token);
    if (res = typeof(1)) {
        await userModel.deleteUser(userId).then(result => {
            console.log(result)
            ctx.body = {
                mes:"信息删除成功"
            }
        })
    }
    else {
        ctx.body = {
            code: 500,
            mes: "token验证错误"
        }
    }
}