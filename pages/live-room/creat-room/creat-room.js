// pages/live-room/creat-room/creat-room.js
const app = getApp()
var nowTime;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomName: '',//房间名
    roomNo: '',//房间号
    userID: wx.getStorageSync('userId'),//用户id
    recorder: '', //会议记录员
    attendeeArray: [], //会议参与者
    tapTime: '',//点击时间
    useCamera: 'nocamera',
    template: 'bigsmall',//类型
    userSig: '',//用户签名认证信息
    sdkAppID: '',//sdk
    role: 'presenter',
    visible2:false,
    //模拟数据
    selectMenu: "请选择会议记录人员",
    selectIndex: 0,
    // recorder: ["张三", "李四", "王五", "赵六", "请选择会议记录人员"],
    attendeeMenu: "请选择会议参与人员",
    attendeeIndex: 0,
    // attendee: [{ name: '张三', id: 1 }, { name: '李四', id: 2 }, { name: '王五', id: 3 }, { name: '赵六', id: 4 }, { name: '王思', id: 5}],
    attendee: [],
    visible1: false,
    action1: [
      {
        name: '取消'
      },
      {
        name: '确定',
        color: '#2db7f5',
        loading: false
      }
    ],
    
  },

  // 绑定输房间号入框
  bindRoomNo: function (e) {
    var self = this;
    self.setData({
      roomName: e.detail.value
    });
    console.log("房间名：" + this.data.roomName)
  },
  //选择会议模式
  radioChange: function (e) {
    this.setData({
      template: e.detail.value
    })
    console.log('this.data.template', this.data.template)
  },
  //选择是否开启摄像头
  choseCamera: function (e) {
    console.log(e)
    this.setData({
      useCamera: e.detail.value
    })
    this.onLoad()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.data.useCamera == 'nocamera') {
      this.setData({
        visible2: true,
        template: 'bigsmall'
      })
    }
    else {
      this.setData({
        visible2: false,
        template: 'float'
      })
      this.connectCamera()
    }
    console.log('this.data.template', this.data.template)
  },
  //会议记录人员选择函数
  selectRecorder: function(options) {
    console.log(options)
    this.setData({
      selectIndex: options.detail.value,
      selectMenu: this.data.recorder[options.detail.value]
    })
    console.log(this.data.selectMenu)
  },

  //会议参与人员选择函数
  selectAttendee: function (options) {
    console.log(options)
    console.log(options.detail)
    console.log(typeof(options.detail.value))
    this.setData({
      attendeeArray:options.detail.value,
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
    console.log(this.data.userID)

    app.func.postJson('weixinUser', { 
      userId: this.data.userID
    }, (res) => {
      var array1 = []
      var array2 = []
      for(let i in res.data.userInfo){
        console.log(res.data.userInfo[i].userId)
        array1.push(res.data.userInfo[i].trueName)
        if (res.data.userInfo[i].userId != this.data.userID){
          array2.push(res.data.userInfo[i])
        }
      }
      
      this.setData({
        recorder: array1,
        attendee: array2
      })
      console.log(this.data.attendee)
      console.log(this.data.recorder)
    });
  },
  addRoomInfo: function(){
    console.log(this.data)
    app.func.postJson('weixinRoomInfo', {
      userID: wx.getStorageSync('userId'),
      roomName: this.data.roomName,
      recorder: this.data.selectMenu,
      attendeeArray: this.data.attendeeArray,
      template: this.data.template
    }, (res) => {
      console.log(res)
      this.setData({
        roomNo: res.data.roomId,
        visible1: true
      })
      
    });
  },
  //连接外部摄像头请求
  connectCamera: function (){
    var self = this;
    // 防止两次点击操作间隔太快
    nowTime = new Date()
    console.log(nowTime)
    var roomNOflag = 0;
    var userSigflag = 0;
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    
  },
  // 进入rtcroom页面
  joinRoom: function () {
    var self = this;
    // 防止两次点击操作间隔太快
    nowTime = new Date()
    console.log(nowTime)
    var roomNOflag = 0;
    var userSigflag = 0;
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    if (!self.data.roomName) {
      wx.showToast({
        title: '请输入房间名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (/^\d\d+$/.test(self.data.roomName) === null) {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    //提交房间信息接口
    app.func.postJson('weixinCreatRoom',{
      userID: wx.getStorageSync('userId'),
    },(res)=>{
      this.setData({
        userSig: res.data.userSig,
        sdkAppID: res.data.sdkAppID
      })
      console.log(this.data.userSig)
      this.addRoomInfo()
    });
  },

  livingRoom: function(){
    console.log(this.data)
    wx.showToast({
      title: '进入房间',
      icon: 'success',
      duration: 1000
    })
    console.log(this.data.sdkAppID)
    var url = `../live-room/live-room?roomId=${this.data.roomNo}&template=${this.data.template}&sdkAppID=${this.data.sdkAppID}&userId=${wx.getStorageSync('userId')}&userSig=${this.data.userSig}&useCamera=${this.data.useCamera}&role=${this.data.role}`;
    console.log(url)
    this.setData({
      'tapTime': nowTime
    });
    console.log("taptime"+this.data.tapTime)
    wx.navigateTo({
      url: url
    });
  },
  checkSubmit({ detail }) {
    //取消
    console.log(detail)
    if (detail.index === 0) {
      this.setData({
        visible1: false
      });
    } else {
      //进入房间
      this.livingRoom();
    }
  },
  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})