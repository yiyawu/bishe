// default.js
// 设置配置文件
const config = {
    // 启动端口
    port: 1231,
    // 数据库配置
    database: {
      DATABASE: 'bishe',
      USERNAME: 'root',
      PASSWORD: '',
      PORT: '3306',
      HOST: 'localhost'
    },
    //小程序配置
    //APPID 
    appid: '',//填写自己的小程序ID  
    //APP密钥
    secret: '',//填写自己的小程序密钥

    //直播配置
    //推流地址
    pushUrl: '', //填写满足cname的推流地址
    //推流地址的主key
    pushKey: '',
    //播放地址
    playUrl: '', //填写满足cname的播放地址地址
    //播放地址的主key
    playKey: '',
    //im的API鉴权KEY
    APIKey:'', //去IM控制台那边查看IM信息
    //im的appID
    appID: xxx,//去IM控制台那边查看IM信息
  }
  
  module.exports = config
