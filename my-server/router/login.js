const Router = require('koa-router');
const router = new Router;
const controller = require('../services/webController/webLogin')

router.get('/login', controller.getSignin)
router.post('/login', controller.postSignin)

module.exports = router