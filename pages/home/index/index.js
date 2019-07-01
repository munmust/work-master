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
const app = getApp();
var theTime;
Page({

  data: {
    display_qrcode: '',
    total:0
  },

  onLoad: function() {
    //获取背景幕
    this.$wuxBackdrop = $wuxBackdrop();
    this.setData({
      stuName: app.globalData.realName,
      stuId: app.globalData.stuId,
      major: app.globalData.major,
      classId: app.globalData.classId,
      grade: app.globalData.grade,
      roleInfo: app.globalData.roleInfo
    });
    //活动章分配开放
    this.getStamp();
    
    this.showFunctions();
  },
  onShow:function(){
    this.setData({
      major: app.globalData.major,
      classId: app.globalData.classId,
      grade: app.globalData.grade,
    });
  },

  //以往活动章获取
  getStamp: function () {
    var that = this
    wx.request({
      url: app.globalData.apiUrl + '/activity/past',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            var temp = res.data.data
            var total = temp.undistributedStamp + temp.pastSchoolActivity + temp.pastLectureActivity
            that.setData({
              total: total
            })
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function () {
        app.warning('服务器错误')
      }
    })
  },

  showPersonal: function() {
    var time = (new Date()).getTime();
    var mes = {
      "legal": 'No2Class',
      "stuId": app.globalData.stuId,
      "stuName": app.globalData.realName,
      "timestamp": time
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
    var showrole = this.data.roleInfo;
    //三个bool变量，分别表示记录员和活动创建者的权限，用于决定隐藏俺按钮
    var display_recorder = false;
    var display_maker = false;
    var not_student=true;
    for(var i=0;i<showrole.length;i++){
      switch(showrole[i]){
        case 'ACTIVITY_STAMPER':
          display_recorder=true;
          break;
        case 'ACTIVITY_MANAGER':
        case 'PARTY_ACTIVITY_MANAGER':
        case 'VOLUNTEER_WORK_MANAGER':
        case 'VOLUNTEER_ACTIVITY_MANAGER':
        case 'PRACTICE_ACTIVITY_MANAGER':
          display_maker=true;
          break;
        case 'NOT_STUDENT':
          not_student=false;
          break;
      }
    }
    //设置视图属性，隐藏相关选项
    this.setData({
      display_recorder: display_recorder,
      display_maker: display_maker,
      not_student: not_student
    });
  },

  changePage: function(e) {
    var path;
    switch (e.currentTarget.dataset.type) {
      case 'school':
        path = '../../activity/normal/school/index';
        break;
      case 'lecture':
        path = '../../activity/normal/lecture/index';
        break;
      case 'social':
        path = '../../activity/normal/social/index';
        break;
      case 'volunteer':
        path = '../../activity/normal/volunteer/index';
        break;
      case 'work':
        path = '../../activity/normal/work/index';
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
      case 'party':
        path = '../../activity/normal/party/toParty/index';
        break;
      case 'distribute':
        path = '../../activity/normal/distribute/index';
        break;
    }
    wx.navigateTo({
      url: path
    })
  },

  holdTime:function(){
    this.showPersonal();
    theTime=setTimeout(this.holdTime, 1000 * 10);
  },

  toggleQrCode: function() {
    
    if(this.data.show!='isshow'){
      if (this.data.display_qrcode != 'qrcode_show') { //如果未显示
        this.holdTime();
        this.data.display_qrcode = 'qrcode_show';
        this.setData({
          display_qrcode: 'qrcode_show'
        });
        this.$wuxBackdrop.retain();
      } else if (this.data.display_qrcode != 'qrcode_hide') {
        clearTimeout(theTime);
        this.data.display_qrcode = 'qrcode_hide';
        this.setData({
          display_qrcode: 'qrcode_hide'
        });
        this.$wuxBackdrop.release();
      }
    }
  }

})