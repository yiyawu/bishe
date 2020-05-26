const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteNO: '',
    userId: '',
    role: 'audience', // 用户角色 presenter audience
    tapTime: '',
    headerHeight: app.globalData.headerHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    lc: '◀︎',
    debugMode: false,
    streamList: [],
    template:'',
    userSig:'',
    sdkAppID: '',
     
  },
  // 绑定输邀请码入框
  bindInviteNO: function (e) {
    this.setData({
      inviteNO: e.detail.value,
    })
  },
  // 进入rtcroom页面
  joinRoom: function () {
    // 防止两次点击操作间隔太快
    const nowTime = new Date()
    if (nowTime - this.data.tapTime < 1000) {
      return
    }

    if (!this.data.inviteNO) {
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    
    const reg = /^[0-9a-zA-Z]*$/
 
    if (/^\d*$/.test(this.data.inviteNO) === false) {
      wx.showToast({
        title: '只能为数字',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    app.func.postJson('weixinEnterRoom', {
      roomId: this.data.inviteNO
    }, (res) => {
      console.log(res.data)
      if(res.data.code != 200){
        wx.showToast({
          title: '邀请码输入错误',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      else {
        console.log(res.data.userSign)
        this.setData({
          template: res.data.template,
          userSig: res.data.userSign.userSig,
          sdkAppID: res.data.userSign.sdkAppID
        })
        var url = `../live-room/live-room?&roomId=${res.data.roomNo}&userId=${wx.getStorageSync("userId")}&template=${this.data.template}&sdkAppID=${this.data.sdkAppID}&userSig=${this.data.userSig}&role=${this.data.role}`;
        console.log(url)
        wx.navigateTo({
          url: url,
        })
      }
    });
    
    this.setData({ 'tapTime': nowTime })
  },
  onBack: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * @param {*} options 配置项
   */
  onLoad: function (options) {

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
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
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
