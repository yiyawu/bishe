const userModel = require('../../mysql/index.js');

exports.getQuestion = async ctx => {
    var questions = [];
    let count = 0
     await userModel.searcherQuestion().then(result =>{
        questions = result;
     })
     await userModel.getQuestionItems().then(result =>{
         //利用双重循环实现数据处理
         for(var i = 0; i <questions.length; i++){
            let parma = new Array;
             for(count; count < result.length; count++){
                 //利用break跳出符合条件的循环
                if(questions[i].questionId != result[count].questionId)
                break; 
                parma.push(makeInfo( result[count]))
            }
            //处理数据
            questions[i] = {
                questionId: questions[i].questionId,
                questionType: questions[i].questionType,
                questionName: questions[i].questionName,
                creatAt: questions[i].creatAt,
                uodateAt: questions[i].uodateAt,
                itemsInfo: parma
            }
        }
        ctx.body = questions
    })
}
exports.postQuestion = async ctx => {
    //获取请求的数据
    console.log(ctx.request);
     
}

function makeInfo(result){
    var parmas
    parmas =  {
        id: result.id,
        title: result.title,
        isRight: result.isRight,
        questionId: result.questionId
    }
    return parmas
}
