const Router = require('koa-router');
const router = new Router;
const controller = require('../services/weixinController/weixinLivingRoom')

 
router.get('/weixinGetMembers', controller.getMembers) //不使用外部摄像头情况下的房间成员
router.post('/weixinGetPushurl', controller.postPushurl) //获取推流地址api
router.post('/weixinEnterRoom', controller.enterRoom) //获取推流地址api
router.post('/weixinCloseRoom', controller.closeRoom) //获取推流地址api
module.exports = router