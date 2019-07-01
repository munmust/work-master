//onLoad    监听页面加载函数
//prelogin  使用code进行登录

var app = getApp();

Page({

  data: {},

  onLoad: function (options) {
    var that = this;
    app.getCode(that.prelogin);
  },

  prelogin: function (code) {
    wx.request({
      url: app.globalData.apiUrl + '/user',
      method: 'GET',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' ,
        'Authorization': wx.getStorageSync('server_token') },
      success: function (res) {
        switch (res.data.errorCode) {
          case "401": 
            //token不正确时，清除本地token并跳转至登录界面
            wx.removeStorageSync('server_token');
            wx.redirectTo({ url: '../login/index' }); break;
          case "200":
            app.globalData.stuId = res.data.data.userInfo.stuId;
            app.globalData.realName = res.data.data.userInfo.realName;
            app.globalData.major = res.data.data.userInfo.major;
            app.globalData.classId = res.data.data.userInfo.classId;
            app.globalData.grade = res.data.data.userInfo.grade;
            app.globalData.roleInfo = res.data.data.roleInfo;
            wx.switchTab({ url: '../home/index/index' })
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function () { app.warning('服务器错误'); }
    })
  }
  
})