const userModel = require('../../mysql/index.js');

exports.getAddress = async ctx => {
    // console.log(ctx.request.query)
     if(ctx.request.query.userId != null){
     await userModel.getUserAddress([ctx.request.query.userId, ctx.request.query.address, ctx.request.query.time, ctx.request.query.lat, ctx.request.query.lng]).then(result =>{
        try {
            console.log(result)
            console.log(11111)
            ctx.body = {
                code: 200,
                text: "定位成功"
            }
        } catch( error ) {
            console.log(123)
        }
    })
    }
    else{
        ctx.body = {
            code: 404,
            text: "定位失败"
        }
    }
    
}