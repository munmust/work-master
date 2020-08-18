var app=getApp();
var dateTimePicker = require('dateTimePicker.js');
var utils=require('../../../../utils/util.js');
var check = require('../../../../utils/checkutil.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    people:'',
    linkman:'',
    phoneNumber:'',
    choose:'',
    startTime: "",
    endTime:'2019-09-01 00:00:00',
    pikerDefaultDate:[0,0,0,0,0,0],
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

  /**
   * 选取piker的当前时间显示默认值
   */
  getpikerDefaultDate: function (timestamp){
    // var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var pikerDefaultDate = this.data.pikerDefaultDate;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    //console.log(year + ":" + month + ":" + day + ":" + hour + ":" + minute + ":" + second)
    pikerDefaultDate[0] = year - 2019;
    pikerDefaultDate[1] = month - 1;
    pikerDefaultDate[2] = day - 1;
    pikerDefaultDate[3] = hour;
    pikerDefaultDate[4] = minute ;
    pikerDefaultDate[5] = second ;
    this.setData({
      pikerDefaultDate: pikerDefaultDate
    })

  },
  bindTextAreaChange: function (e) {
    this.setData({
      description: e.detail.value
    })
  },
  changeEndTime:  function(e) {
   // console.log("结束时间"+e.detail.value);
    this.setData({
      endTime: e.detail.value,
    });
  },
  changeStartTime: function (e) {
   // console.log("开始时间"+e.detail.value);
    this.setData({
      startTime: e.detail.value,
    });
  },
  inputTitle: function (e) {
    // console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },
  inputPeople: function (e) {
    //console.log(e.detail.value)
    this.setData({
      people: e.detail.value
    })
  },
  inputLinkman: function (e) {
    //console.log(e.detail.value)
    this.setData({
      linkman: e.detail.value
    })
  },
  inputPhoneNumber: function (e) {
    //console.log(e.detail.value)
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  inputChoose: function (e) {
    //console.log(e.detail.value)
    this.setData({
      choose: e.detail.value
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
         //console.log('用户点击确定');
          that.formChecking();
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }

      }

    })

  },

  /**
   * 表单校验
   */
  formChecking:function(){
    var that=this;
    var title=that.data.title;
    var people = that.data.people;
    var linkman = that.data.linkman;
    var phoneNumber = that.data.phoneNumber;
    var note=that.data.description;
    var pass=true;
    
    if(title==''){
      pass=false;
      wx.showToast({
        title: "请输入标题",
        icon: 'none',
      })
    }
    
    if (!that.checkNInteger(people)){
      pass=false;
      wx.showToast({
        title: "人数必须大于零",
        icon: 'none',
      })
    }

    if(!check.checkC(linkman)){
      pass=false;
      wx.showToast({
        title: "请输入中文名",
        icon: 'none',
      })
    }
    
    if (!that.checkPhone(phoneNumber)){
      pass = false;
      wx.showToast({
        title: "请输入正确手机号",
        icon: 'none',
      })
    }

    if (note == '') {
      pass = false;
      wx.showToast({
        title: "说明不能为空",
        icon: 'none',
      })
    }

    
    if(pass){
      that.toSubmit();
    }          
                  
  },

  /**
   * 正整数校验
   * 
   */
  checkNInteger (value) {
    let reg = /^[1-9]\d*$/;
    return reg.test(value);
  },

  /**
   * 手机号校验
   */
  checkPhone(value){
    let reg = /^1[3456789]\d{9}$/;
    return reg.test(value);
    
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
        choose: that.data.choose,
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
    var timestamp = Date.parse(new Date());
    that.getpikerDefaultDate(timestamp);
    //console.log("hello");
    var time = utils.formatTime(new Date());
    console.log(options.activityId);
    that.setData({
      activityId: options.activityId,
      startTime:time,
      endTime:time
    })

    var nowDate=new Date();
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    console.log(obj.dateTimeArray);
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeEndTime(e) {
    
    const that = this;
    //console.log("打印时间~~~~~~~~~~~~~~~~~~~~~", this.data.dateTimeArray);
   this.setData({ dateTime: e.detail.value });
    //console.log("打印时间", this.data.dateTime);
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
    //console.log("开始时间:", time);

    time = that.getRidOfChinese(time);

    //console.log("结束时间:", time);
    that.setData({
      endTime: time
    })

  },

  changeStartTime(e) {
    const that = this;
    
    //console.log("打印时间~~~~~~~~~~~~~~~~~~~~~", this.data.dateTimeArray);

    this.setData({ dateTime: e.detail.value });

    //console.log("打印时间", this.data.dateTime);
    var aaa1 = that.data.dateTime[0];
    var aaa2 = that.data.dateTime[1];
    var aaa3 = that.data.dateTime[2];
    var aaa4 = that.data.dateTime[3];
    var aaa5 = that.data.dateTime[4];
    var aaa6 = that.data.dateTime[5];
    console.log(aaa3);
    var time1 = that.data.dateTimeArray[0][aaa1];
    var time2 = that.data.dateTimeArray[1][aaa2];
    var time3 = that.data.dateTimeArray[2][aaa3];
    var time4 = that.data.dateTimeArray[3][aaa4];
    var time5 = that.data.dateTimeArray[4][aaa5];
    var time6 = that.data.dateTimeArray[5][aaa6];
    var time = time1 + '-' + time2 + '-' + time3 + ' ' + time4 + ':' + time5 + ':' + time6;
    //console.log("开始时间:", time);
   
    time = that.getRidOfChinese(time);

    that.setData({
      startTime:time
    })
    time=time.substring(0,19);
    time = time.replace(/-/g, '/');
    var timestamp = new Date(time).getTime();
    that.getpikerDefaultDate(timestamp);

  },
  /**
   * 剔除生成时间里的中文
   */
  getRidOfChinese(time){
    time = time.split("年").join("");
    time = time.split("月").join("");
    time = time.split("日").join("");
    time = time.split("时").join("");
    time = time.split("分").join("");
    time = time.split("秒").join("");
    console.log(time);
    return time;
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    if(arr[0]==-1||arr[1]==-1){
      arr[0]=0;
      arr[1]=0;
    }
    var defaul1 = String(dateArr[0][arr[0]]);
    var defaul2 = String(dateArr[1][arr[1]]);
    dateArr[2] = dateTimePicker.getMonthDay(defaul1.substring(0, 2), defaul2.substring(0,2));

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