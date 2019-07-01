// pages/activity/manager/make/index.js
var util = require('../../../../utils/newutil.js');
var listArray = require('../../../../utils/listArray.js');
import {
  $wuxSelect
} from '../../../../dist/index'

var app = getApp();
Page({

  data: {
    activityName: '',
    activityType: '',
    activityStartTime: '',
    activityEndTime: '',
    activitystartDay: '2000-11-11',
    activityendDay: '2000-11-11',
    organizationMessage: '',
    description: '',
    term: ''
  },

  onLoad: function(options) {
    var roleInfo = app.globalData.roleInfo;
    var that = this;
    var typeList=[];
    var typeArray = listArray.getActivityType();
    var type;
    for (var i = 0; i < roleInfo.length; i++) {
      switch (roleInfo[i]) {
        case 'ACTIVITY_MANAGER':
          typeList=typeArray;
          type ='manage';
          break;
        case 'VOLUNTEER_ACTIVITY_MANAGER':
          typeList.push(typeArray[1]);
          type = 'volunteerActivity';
          break;
        case 'PRACTICE_ACTIVITY_MANAGER':
          typeList.push(typeArray[2]);
          type = 'practice';
          break;
      }
    }
    var now = new Date();
    // 初始化活动时间及日期
    that.setData({
      'activityStartTime': util.getHM(now),
      'activityEndTime': util.getHM(now),
      'activitystartDay': util.getYMD(now),
      'activityendDay': util.getYMD(now),
      typeList: typeList,
      type:type
    });

  },
  // 设置活动开始时间
  setStartTime: function (e) {
    var that = this;
    var hour = ((+e.detail.value.slice(0, 2) + 24 - 2) % 24).toString();
    that.setData({
      'activityStartTime': e.detail.value
    });
  },
  // 设置活动结束时间
  setEndTime: function (e) {
    var that = this;
    var hour = ((+e.detail.value.slice(0, 2) + 24 - 2) % 24).toString();
    that.setData({
      'activityEndTime': e.detail.value
    });
  },

  // 设置开始日期
  startDateChange: function (e) {
    this.setData({
      'activitystartDay': e.detail.value
    })
  },

  // 设置结束日期
  endDateChange: function (e) {
    this.setData({
      'activityendDay': e.detail.value
    })
  },

  chooseType: function() {
    var that = this;
    $wuxSelect('#select-type').open({
      value: '',
      options: that.data.typeList,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            activityType: value,
          })
        };
        switch (value) {
          case '校园活动':
            that.data.activityType = 'schoolActivity';
            break;
          case '志愿活动':
            that.data.activityType = 'volunteerActivity';
            break;
          case '实践活动':
            that.data.activityType = 'practiceActivity';
            break;
          case '讲座活动':
            that.data.activityType = 'lectureActivity';
            break;
          // case '义工活动':
          //   that.data.activityType = 'volunteerWork';
        }
      },
    })
  },

  chooseTerm: function() {
    var that = this;
    $wuxSelect('#select-type').open({
      value: '',
      options: [
        '2017-2018 第一学期',
        '2017-2018 第二学期',
        '2018-2019 第一学期',
        '2018-2019 第二学期'
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            term: value,
          })
        }
        switch (value) {
          case '2017-2018 第一学期':
            that.data.term = '2017A';
            break;
          case '2017-2018 第二学期':
            that.data.term = '2017B';
            break;
          case '2018-2019 第一学期':
            that.data.term = '2018A';
            break;
          case '2018-2019 第二学期':
            that.data.term = '2018B';
            break;
        }
      },
      
    })
  },

  input: function(e) {
    var that = this;
    var which = e.currentTarget.dataset.name;
    var value = e.detail.value;
    switch (which) {
      case 'activityName':
        that.data.activityName = value;
        break;
      case 'organizationMessage':
        that.data.organizationMessage = value;
        break;
      case 'description':
        that.data.description = value;
        break;
    }
  },

  toSubmit: function() {
    var that = this;
    if (that.data.activityName == '' || that.data.activityType == '' || that.data.term == '' || that.data.organizationMessage == '') {
      app.warning('必填信息未填写完整');
      return;
    }
    wx.showModal({
      content: '确认提交？',
      success: function(res) {
        if (!res.cancel) { //确认提交
          app.getCode(that.submit);
        }
      }
    })
  },

  // check: function() {
  //   var bool_name = this.data.activityName == '';
  //   var bool_type = this.data.activityType == '';
  //   var bool_term = this.data.act_term == '';
  //   var bool_unit = this.data.organizationMessage == '';
  //   if (bool_name || bool_type || bool_term || bool_unit) return false;
  //   else return true;
  // },

  submit: function(code) {
    var task = this.data;
    var startdayArray = new Array();
    var enddayArray = new Array();
    var starttimeArray = new Array();
    var endtimeArray = new Array();
    
    startdayArray = task.activitystartDay.split("-");
    enddayArray = task.activityendDay.split("-");
    starttimeArray = task.activityStartTime.split(":");
    endtimeArray = task.activityEndTime.split(":");
    var startdate = new Date(startdayArray[0], startdayArray[1] - 1, startdayArray[2], starttimeArray[0], starttimeArray[1]);
    var enddate = new Date(enddayArray[0], enddayArray[1] - 1, enddayArray[2], endtimeArray[0], endtimeArray[1]);
    if(startdate.getTime()==enddate.getTime()){
      app.warning('开始和结束时间不能相同');
    } else if (startdate.getTime() > enddate.getTime()){
      app.warning('活动结束时间不能早于开始时间');
    }else{
      wx.request({
        url: app.globalData.apiUrl + '/activity',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('server_token')
        },
        data: {
          activityStartTime: startdate.getTime(),
          activityEndTime: enddate.getTime(),
          activityName: task.activityName,
          activityType: task.activityType,
          organizationMessage: task.organizationMessage,
          description: task.description,
          term: task.term
        },
        success: function (res) {
          switch (res.data.errorCode) {
            case "200":
              wx.hideToast();
              var goType;
              if(task.type=='manage'){
                goType ='manage';
              }else{
                switch (task.activityType){
                  case 'volunteerActivity':
                    goType = 'volunteerActivity';
                    break;
                  case 'practiceActivity':
                    goType = 'practice';
                    break;
                }
              }
              wx.redirectTo({
                url: '../manage/overview/index?type='+goType
              });
              break;
            case "401":
              app.reLaunchLoginPage();
              break;
            default:
              app.warning(res.data.errorMsg);
          }

        },
        fail: function () {
          app.warning('服务器错误');
        }
      });
    }
  }
})