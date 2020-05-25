const Router = require('koa-router');
const router = new Router;
const controller = require('../services/webController/webQuestion.js')

router.post('/addQuestion', controller.postAddQuestion)//添加题目

router.get('/getQuestion', controller.getQuestion)//获取题目

router.post('/searchQuestion', controller.postsearchQuestion)//搜索题目
router.post('/updateQuestion', controller.postUpdateQuestion)//更新题目
router.post('/deleteQuestion', controller.postDeleteQuestion)//删除题目

module.exports = router