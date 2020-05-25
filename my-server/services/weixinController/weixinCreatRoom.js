const userModel = require('../../mysql/index.js');
const koa2Req = require('koa2-request');
const moment = require('moment');
const wxconfig = require("../../config/default.js");
const getuserSig = require("../../config/GenerateTestUserSig.js");
const md5 = require('md5');
exports.getuserId = async ctx => {
    console.log(ctx.request.query);
    ctx.body = {
        code: 200,
        message: '登录成功',
    }
}
exports.getUser = async ctx => {
    console.log(ctx.request.body.userId)
    await userModel.searchWeixinUser().then(result => {
        console.log(result)
        ctx.body = {
            userInfo: result,
            code: 200,
            mes: "信息查询成功"
        }
    })
}

exports.postuserId = async ctx => {
    console.log(ctx.request.body);
    let userID = ctx.request.body.userID;
    console.log(userID);
    console.log(typeof(userID))
    let userSign = getuserSig.genTestUserSig(userID)
    console.log(userSign);
    console.log(typeof(userSign.userSig))
    ctx.body = userSign
}

exports.postroomInfo = async ctx => {
    console.log(ctx.request.body);
    let { userID, roomName, recorder, attendeeArray, template} =ctx.request.body;
    console.log(userID, roomName, recorder, template)
    console.log(attendeeArray.toString())
    let userId = userID
    let members = new Array
    let cameraId
    if(template == 'float'){
        console.log("test success")
        await userModel.getCameraInfo().then(result =>{
            cameraId = result[0].cameraId
            console.log(cameraId)
        })
        if( attendeeArray.length == 1){
            members[0] = Number(attendeeArray[0])
        }
        else{
            for(let b in attendeeArray){
                members[b] = Number(attendeeArray[b])
            }
        }
    }
    else{
        if( attendeeArray.length == 1){
            members[0] = Number(attendeeArray[0])
        }
        else{
            for(let b in attendeeArray){
                members[b] = Number(attendeeArray[b])
            }//!!!!需要修改
        }
    }
    console.log("第一次"+members)
    members.splice(0,0,userID)
    console.log("第二次"+members)
    time = moment().format('YYYY-MM-DD HH:mm:ss');
    await userModel.addRoom([userId, roomName, recorder, attendeeArray.toString(), template, time]).then(result => {
        console.log(result);
        let roomId = result.insertId
        addRoomMember(roomId, members) //房间用户信息生成
        genCameraPushUrl ("room"+roomId, cameraId)
        ctx.body = {
            code: 200,
            roomId: roomId,
            cameraId: cameraId,
            message: '会议信息录入成功',
        }
    })
}
//根据房间人数生成对应的member数量
function addRoomMember(roomId, members){
    for(let i = 0; i < members.length; i++){ 
        let memberInfo = JSON.stringify(addMembersInfo(roomId, members[i]))
        console.log(memberInfo)
        userModel.addRoomMembers([roomId, members[i], memberInfo, 0]).then(result =>{
        })     
    }
}
//整合推流地址和播放地址
function addMembersInfo(roomId, count){
    let Time = new Date();
    let txTime = Time.getTime()+24*60*60*(1000)
    let membersInfos = {
        pushUrl: genPushUrl(roomId+"user"+count,txTime),
        playUrl: genPlayURLs(roomId+"user"+count,txTime)
    }
    return membersInfos
}
//产生推流地址
function genPushUrl (StreamName, txTime) {
    var txSecret = md5(wxconfig.pushKey + StreamName + parseInt(txTime / 1000).toString(16).toUpperCase()) //参数加密满足腾讯云要求
    var ext = '?txSecret=' + txSecret + '&txTime=' + parseInt(txTime / 1000).toString(16).toUpperCase()
    var push_url = 'rtmp://' + wxconfig.pushUrl + '/live/' + StreamName + ext 
    return push_url
}
//产生播放地址
function genPlayURLs (StreamName, txTime) {
    var txSecret = md5(wxconfig.playKey + StreamName + parseInt(txTime / 1000).toString(16).toUpperCase()) //参数加密满足腾讯云要求
    var ext = '?' + '&txSecret=' + txSecret + '&txTime=' + parseInt(txTime / 1000).toString(16).toUpperCase()
    var ret = {}
    ret.urlPlayFlv = 'http://' + wxconfig.playUrl + '/live/' + StreamName + '.flv'
    ret.urlPlayRtmp = 'rtmp://' + wxconfig.playUrl + '/live/' + StreamName
    ret.urlPlayHls = 'http://' + wxconfig.playUrl + '/live/' + StreamName + '.m3u8'
    ret.urlPlayAcc = 'rtmp://' + wxconfig.playUrl + '/live/' + StreamName + ext
    return ret
}

function genCameraPushUrl (StreamName, cameraId) {
    let Time = new Date();
   console.log("摄像头"+cameraId)
   console.log(StreamName)
    let txTime = Time.getTime()+24*60*60*(1000)
    var txSecret = md5(wxconfig.pushKey + StreamName + parseInt(txTime / 1000).toString(16).toUpperCase()) //参数加密满足腾讯云要求
    var ext = '?txSecret=' + txSecret + '&txTime=' + parseInt(txTime / 1000).toString(16).toUpperCase()
    var pushUrl = 'rtmp://' + wxconfig.pushUrl + '/live/' + StreamName + ext 
    console.log(pushUrl)
    var playtxSecret = md5(wxconfig.playKey + StreamName + parseInt(txTime / 1000).toString(16).toUpperCase()) //参数加密满足腾讯云要求
    var playext = '?&txSecret=' + playtxSecret + '&txTime=' + parseInt(txTime / 1000).toString(16).toUpperCase()
    var playUrl = 'rtmp://' + wxconfig.playUrl + '/live/' + StreamName + playext
    userModel.addCameraPushUrl(pushUrl, playUrl, cameraId)
}
