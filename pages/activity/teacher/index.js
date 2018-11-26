// pages/test/index.js

var util = require('../../../func/base64.js');
var app = getApp();
Page({

  data: {
    work_name: '',
    work_duration: 0,
    stu_id: '',
    stu_name: ''
  },

  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: 'teacher_work_name',
      success: function(res) {
        that.data.work_name=res.data;
        if (that.data.work_name == null || that.data.work_name==''){
          that.data.work_name='';          
        }
        that.setData({
          work_name: that.data.work_name
        });
      }
    })
  },

  input:function(e){
    var that=this;
    var name = e.currentTarget.dataset.name;
    var value = e.detail.value;
    switch(name){
      case "work_name": that.data.work_name = value; break;
      case "work_duration": that.data.work_duration = value; break;
    }
    wx.setStorage({
      key: 'teacher_work_name',
      data: that.data.work_name
    })
  },

  toScan: function () {
    var stuMes = {};
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success:function(res){
        //这个步骤是必要的，因为在json字符串转json对象时，会因为json字符串第一个怪异的字符而转换失败。
        var mmes = res.result;
        var mes = util.baseDecode(mmes);
        let firstCode = mes.charCodeAt(0);
        if (firstCode < 0x20 || firstCode > 0x7f) {
          mes = mes.substring(1); // 去除第一个诡异字符
        }
        //转成json对象
        try {
          stuMes = JSON.parse(mes);
        } catch (e) {
          app.warning('codeScanner', '无法识别的二维码');
        }
        //检查是否是小程序合法的二维码
        if (stuMes.legal != 'No2Class') {//如果非法二维码，则不作处理
          app.warning('codeScanner', '无法识别的二维码');
          return;
        };
        //更新data和视图
        that.data.stu_id=stuMes.stuId;
        that.data.stu_name=stuMes.stuName;
        that.setData({
          stu_id: stuMes.stuId,
          stu_name: stuMes.stuName
        });
      }
    });
  },

  toSubmit:function(){
    var that=this;
    console.log(that.data.work_name);
    console.log(that.data.work_duration);
    console.log(that.data.stu_name);
    console.log(that.data.stu_id);
  }

})