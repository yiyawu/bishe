const userModel = require('../../mysql/index.js');
const checkToken = require('../../middlewares/check.js').checkToken
const koa2Req = require('koa2-request');
const moment = require('moment');
// const md5 = require('md5');
// const wxconfig = require("../../config/default.js");
exports.getCamera = async ctx => {
    console.log(ctx.request.query)
    let token = ctx.request.query.token
    let res = checkToken(token);
    if (res = typeof(1)) {
        await userModel.getCameraInfo().then(result =>{
            ctx.body = {
                cameraInfo: result
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
exports.searchCamera = async ctx => {
    console.log(ctx.request.body)
    let token = ctx.request.body.token
    let cameraName = ctx.request.body.cameraName
    let res = checkToken(token);
    if (res = typeof(1)) {
        await userModel.searchCameraInfo(cameraName).then(result =>{
            ctx.body = {
                cameraInfo: result
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
exports.addCamera = async ctx => {
    console.log(ctx.request.body)
    let cameraName = ctx.request.body.cameraName
    let cameraIP = ctx.request.body.ipaddress
    let address = ctx.request.body.cameraAddress
    let token = ctx.request.body.token
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    let res = checkToken(token);
    if (res = typeof(1)) { 
        await userModel.addCameraInfo([cameraName, cameraIP , address , time]).then(result =>{
            let cameraId = result.insertId
            //let StreamName = "room" + cameraId
            addhardware(cameraId, time)
           // genPushUrl (StreamName, cameraId)
            ctx.body = {
                code: 200,
                mes: "设备添加成功",
                cameraId: cameraId
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
exports.updateCamera = async ctx => {
    console.log(ctx.request.body)
    let cameraName = ctx.request.body.cameraName
    let cameraIP = ctx.request.body.ipaddress
    let address = ctx.request.body.cameraAddress
    let token = ctx.request.body.token
    let cameraId = ctx.request.body.cameraId
    let res = checkToken(token);
 
    if (res = typeof(1)) {
        await userModel.updateCameraInfo(cameraName, cameraIP , address , cameraId).then(result =>{

        })
    }
    else {
        ctx.body = {
            code: 500,
            mes: "token验证错误"
        }
    }
}
exports.delCamera = async ctx => {
    console.log(ctx.request.body)
    let cameraId = ctx.request.body.cameraId
    let token = ctx.request.body.token
    let res = checkToken(token);
    if (res = typeof(1)) {
        await userModel.deleteCameraInfo(cameraId).then(result =>{
            ctx.body = {
                code: 200,
                mes: "设备删除成功",
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

//为摄像头产生推流地址
// function genPushUrl (StreamName, cameraId) {
//     let Time = new Date();
//    console.log(cameraId)
//    console.log(StreamName)
//     let txTime = Time.getTime()+24*60*60*(1000)
//     var txSecret = md5(wxconfig.pushKey + StreamName + parseInt(txTime / 1000).toString(16).toUpperCase()) //参数加密满足腾讯云要求
//     var ext = '?txSecret=' + txSecret + '&txTime=' + parseInt(txTime / 1000).toString(16).toUpperCase()
//     var pushUrl = 'rtmp://' + wxconfig.pushUrl + '/live/' + StreamName + ext 
//     console.log(pushUrl)
//     var playtxSecret = md5(wxconfig.playKey + StreamName + parseInt(txTime / 1000).toString(16).toUpperCase()) //参数加密满足腾讯云要求
//     var playext = '?&txSecret=' + playtxSecret + '&txTime=' + parseInt(txTime / 1000).toString(16).toUpperCase()
//     var playUrl = 'rtmp://' + wxconfig.playUrl + '/live/' + StreamName + playext
//     userModel.addCameraPushUrl(pushUrl, playUrl, cameraId)
// }
function addhardware(cameraId, time){
    userModel.addhardware([cameraId, time]).then(result =>{
        console.log(result.insertId)
    })
}