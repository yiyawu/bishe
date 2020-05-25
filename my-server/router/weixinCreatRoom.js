const Router = require('koa-router');
const router = new Router;
const controller = require('../services/weixinController/weixinCreatRoom')

router.get('/weixinCreatRoom', controller.getuserId)
router.post('/weixinCreatRoom', controller.postuserId)  //创建房间api
router.post('/weixinRoomInfo', controller.postroomInfo)  //房间信息api
router.post('/weixinUser', controller.getUser)  //房间信息api
module.exports = router