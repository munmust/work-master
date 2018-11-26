// pages/activity/manager/make/index.js
import { $wuxSelect } from '../../../../dist/index'

var app=getApp();
Page({

  data: {
    act_name: '',
    act_type: '',
    act_term: '',
    act_unit: '',
    act_duration: 0,
    act_message: '',
    act_hour: 0,
    act_minute: 0
  },

  onLoad: function (options) {

  },

  chooseType:function(){
    var that=this;
    $wuxSelect('#select-type').open({
      value: '',
      options: [
        '校园活动',
        '社会实践',
        '志愿活动',
        '组织履历',
        '义工'
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            act_type: value,
          })
        };
        switch(value){
          case '校园活动': that.data.act_type = 'xyhd';
          case '社会实践': that.data.act_type = 'shsj';
          case '志愿活动': that.data.act_type = 'zyhd';
          case '组织履历': that.data.act_type = 'lvli';
        }
      },
    })
  },

  chooseTerm:function(){
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

  input:function(e){
    var that = this;
    var which = e.currentTarget.dataset.name;
    var value = e.detail.value;
    switch(which){
      case 'act_name': that.data.act_name = value; break;
      case 'act_unit': that.data.act_unit = value; break;
      case 'act_duration': that.data.act_duration = value; break;
      case 'act_message': that.data.act_message = value; break;
      case 'act_hour': that.data.act_hour = value; break;
      case 'act_minute': that.data.act_minute = value; break;
    }
  },

  toSubmit:function(){
    var that=this;
    if (!this.check()){
      wx.showModal({
        content:'信息不完整，请检查',
        showCancel:false
      });
      return;
    }
    wx.showModal({
      content: '确认提交？',
      success:function(res){
        if (!res.cancel){//确认提交
          that.duration=that.act_hour+that.act_minute/60;
          console.log('hi');
          app.getCode(that.submit);
        }
      }
    })
  },

  check:function(){
    var bool_name = this.data.act_name == '';
    var bool_type = this.data.act_type == '';
    var bool_term = this.data.act_term == '';
    var bool_unit = this.data.act_unit == '';
    if(bool_name || bool_type || bool_term || bool_unit)return false;
    else return true;
  },

  submit:function(code){
    var that=this;
    wx.request({
      url: app.globalData.apiUrl + '/activity',
      method: 'POST',
      header: { 'Content-Type': 'application/json' }, // 设置请求的 header
      data: {
        code: code,
        name: that.act_name,
        type: that.act_type,
        unit: that.act_unit,
        duration: that.act_duration,
        message: that.act_message,
        exparam: that.act_term
      },
      success: function (res) {
        console.log(res);
        wx.hideToast();
        wx.redirectTo({ url: '../../manage/overview/index' });
      },
      fail: function () { app.warning('服务器错误'); }
    });
  }
})