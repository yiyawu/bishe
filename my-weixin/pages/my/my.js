// pages/my/my.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: '/images/my-timg.png',
    userInfo: {},
    hasUserInfo: false,
    authFlag: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    auth: '/images/auth.png',
    conference1: '/images/comingmeeting.png',
    conference2: '/images/recentlymeeting.png',
    conference3: '/images/joinmeeting.png',
    conference4: '/images/creatmeeting.png',
    contact: '/images/contact.png',
    feedback: '/images/feedback.png',
    authName:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(this.data.hasUserInfo)
    console.log(that.data.userInfo)
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
  bindgetuserinfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    console.log(e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.login({
      success: res => {
        console.log(res.code)
        console.log(res)
        app.func.postJson('weixinAuthorize', {
          code: res.code,  
          nickName: e.detail.userInfo.nickName,
          avatarUrl: e.detail.userInfo.avatarUrl
        }, (res) => {
          console.log(res.data)
          this.setData({
            userId: res.data.userId,
          })
          wx.setStorage({
            key: "userId",
            data: res.data.userId
          })
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },

  btnAuth: function(e) {
    console.log("用户认证")
    wx.navigateTo({
      url: '/pages/authenticate/authenticate?userId=' + wx.getStorageSync('userId'),
    })
  },
  btnRecent: function (e) {
    console.log("我近期的会议")
    wx.navigateTo({
      url: '/pages/history/history?userId=' + wx.getStorageSync('userId') +'&&mode=all',
    })
  },
  btnCreateList: function (e) {
    console.log("我创建的会议")
    wx.navigateTo({
      url: '/pages/history/history?userId=' + wx.getStorageSync('userId') + '&&mode=creat',
    })
  },
  btnAttened: function (e) {
    console.log("我参加的会议")
    wx.navigateTo({
      url: '/pages/history/history?userId=' + wx.getStorageSync('userId') + '&&mode=add',
    })
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
    this.data.authFlag = wx.getStorageSync('authFlag')
    console.log(this.data.authFlag)
    if(this.data.authFlag == 1){
      this.setData({
        authName: "实验室用户"
      })
    }
    else{
      this.setData({
        authName: "游客"
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
})