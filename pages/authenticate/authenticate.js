// pages/answer/index.js
const { $Message } = require('../../dist/base/index');
const gettime = require('../../utils/util.js')
var questionList = []
const app = getApp()
Page({
  data: {
    loading: false, //加载中
    result: {}, //题目
    total: 0, //题目总总数
    percent: 0, //进度条百分比
    s: ['A. ', 'B. ', 'C. ', 'D. ', 'E. '],
    f: ['A. 110'],
    index: 1, //第几题
    current: '', //单选选中的答案
    currentD: [], //多选选中的答案
    type: '', //题目类型 1:单选 2:多选
    disabled: false, //单选选中不可选
    disabled1: false, //多选选中不可选
    actionVisible: false, //弹出层
    questionErr: 0,//错题个数
    questionOk: 0,// 正确个数
    percentage: 0,
    visible1: false,
    visible2: false,
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
    action2: [
      {
        name: '确定',
        color: '#2db7f5',
        loading: false,
      }
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      questionNum: options.questionNum,
    })
    //var that = this
      app.func.getJson('weixinGetQuestion', {
        // userId: wx.getStorageSync('userId'),
      }, (res) => {
        console.log(res.data)
        this.setData({
          loading: false,
          total: res.data.length,
          result: res.data,
          questionList: res.data
        })
        this.setThisData(0)
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
  //设置当前题目
  setThisData(e) {
    var length = this.data.total;
    const that = this;
    if (this.data.total == 0) {
      wx.redirectTo({
        url: '/pages/answerErr/index',
      })
      return
    }
    console.log(this.data.questionList)
    //获取正确答案
    const answer = [];
    for (var j = 0; j < this.data.questionList[e].itemsInfo.length; j++) {
      if (this.data.questionList[e].itemsInfo[j].isRight == "1") {
        answer.push(this.data.questionList[e].itemsInfo[j].title);
      }
    }
    console.log(answer);
    this.setData({
      questionInfo: this.data.questionList[e],
      answer: answer,
      type: this.data.questionList[e].questionType
    })
    console.log(this.data.questionInfo)
  },

  statistical() {
    if ((this.data.questionErr + this.data.questionOk) == this.data.result.length) {
      return
    }
    console.log(123)
    //记录选择的答案
    //判断
    if (this.data.questionInfo.questionType == 0) {
      //判断
      var currentAnswer = this.data.current;
      this.data.result[this.data.index - 1].currentAnswer = [currentAnswer];
    }
    else if (this.data.questionInfo.questionType == 1) {
      //单选
      console.log("单选")
      var currentAnswer = this.data.current;
      this.data.result[this.data.index - 1].currentAnswer = [currentAnswer];
    } else {
      //多选
      console.log("多选")
      var currentAnswer = this.data.currentD;
      this.data.result[this.data.index - 1].currentAnswer = [currentAnswer];
    }
    let questionErr = this.data.questionErr  //错题个数
    let questionOk = this.data.questionOk  //错题个数
    let questionInfo = this.data.questionInfo
    let result = this.data.result
    let index = this.data.index
    if (questionInfo.isOk === 1) {
      questionOk = questionOk + 1
      result[index - 1].judge = 1
    } else {
      questionErr = questionErr + 1
      result[index - 1].judge = 0
    }
    //计算百分比
    let percentage = questionOk / (index) * 100
    percentage = percentage.toFixed(2)

    //进度条
    let percent = this.data.index / this.data.total
    percent = (percent * 100).toFixed(2);
    percent = percent < 1 ? 1 : percent

    this.setData({
      result: result,
      questionOk: questionOk,
      questionErr: questionErr,
      percentage: percentage,
      percent: percent
    })
  },
  //单选
  handleChange({
    detail = {},
    target = {}
  }) {
    let questionInfo = this.data.questionInfo;
    //判断答案
    console.log(target)
    if (target.dataset.id.isRight == true) {
      console.log('ok')
      questionInfo.isOk = 1
    } else {
      questionInfo.isOk = 0
    }
    this.setData({
      questionInfo: questionInfo,
      current: detail.value,
    })
    console.log(this.data.questionInfo)
    console.log(this.data.current)
  },
  //多选
  handleChangeD({ detail = {}, target = {} }) {
    let questionInfo = this.data.questionInfo
    const index = this.data.currentD.indexOf(detail.value);
    index === -1 ? this.data.currentD.push(detail.value) : this.data.currentD.splice(index, 1);
    console.log(this.data.currentD)
    this.setData({
      currentD: this.data.currentD,
    });
    var answer = this.data.answer;
    var currentD = this.data.currentD;
    var rightNum = 0;
    for (var i = 0; i < currentD.length; i++) {
      var indexs = currentD[i].indexOf(" ");
      console.log(indexs)
      var indexOf = answer.indexOf(currentD[i].substring(indexs + 1));
      console.log(indexOf)
      if (indexOf >= 0) {
        rightNum += 1;
      }
    }
    console.log(answer)
    console.log(rightNum)
    console.log(currentD)
    //判断答案
    if (rightNum == answer.length) {
      questionInfo.isOk = 1
    } else {
      questionInfo.isOk = 0
    }
    this.setData({
      questionInfo: questionInfo
    })
  },
  //翻页
  handlePageChange({ detail }) {
    const action = detail.type;
    const r = this.data.result;
    console.log(r);
    //上下一题
    if (action === 'next') {
      const i = this.data.index;
      const type = this.data.type;
      if (i == r.length) {
        this.statistical()
        $Message({
          content: '题目已答完,请交卷',
          duration: 3,
          type: 'warning'
        });
        return;
      }
      if (r[i].type == 1) {
        if (r[i].currentAnswer) {
          var currentAnswer = r[i].currentAnswer[0];
        }
      } else {
        if (r[i].currentAnswer) {
          var currentAnswer = r[i].currentAnswer[0];
        }
      }
      //单选
      if (this.data.questionInfo.questionType == '1') {
        const current = this.data.current;
        if (current == "") {
          wx.showToast({
            title: '请选择答案',
            duration: 1500,
            image: '/images/warning.png'
          })
          return;
        }
      } else {
        const length = this.data.currentD;
        if (length == null) {
          wx.showToast({
            title: '请选择答案',
            duration: 1500,
            image: '/images/warning.png'
          })
          return;
        }
      }
      if (currentAnswer == undefined && (this.data.disabled == false || this.data.disabled1 == false)) {
        this.statistical()
        console.log(22222)
      }
      this.setThisData(this.data.index);
      this.setData({
        index: this.data.index + 1,
        current: currentAnswer == undefined ? '' : currentAnswer,
        currentD: currentAnswer == undefined ? [] : currentAnswer,
        disabled: currentAnswer == undefined ? false : true,
        disabled1: currentAnswer == undefined ? false : true
      });
      console.log(this.data.disabled)
    } else if (action === 'prev') {
      var i = this.data.index - 2;
      if (r[i].questionType == '1') {
        if (r[i].currentAnswer) {
          var currentAnswer = r[i].currentAnswer[0];
        }
      } else {
        if (r[i].currentAnswer) {
          var currentAnswer = r[i].currentAnswer[0];
        }
      }
      this.setThisData(this.data.index - 2);
      this.setData({
        index: this.data.index - 1,
        current: currentAnswer,
        currentD: currentAnswer,
        disabled: true,
        disabled1: true
      });
    }
  },

  //交卷处理
  submit() {
    console.log(this.data.questionErr)
    console.log("-------------------")
    console.log(this.data.questionOk)
    console.log(this.data.result.length)
    this.setData({
      loading: true,
      visible1: false
    })
    var score = this.data.questionOk
    console.log(this.data.questionOk / this.data.result.length)
    if (this.data.questionOk / this.data.result.length >= 0.60){
      app.func.getJson('weixinAuthFlag', {
         userId: wx.getStorageSync('userId'),
      }, (res) => {
        console.log(res.data)
        wx.setStorage({
          key: "authFlag",
          data: res.data.authFlag
        })
        this.setData({
          loading: false,
          visible2: true
        })
        this.handleClick1()
      })
    }
    else {
      this.setData({
        loading: false
      })
      $Message({
        content: '对不起您的分数不够通过认证,请重来',
        duration: 3,
        type: 'warning'
      });
    }
  },
  handleSubmitOpen() {
    this.setData({
      visible1: true
    })
  },
  //交卷按钮
  checkSubmit({ detail }) {
    //取消
    console.log(detail)
    if (detail.index === 0) {
      this.setData({
        visible1: false
      });
    } else {
      //交卷
      this.submit();
    }
  },
  //认证完成退回到tabbar
  handleClick1(e) {
    console.log(e)
    if(e != null){
      console.log(e.detail)
      this.setData({
        visible2: false,
      });
      wx.navigateTo({
        url: '/pages/changename/changename?userId=' + wx.getStorageSync('userId'),
      })
    }

  },
  //弹出统计下拉层
  handleOpen() {
    this.setData({
      actionVisible: true
    })
  },
  //关闭统计下拉层
  actionCancel() {
    this.setData({
      actionVisible: false
    })
  },
  //后退返回
  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },
})