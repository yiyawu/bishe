const Router = require('koa-router');
const router = new Router;
const controller = require('../services/weixinController/weixinGetQuestion')

router.get('/weixinGetQuestion', controller.getQuestion) //获取认证题目api
router.post('/weixinGetQuestion', controller.postQuestion)
module.exports = router