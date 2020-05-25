const Router = require('koa-router');
const router = new Router;
const controller = require('../services/weixinController/weixinHistory')

router.post('/weixinGetAll', controller.postGetHistory)
router.post('/weixinMyCreat', controller.postCreatHistory)
router.post('/weixinMyAdd', controller.postAttendeeHistory)
module.exports = router