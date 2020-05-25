const Router = require('koa-router');
const router = new Router;
const controller = require('../services/weixinController/weixinGetAddress')

router.get('/weixinGetAddress', controller.getAddress) //提交用户签到信息api

module.exports = router