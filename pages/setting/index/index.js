// pages/setting/index/index.js
var app = getApp();
Page({

  data: {

  },
  toAboutUs: function () {
    wx.navigateTo({
      url: '../aboutUs/index',
    })
  },

  toChangelog: function () {
    wx.navigateTo({
      url: '../changelog/index',
    })
  },
  toAsset: function () {
    wx.navigateTo({
      url: '../borrow/index/index',
    })
  },
  toBorClass:function(){
    wx.navigateTo({
      url: '../broclass/index/index',
    })
  },
  toFinance: function () {
    wx.navigateTo({
      url: '../finManage/orglist/index',
    })
  },
  toChangePwd: function() {
    wx.navigateTo({
      url: '../cgPwd/index',
    })
  },

  toCollect:function(){
    wx.navigateTo({
      url: '../collect/index',
    })
  },

  toLogOut: function() {
    var that = this;
    wx.showModal({
      content: '确认退出吗',
      success: function(res) {
        if (!res.cancel) {
          that.logOut();
        }
      }
    })
  },
  toCertificate: function () {
    wx.navigateTo({
      url: '../certificate/index/index',
    })
  },

  logOut: function() {
    wx.request({
      url: app.globalData.apiUrl + '/user/openId',
      method: "DELETE",
      header: {
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {},
      success: function(res) {
        switch (res.data.errorCode) {
          case '200':
            app.reLaunchLoginPage();
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function() {
        app.warning('服务器错误');
      }
    })
  }

})