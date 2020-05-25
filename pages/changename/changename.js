// pages/infoSubmit/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    sex: '',
    phone: null,
    email: null,
    picker: ['男', '女'],
    registflag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  ChangeSex(e) {
    this.setData({
      sex: this.data.picker[e.detail.value]
    })
    console.log(this.data.sex)

  },
  formSubmit: function (e) {
    console.log(e.detail.value)
    console.log(e.detail.value.name)
    console.log(this.data.sex)
    app.func.postJson('weixinUpdateInfo', {
      name: e.detail.value.name,
      sex: this.data.sex,
      phone: e.detail.value.phone,
      email: e.detail.value.email,
      userId: wx.getStorageSync('userId')
    }, (res) => {
      console.log(res)
      if (res.data.isRegist == true) {
        wx.reLaunch({
          url: '/pages/home/home'
        })
      }
    });
  }

})