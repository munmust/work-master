// pages/user/cgPwd/index.js
var app = getApp();

Page({

  data: {
    pwd1: null,
    pwd2: null,
    pwd3: null
  },

  onLoad: function (options) {

  },

  pwd1Change: function (e) {
    this.data.pwd1 = e.detail.value;
  },

  pwd2Change: function (e) {
    this.data.pwd2 = e.detail.value;
  },

  pwd3Change: function (e) {
    this.data.pwd3 = e.detail.value;
  },

  submit: function () {
    var that = this;
    if (that.data.pwd1 == '' || that.data.pwd2 == '' || that.data.pwd3 == '' ||
      that.data.pwd1 == null || that.data.pwd1 == null || that.data.pwd1 == null) {
      wx.showModal({
        content: '请填写完整',
      })
    }
    if (that.data.pwd2 == that.data.pwd3) {
      wx.login({
        success: function (res) {
          that.requestChangePwd(res.code, that.data.pwd1, that.data.pwd2);
        }
      })
    } else {
      wx.showModal({
        content: '两次密码不一致',
      })
    }
  },

  requestChangePwd: function (code, oldPwd, newPwd) {
    wx.request({
      url: app.globalData.apiUrl + '/user/pwd',
      method: "PUT",
      header: { 'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('server_token') },
      data: {
        password: oldPwd,
        newPassword: newPwd
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            wx.removeStorageSync('server_token');
            wx.reLaunch({ url: '../../login/index' }); break;
          case "401":
            //token不正确时，清除本地token并跳转至登录界面
            wx.removeStorageSync('server_token');
            wx.redirectTo({
              url: '../login/index'
            });
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      }
    })
  }
})