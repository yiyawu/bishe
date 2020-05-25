const Router = require('koa-router');
const router = new Router;
const controller = require('../services/webController/webCamera')

router.get('/getCamera', controller.getCamera) //获取设备

router.post('/searchCamera', controller.searchCamera) //查找设备
router.post('/addCamera', controller.addCamera) //添加设备
router.post('/updateCamera', controller.updateCamera) //修改设备
router.post('/deleteCamera', controller.delCamera) //删除设备

module.exports = router