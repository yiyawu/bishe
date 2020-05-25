const Router = require('koa-router');
const router = new Router;
const controller = require('../services/webController/webUsers.js')



router.get('/searchUsers', controller.getsearchUsers)//搜索题目
router.post('/searchUsers', controller.postsearchUsers)//搜索题目
router.post('/deleteUsers', controller.postDeleteUsers)//删除题目
module.exports = router