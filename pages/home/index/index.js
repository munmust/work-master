//onLoad  页面加载监听函数
//showPersonal  展示个人信息
//showFunctions 展示功能条（学生/创办者）
//changePage  跳转到相应页面
//toggleQrCode  显示/隐藏二维码
import {
  $wuxBackdrop
} from '../../../dist/index';
var QR = require('../../../func/qrcode.js'); //生成二维码用的js文件
var util = require('../../../func/base64.js');
const app = getApp()
Page({

  data: {
    display_qrcode: ''
  },

  onLoad: function() {
    //获取背景幕
    this.$wuxBackdrop = $wuxBackdrop();
    this.showPersonal();
    this.showFunctions();
  },

  showPersonal: function() {
    this.setData({
      stuName: app.globalData.realName,
      stuId: app.globalData.stuId,
      role: app.globalData.role
    });
    var mes = {
      "legal": 'No2Class',
      "stuId": app.globalData.stuId,
      "stuName": app.globalData.realName
    };
    var str = JSON.stringify(mes);
    var base64str = util.baseEncode(str);
    var img = QR.createQrCodeImg(base64str, {
      size: 500
    }); //生成二维码
    this.setData({
      qrcode: img
    });
  },

  showFunctions: function() {
    //两个bool变量，分别表示记录员和活动创建者的权限，用于决定隐藏俺按钮
    var display_recorder = false;
    var display_maker = false;
    //两个身份只能有一个变量被置为true
    switch (app.globalData.role) {
      case '用户':
        display_maker = false;
        display_recorder = false;
        break;
      case '记录员':
        display_recorder = true;
        display_maker = false;
        break;
      case '活动创办者':
        display_maker = true;
        display_recorder = true;
        break;
    }
    //设置视图属性，隐藏相关选项
    this.setData({
      display_recorder: display_recorder,
      display_maker: display_maker
    });
  },

  changePage: function(e) {
    var path;
    switch (e.currentTarget.dataset.type) {
      case 'school':
        path = '../../activity/normal/school/index';
        break;
      case 'social':
        path = '../../activity/normal/social/index';
        break;
      case 'volunteer':
        path = '../../activity/normal/volunteer/index';
        break;
      case 'organization':
        path = '../../activity/normal/organization/index';
        break;
      case 'recorder':
        path = '../../activity/recorder/work/index';
        break;
      case 'make':
        path = '../../activity/manager/index/index';
        break;
    }
    wx.navigateTo({
      url: path
    })
  },

  toggleQrCode: function() {
    if (this.data.display_qrcode != 'qrcode_show') { //如果未显示
      this.data.display_qrcode = 'qrcode_show';
      this.setData({
        display_qrcode: 'qrcode_show'
      });
      this.$wuxBackdrop.retain();
    } else if (this.data.display_qrcode != 'qrcode_hide') {
      this.data.display_qrcode = 'qrcode_hide';
      this.setData({
        display_qrcode: 'qrcode_hide'
      });
      this.$wuxBackdrop.release();
    }
  }

})