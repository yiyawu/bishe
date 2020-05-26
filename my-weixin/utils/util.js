const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//封装接口post  from表单类型
function postForm(url, data, cb) {
  wx.showLoading({})    //加载动画  
  wx.request({
    url: 'http://192.168.1.105:1231/' + url,   //域名 （据情况而定）  url为地址
    data: data,  //所需要传的参数
    header: {
      "Content-Type": "application/x-www-form-urlencoded",   // 处理form表单的请求头
      "cache-control": "no-cache"      //处理在回调时反应慢的问题（可不写）
    },
    method: 'POST',    //方式为post
    dataType: 'json',
    responseType: 'text',
    success: function (res) {  // 请求成功后
      wx.hideLoading();  //请求成功后加载动画结束
      return typeof cb == "function" && cb(res)    // 用来判断返回的是否是函数
    },
    fail: function (res) {   //请求失败
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    },
  })
};
//封装接口post    json类型
function postJson(url, data, cb) {
  wx.showLoading({})
  wx.request({
    url: 'http://192.168.1.105:1231/' + url,
    data: data,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "cache-control": "no-cache",
      "Admin-Token": wx.getStorageSync('admintoken')
    },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res)
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    },
  })
}
//封装接口get 基本都是json类型的
function getJson(url, data, cb) {
  wx.showLoading({})
  wx.request({
    url: 'http://192.168.1.105:1231/' + url,
    data: data,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "cache-control": "no-cache"
    },
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res)
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    },
  })
}
//wx.request  get提交json
module.exports = {
  formatTime: formatTime,
  postForm: postForm,
  postJson: postJson,
  getJson: getJson,
}
