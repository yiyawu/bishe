const userModel = require('../../mysql/index.js');
const koa2Req = require('koa2-request');
const moment = require('moment');
const wxconfig = require("../../config/default.js");
const getuserSig = require("../../config/GenerateTestUserSig.js");
exports.getPushurl = async ctx => {
    
}
 
 
exports.getMembers = async ctx => {
     
}
exports.enterRoom = async ctx => {
    let roomId = ctx.request.body.roomId
    let userID = ctx.request.body.userID;
    let userSign = getuserSig.genTestUserSig(userID)
    await userModel.getRoomInfo(roomId).then(result =>{
        result[0].code = 200
        result[0].userSign = userSign
        ctx.body = result[0]
    })
}
exports.closeRoom = async ctx => {
    let roomId = ctx.request.body.roomId
     await userModel.CameraStyleEnd().then(result =>{
       console.log(result)
     })
     await userModel.changeRoomMembersPush(roomId).then(result =>{
        console.log(result)
         
        ctx.body = {
            code:200,
            text: "关闭房间成功"
        }
     })
}


exports.postPushurl = async ctx => {
     let userId = ctx.request.body.userId
     let roomId = ctx.request.body.roomId
     let flag = ctx.request.body.flag
     let template = ctx.request.body.template
     let myurlInfo = {}
     let members =[]
     console.log(typeof(flag))
     console.log(ctx.request.body)
     //通过userid和roomid返回个人推流和播放地址
     if(template == "float") {
        var cameraId = 0
        await userModel.searchCamera().then(result =>{
           // console.log(result)
           // console.log(typeof(JSON.parse(result[0].cameraId)))
            cameraId = result[0].cameraId
        })
        console.log(cameraId)
        await userModel.getCameraInfoById(cameraId).then(result =>{
            console.log(result)
            console.log(result[0].playUrl)
            myurlInfo.pushUrl = result[0].playUrl
            myurlInfo.cameraId = result[0].cameraId
            console.log(result[0].cameraId)
        })
        await userModel.CameraStyleBegin().then(result =>{
            console.log("开启推流模式")
            console.log(result)
        })
        //返回的membersinfo数组
        await userModel.getRoomMembers(roomId, userId).then(result =>{
            for(i in result){
                members[i] = JSON.parse(result[i].membersInfo)
                members[i].userId = result[i].userId
                console.log(i)
            }
            //console.log(members)
            //整合发送至前端
            console.log(myurlInfo)
            
        })
        await userModel.searchRoomMembers(roomId, userId).then(result =>{
            console.log(result)
            let c = JSON.parse(result[0].membersInfo)
            console.log("自己的推流地址"+ c.pushUrl)
            ctx.body = {
                myurlInfo: myurlInfo,
                members: members,
                mypushUrl: c.pushUrl
            }
        })
     }
     else{
          await userModel.searchRoomMembers(roomId, userId).then(result =>{
          //  console.log(result)
          //  console.log(JSON.parse(result[0].membersInfo))
            myurlInfo = JSON.parse(result[0].membersInfo)
            myurlInfo.userId =  Number(userId)
        })
        //返回除自己外的membersinfo数组
        await userModel.getRoomMembers(roomId, userId).then(result =>{
            for(i in result){
                members[i] = JSON.parse(result[i].membersInfo)
                members[i].userId = result[i].userId
            //   console.log(i)
            }
            console.log(members)
            //整合发送至前端
            ctx.body = {
                myurlInfo: myurlInfo,
                members: members
            }
        })
        
     }
}
 

  