// pages/login/login.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userId: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.hasUserInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  bindgetuserinfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.login({
      success: res => {
        console.log(res.code)
        app.func.getJson('weixinAuthorize', { code: res.code, }, (res) => {
          console.log(res.data)
          this.setData({
            userId: res.data.userId
          })
          wx.setStorage({
            key: "userId",
            data: res.data.userId
          })
          wx.setStorage({
            key: "sessionId",
            data: res.data.sessionId
          })
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
  goSign() {
    var userInfo = app.globalData.userInfo
    console.log(userInfo)
    if (this.data.userId != null) {
      console.log("121233")
      let userId = ''
      let sessionId = ''
      console.log(userInfo.nickName)
      console.log(userInfo.avatarUrl)
      userId = wx.getStorageSync('userId')
      sessionId = wx.getStorageSync('sessionId')
      app.func.getJson('weixinLogin', {
        userId: userId,
        sessionId: sessionId,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      }, (res) => {
        console.log("登录成功"),
          console.log(res.data)
      })
      //获取直播权限
      app.func.getJson('weixinGetAuthFlag', {
        userId: userId,
      }, (res) => {
        console.log(res)
        wx.setStorage({
          key: "authFlag",
          data: res.data.authFlag
        })
      });
    }
    wx.reLaunch({
      url: '/pages/home/home'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})