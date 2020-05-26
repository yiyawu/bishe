// pages/attendance/index.js
const gettime = require('../../utils/util.js')
var qqMap = require('../../utils/qqmap-wx-jssdk.js');
var startTime = gettime.formatTime(new Date());
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '',
    latitudeInfo: 0,
    longitudeInfo: 0,
    location: '',
    nodata: false,
    dataInfo: {},
    hiddenToast: true,
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(startTime)
    console.log(location)
    var that = this;//初始化 
    var qmapSDK;
    //引用腾讯地图API
    qmapSDK = new qqMap({ key: ' ' })//去腾讯地图开发者平台上申请，使用查看key
    console.log(qmapSDK)
    //获取地址并赋值经纬度
    wx.getLocation({
      success: function (res) {
        type: 'wgs84'
        console.log(res)
        console.log()
        that.setData({
          latitudeInfo: res.latitude,
          longitudeInfo: res.longitude
        })
        qmapSDK.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (e) {
            console.log(e)
            var location = e.result.address;
            that.setData({
              location: location
            })
            if(that.data.location != ''){
              console.log("获取位置信息成功");
           //   that.attendance();
            }
          }
        })
      },
    })
  },
  //签到打卡
  attendance: function (e) { 
    let attendanceTime = gettime.formatTime(new Date());
    this.setData({
      startTime: attendanceTime
    })
    console.log(this.data.startTime)
    console.log(this.data.location)
    //请求签到接口
    app.func.getJson('weixinGetAddress', {
      userId: wx.getStorageSync('userId'),
      lat: this.data.latitudeInfo,
      lng: this.data.longitudeInfo,
      time: this.data.startTime,
      address: this.data.location}, (res) => { 
        console.log(res)
        if(res.data.code == 200){
          this.setData({
            hiddenToast: !this.data.hiddenToast,
            message: res.data.text
          })
        }
        console.log("签到成功")
      })
  },
  toastHidden: function () {
    this.setData({
      hiddenToast: true
    })
  },
})