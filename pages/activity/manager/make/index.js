// pages/activity/manager/make/index.js
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
    organizationMessage: '',
    description: '',
    score: '',
    defaultTime: ''
  },

  onLoad: function(options) {

  },

  chooseType: function() {
    var that = this;
    $wuxSelect('#select-type').open({
      value: '',
      options: [
        '校园活动',
        '志愿活动',
        '实践活动'
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            activityType: value,
          })
        };
        switch (value) {
          case '校园活动':
            that.data.activityType = 'SCHOOL_ACTIVITY';
          case '志愿活动':
            that.data.activityType = 'VOLUNTEER_ACTIVITY';
          case '实践活动':
            that.data.activityType = 'PRACTICE_ACTIVITY';
          // case '义工活动':
          //   that.data.activityType = 'VOLUNTEER_WORK';
        }
      },
    })
  },

  chooseTerm: function() {
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
            act_term: value,
          })
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
      case 'act_duration':
        that.data.act_duration = value;
        break;
      case 'act_message':
        that.data.act_message = value;
        break;
      case 'act_hour':
        that.data.act_hour = value;
        break;
      case 'act_minute':
        that.data.act_minute = value;
        break;
    }
  },

  toSubmit: function() {
    var that = this;
    if (!this.check()) {
      wx.showModal({
        content: '信息不完整，请检查',
        showCancel: false
      });
      return;
    }
    wx.showModal({
      content: '确认提交？',
      success: function(res) {
        if (!res.cancel) { //确认提交
          that.duration = that.act_hour + that.act_minute / 60;
          console.log('hi');
          app.getCode(that.submit);
        }
      }
    })
  },

  check: function() {
    var bool_name = this.data.activityName == '';
    var bool_type = this.data.activityType == '';
    var bool_term = this.data.act_term == '';
    var bool_unit = this.data.organizationMessage == '';
    if (bool_name || bool_type || bool_term || bool_unit) return false;
    else return true;
  },

  submit: function(code) {
    var that = this;
    wx.request({
      //url: app.globalData.apiUrl + '/activity',
      url: 'http://119.23.188.92:8000/activity',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        code: code,
        name: that.activityName,
        type: that.activityType,
        unit: that.organizationMessage,
        duration: that.act_duration,
        message: that.act_message,
        exparam: that.act_term
      },
      success: function(res) {
        console.log(res);
        wx.hideToast();
        wx.redirectTo({
          url: '../../manage/overview/index'
        });
      },
      fail: function() {
        app.warning('服务器错误');
      }
    });
  }
})