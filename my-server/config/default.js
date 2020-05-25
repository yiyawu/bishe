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
    appid: 'wx5dd1de0c75a47e61',  
    //APP密钥
    secret: '81512d491150a43ab76044e09199780f',

    //直播配置
    //推流地址
    pushUrl: 'wcybysj.xyz',
    //推流地址的主key
    pushKey: '20829d6b37605f68f20b1d052a2f78db',
    //播放地址
    playUrl: 'wcybysj.cn',
    //播放地址的主key
    playKey: 'wcy',
    //im的API鉴权KEY
    APIKey:'20829d6b37605f68f20b1d052a2f78db',
    //im的appID
    appID: 1258544465,
  }
  
  module.exports = config
