// pages/historyList/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: {},
    nodata: false,
    loading: true,
    userId: 0,
    id: '',
    mode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // var that = this
    //请求历史记录列表接口
    console.log(options.mode)
    if(options.mode == 'all'){
      console.log("查询历史数据")
    app.func.postJson('weixinGetAll', { userId: wx.getStorageSync('userId') },
      (res) => {
        console.log(res.data)
        this.change(res.data)
        this.setData({
          dataInfo: res.data.roomInfo
        })
        
      })
    }
    else if(options.mode == 'creat'){
      console.log("查询我创建的会议数据")
      app.func.postJson('weixinMyCreat', { userId: wx.getStorageSync('userId') },
        (res) => {
          console.log(res.data)
          this.change(res.data)
          this.setData({
            dataInfo: res.data.roomInfo
          })
          
        })
    }
    else{
      console.log("查询我加入的会议数据")
      app.func.postJson('weixinMyAdd', { userId: wx.getStorageSync('userId') },
        (res) => {
          console.log(res.data)
          this.change(res.data)
          this.setData({
            dataInfo: res.data.roomInfo
          })
          
        })
      }

    
  },
  change: function (e) {
    console.log(e)
    if (e != null) {
      console.log(123)
      this.setData({
        nodata: false,
        loading: false
      })
    }
    else {
      this.setData({
        nodata: true,
        loading: false
      })
    }
  },
  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  }
})