const userModel = require('../../mysql/index.js');
const checkToken = require('../../middlewares/check.js').checkToken
const koa2Req = require('koa2-request');

async function getRealName(attdenayy){
  // console.log(typeof(attdenayy))
   let truearr = []
   if(typeof(attdenayy) == typeof(Object)){

    for(let i in attdenayy){
        let userId = Number(attdenayy[i])
        //console.log("真实名字"+searchTrueName(userId))
       await searchTrueName(userId).then(result =>{
            truearr[i] =  result
       })
    }
   // console.log("结果"+truearr)
   }
   else {
       await searchTrueName(attdenayy).then(result =>{
            truearr =  result
       })
   }
   return truearr
}
async function searchTrueName(userId){
    let c 
    await userModel.getTrueName(userId).then(result =>{
        for(let a in result){
            c = result[a].trueName
        }    
    })
    //console.log(c)
    return c
}
exports.getHistory = async ctx => {
    let token = ctx.request.query.token;
    let res = checkToken(token);
    let ss 
    let roomInfo 
    if (res = typeof(1)) {
        await userModel.getMeeting().then(result => {
           // console.log(result)
            let d
            roomInfo = result
            for (let a in result) {//将会议模式的英文替换成中文
                let b =  result[a].template.replace(/bigsmall/g, "单人通话")
                let c = b.replace(/grid/g, "多人会议")
                d = c.replace(/float/g, "会议室模式")
                result[a].template = d
                let time = new Date(result[a].creatAt).toJSON()
                result[a].creatAt = new Date(+new Date(time) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
            }
        })
       // console.log(roomInfo)
        for (let i in roomInfo ){
            ss = roomInfo[i].attendeeArray.split(",");
            await  getRealName(ss).then(result =>{ //将参会人员ID替换成参会人员的真实姓名
               // console.log("shuzu"+result)
                roomInfo[i].attendeeArray = result
            })
            let a = roomInfo[i].userId;
            await  getRealName(a).then(result =>{ //将发起人ID替换成发起人的真实姓名
               // console.log("发起人"+result)
                roomInfo[i].userId = result
            })

        }
        
        ctx.body = {
            roomInfo: roomInfo,
            code: 200,
            mes: "信息查询成功"
        }
        
    }
    else {
        ctx.body = {
            code: 500,
            mes: "token验证错误"
        }
    }
}
exports.postHistory = async ctx => {
    let token = ctx.request.body.token;
    let res = checkToken(token);
    let roomName = ctx.request.body.roomName
    console.log(roomName)
    console.log(ctx.request.body)
    if (res = typeof(1)) {
        await userModel.searchMeeting(roomName).then(result => {
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
exports.postDelete = async ctx => {
    console.log(ctx.request.body)
    let roomId = ctx.request.body.roomNo
    let token = ctx.request.body.token;
    let res = checkToken(token);
    if (res = typeof(1)) {
        await userModel.deleteMeetingInfo(roomId).then(result => {
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

