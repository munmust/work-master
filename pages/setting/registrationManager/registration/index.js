var app=getApp();
var dateTimePicker = require('dateTimePicker.js');
var utils=require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    people:'',
    linkman:'',
    phoneNumber:'',
    box:'',
    startTime: '2019-09-01 00:00:00',
    endTime:'2019-09-01 00:00:00',
    description: '',
    empty:true,
    isDisabled:false,
    errorCode:'',
    activityId:'',

// 以下涉及的数据有关于时间选择器
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2019,
    endYear: 2088

  },

  bindTextAreaChange: function (e) {
    this.setData({
      description: e.detail.value
    })
  },
  changeEndTime:  function(e) {
    console.log("结束时间"+e.detail.value);
    this.setData({
      endTime: e.detail.value,
    });
  },
  changeStartTime: function (e) {
    console.log("开始时间"+e.detail.value);
    this.setData({
      startTime: e.detail.value,
    });
  },
  inputTitle: function (e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },
  inputPeople: function (e) {
    console.log(e.detail.value)
    this.setData({
      people: e.detail.value
    })
  },
  inputLinkman: function (e) {
    console.log(e.detail.value)
    this.setData({
      linkman: e.detail.value
    })
  },
  inputPhoneNumber: function (e) {
    console.log(e.detail.value)
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  inputBox: function (e) {
    console.log(e.detail.value)
    this.setData({
      box: e.detail.value
    })
  },
  toSave:function(){
    this.setData({
      empty:false,
      isDisabled:true
    })
  },
  toChange:function(){
    this.setData({
      isDisabled: false,
      empty: true,
    })
  },

  /**
   * 弹窗按钮
   */
  popup: function () {
    var that=this;

    wx.showModal({

      title: '发布',

      content: '您确认要发布报名信息吗？',

      success: function (res) {

        if (res.confirm) {

          console.log('用户点击确定');
          that.toSubmit();


        } else if (res.cancel) {

          console.log('用户点击取消')

        }

      }

    })

  },


  toSubmit:function(){
    var that=this;
    wx.request({
      url: app.globalData.apiUrl + "/activityEntry",
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data:{
        activityId: that.data.activityId,
        title: that.data.title,
        number: that.data.people,
        linkman: that.data.linkman,
        contact: that.data.phoneNumber,
        choose: that.data.box,
        start: that.data.startTime,
        end: that.data.endTime,
        note: that.data.description,
        top:1
      },
      success:function(res){
        console.log(res.data)
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'none',
        })
        if(res.data.errorCode=="200"){
          console.log("跳转");
          that.navTo();
        }
        //that.navTo();
      },
      fail:function(res){
        console.log(res.data);
    
      }
    })

   
  },

  navTo:function(){
     var that=this;
      wx.navigateTo({
        url: '../index/index?activityId='+that.data.activityId,
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //console.log("hello");
    var time = utils.formatTime(new Date());
    console.log(options.activityId);
    that.setData({
      activityId: options.activityId,
      startTime:time,
      endTime:time
    })

    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },


  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeEndTime(e) {
    const that = this;
    console.log("打印时间~~~~~~~~~~~~~~~~~~~~~", this.data.dateTimeArray);

    this.setData({ dateTime: e.detail.value });

    console.log("打印时间", this.data.dateTime);

    var aaa1 = that.data.dateTime[0];
    var aaa2 = that.data.dateTime[1];
    var aaa3 = that.data.dateTime[2];
    var aaa4 = that.data.dateTime[3];
    var aaa5 = that.data.dateTime[4];
    var aaa6 = that.data.dateTime[5];


    var time1 = that.data.dateTimeArray[0][aaa1];
    var time2 = that.data.dateTimeArray[1][aaa2];
    var time3 = that.data.dateTimeArray[2][aaa3];
    var time4 = that.data.dateTimeArray[3][aaa4];
    var time5 = that.data.dateTimeArray[4][aaa5];
    var time6 = that.data.dateTimeArray[5][aaa6];
    var time = time1 + '-' + time2 + '-' + time3 + ' ' + time4 + ':' + time5 + ':' + time6;
    console.log("结束时间:", time);
    that.setData({
      endTime: time
    })

  },
  changeStartTime(e) {
    const that = this;
    console.log("打印时间~~~~~~~~~~~~~~~~~~~~~", this.data.dateTimeArray);

    this.setData({ dateTime: e.detail.value });

    console.log("打印时间", this.data.dateTime);

    var aaa1 = that.data.dateTime[0];
    var aaa2 = that.data.dateTime[1];
    var aaa3 = that.data.dateTime[2];
    var aaa4 = that.data.dateTime[3];
    var aaa5 = that.data.dateTime[4];
    var aaa6 = that.data.dateTime[5];


    var time1 = that.data.dateTimeArray[0][aaa1];
    var time2 = that.data.dateTimeArray[1][aaa2];
    var time3 = that.data.dateTimeArray[2][aaa3];
    var time4 = that.data.dateTimeArray[3][aaa4];
    var time5 = that.data.dateTimeArray[4][aaa5];
    var time6 = that.data.dateTimeArray[5][aaa6];
    var time = time1 + '-' + time2 + '-' + time3 + ' ' + time4 + ':' + time5 + ':' + time6;
    console.log("开始时间:", time);
    that.setData({
      startTime:time
    })

  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  }

})