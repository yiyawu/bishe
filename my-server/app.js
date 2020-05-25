const koa = require("koa");
const Router = require("koa-router");
const db = require("./mysql/index.js");
const jwt = require('jsonwebtoken');
const config = require("./config/default");
var session = require('koa-session-minimal');
var MysqlStore = require('koa-mysql-session');
var bodyParser = require('koa-bodyparser');
var koaStatic = require('koa-static')

//实例化koa
const app = new koa();
const router = new Router();
// session存储配置
const sessionMysqlConfig= {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))
// 配置跨域
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With')
  ctx.set('Access-Control-Allow-Origin', "*");
  ctx.set('Access-Control-Allow-Methods', "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Content-Type', "application/json;charset=utf-8");
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Max-Age', 3600 * 24);
  await next();
});

// 使用表单解析中间件
app.use(bodyParser())

//路由
app.use(require('./router/login.js').routes())
app.use(require('./router/Question.js').routes())
app.use(require('./router/Users.js').routes())
app.use(require('./router/Camera.js').routes())
app.use(require('./router/History.js').routes())
app.use(require('./router/weixinLogin.js').routes())
app.use(require('./router/weixinCreatRoom.js').routes())
app.use(require('./router/weixinLivingRoom.js').routes())
app.use(require('./router/weixinGetQuestion.js').routes())
app.use(require('./router/weixinGetAddress.js').routes())
app.use(require('./router/weixinHistory.js').routes())
router.get('/',async ctx => {
    console.log(ctx.request.body);
    ctx.body = {msg: 'hello koa interfaces'};
  });
app.use(router.routes()).use(router.allowedMethods());


console.log("233");
app.listen(config.port,() => {
    console.log(`server started on ${config.port}!`);
})