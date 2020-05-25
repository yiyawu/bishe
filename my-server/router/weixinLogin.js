const Router = require('koa-router');
const router = new Router;
const controller = require('../services/weixinController/weixinLogin')

router.get('/weixinLogin', controller.getSignin)
router.post('/weixinLogin', controller.postSignin)
router.post('/weixinAuthorize', controller.getAuthorize) //用户授权api
router.get('/weixinAuthFlag', controller.addAuthFlag) //获取认证用户api
router.get('/weixinGetAuthFlag', controller.getAuthFlag) //获取认证用户api
router.post('/weixinUpdateInfo', controller.postUserInfo)//认证用户信息更新
module.exports = router