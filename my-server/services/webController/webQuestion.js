const userModel = require('../../mysql/index.js');
const checkToken = require('../../middlewares/check.js').checkToken
const moment = require('moment');
// const buildToken = require('../../middlewares/check.js').buildToken
 

function AddQuestionitems(title, isRight, questionId, time){
    //添加题目信息并返回题目id
    userModel.addQuestionItemsInfo([title, isRight, questionId, time]).then(result => {
        console.log(result);
        //let questionitemsId = result.insertId
    })
}
 
exports.postAddQuestion = async ctx => {
    //获取请求的数据
    console.log(ctx.request);
    let questionName = ctx.request.body.questionName;
    let questionType = ctx.request.body.questionType;
    let token = ctx.request.body.token;
    let items = ctx.request.body.choseList;
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    let res = checkToken(token);
    if (res = typeof(1)) {
        await userModel.addQuestionInfo([questionName, questionType, time]).then(result => {
            let questionId = result.insertId
            console.log("questionId=" +result.insertId)
            for(var i = 0; i < items.length; i++){
                AddQuestionitems(items[i].item, items[i].isRight, questionId, time)
            }
                ctx.body = {
                    code: 200,
                    mes: "题目录入成功"
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

exports.getQuestion = async ctx => {
    let token = ctx.request.query.token;
    let res = checkToken(token);
    if (res = typeof(1)) {
        await userModel.searcherQuestion().then(result => {
            console.log(result)
            ctx.body = {
                questionInfo: result
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

exports.postsearchQuestion = async ctx => {
    console.log(ctx.request.body)
    let token = ctx.request.body.token;
    let res = checkToken(token);
    let questionType = parseInt(ctx.request.body.questionType)
    let questionName = ctx.request.body.questionName
    if (res = typeof(1)) {
         if(questionType == NaN && questionName != '')
         {
            await userModel.searchQuestion1(questionName).then(result => {
            console.log(result)
                ctx.body = {
                    questionInfo: result,
                    code : "1"
                }
            })
         }
         else if (questionType != NaN && questionName == '')
         {
            await userModel.searchQuestion2(questionType).then(result => {
                console.log(result)
                ctx.body = {
                    questionInfo: result,
                    code : "2"
                }
            })
         }
         else {
            await userModel.searchQuestion3(questionType, questionName).then(result => {
                console.log(result)
                ctx.body = {
                    questionInfo: result,
                    code : "3"
                }
            })
         }
        
    }
    else {
        ctx.body = {
            code: 500,
            mes: "token验证错误"
        }
    }
}

exports.postUpdateQuestion = async ctx => {
    console.log(ctx.request.body);
    let questionName = ctx.request.body.questionName;
    let questionId = ctx.request.body.questionId;
    let questionType = ctx.request.body.questionType;
    let token = ctx.request.body.token;
    let items = ctx.request.body.choseList;
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    let res = checkToken(token);
    console.log(questionId)
    if (res = typeof(1)) {
        await userModel.deleteQuestionItems(questionId).then(result =>{
            console.log(result)
        })
        await userModel.updateQuestionInfo( questionName, questionType, questionId ).then(result => {
            console.log(result) 
            for(var i = 0; i < items.length; i++){
                AddQuestionitems(items[i].item, items[i].isRight, questionId, time)
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

exports.postDeleteQuestion = async ctx => {
    let questionId = ctx.request.body.questionId
    let token = ctx.request.body.token;
    let res = checkToken(token);
    if (res = typeof(1)) {
        await userModel.deleteQuestion(questionId).then(result => {
            console.log(result)
            ctx.body = {
                code: 200,
                mes: "题目删除成功"
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