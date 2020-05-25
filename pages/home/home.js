// pages/main/main.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canShow: 0,
    userId: '',
    tapTime: '',		// 防止两次点击操作间隔太快
    liveRoom: [
      { icon: "/images/multiroom.png", title: "新建会议", navigateTo: "../live-room/creat-room/creat-room" },
      { icon: "/images/multiroom.png", title: " 加入会议", navigateTo: "../live-room/enter-room/enter-room" },
    ],
     
    headerHeight: app.globalData.headerHeight, //
    statusBarHeight: app.globalData.statusBarHeight,
    meetingInfo: [
      { roomName: '123',
      }
      // {
      //   theme: '测试会议',
      //   place: '江夏学院会议室',
      //   time: '2020-01-21 09:00',
      //   introduction: '这是一场测试的会议',
      //   cover: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      // }
    ],
  },
  checkFlag() {
    this.setData({
        userId: wx.getStorageSync('userId')
    })
    console.log(this.data.userId)
    if (typeof (this.data.userId) == typeof (0)) {
      console.log("121233")
      //获取直播权限
      app.func.getJson('weixinGetAuthFlag', {
        userId: this.data.userId,
      }, (res) => {
        console.log(res)
        wx.setStorage({
          key: "authFlag",
          data: res.data.authFlag
        })
      });
      app.func.postJson('weixinGetAll', { userId: wx.getStorageSync('userId') },
        (res) => {
          console.log(res.data)
          this.setData({
            meetingInfo: res.data.roomInfo[0]
          })
          console.log(this.data.meetingInfo)
          console.log(this.data.meetingInfo.roomName)
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '您还未登录，请先登录',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.switchTab({
              url: '../my/my',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  onEntryTap: function (e) {
    if (this.data.canShow) {
      // if(1) {
      // 防止两次点击操作间隔太快
      var nowTime = new Date();
      if (nowTime - this.data.tapTime < 1000) {
        return;
      }
      let authFlag = wx.getStorageSync('authFlag')
      if(authFlag == 1){
        var toUrl = this.data.liveRoom[e.currentTarget.id].navigateTo;
        console.log(toUrl);
        wx.navigateTo({
          url: toUrl,
        });
      }
      else{
        wx.showModal({
          title: '提示',
          content: '您还未通过用户认证，用户认证通过后才能创建会议',
          showCancel: false,
          success: function (res) { 
            wx.navigateTo({
              url: '../authenticate/authenticate',
            })
            console.log('用户点击确定')
          }
        });
      }
      
      this.setData({ 'tapTime': nowTime });
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
        showCancel: false
      });
    }
  },
  history: function (e) {
    wx.navigateTo({
      url: '/pages/history/history?userId=' + wx.getStorageSync('userId') + '&&mode=all',
    })
  },
  mycreathistory: function (e) {
    wx.navigateTo({
      url: '/pages/history/history?userId=' + wx.getStorageSync('userId') + '&&mode=creat',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.log(4444444)
      },
      fail: function () {
        //登录态过期
        wx.login() //重新登录
        app.func.getJson('weixinLogin', {
          userId: userId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }, (res) => {
          console.log("登录态激活成功"),
            console.log(res.data)
        })
      }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady");
    if (!wx.createLivePlayerContext) {
      setTimeout(function () {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
          showCancel: false
        });
      }, 0);
    } else {
      // 版本正确，允许进入
      this.data.canShow = 1;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow");
    this.checkFlag();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide");

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload");

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("onShareAppMessage");
    return {
      title: '视频会议',
      path: '/pages/main/main',
      imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
    }
  }
})