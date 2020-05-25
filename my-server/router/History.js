const Router = require('koa-router');
const router = new Router;
const controller = require('../services/webController/webHistory')

router.get('/getMeeting', controller.getHistory)
router.post('/searchMeeting', controller.postHistory)
router.post('/deleteMeeting', controller.postDelete)
module.exports = router