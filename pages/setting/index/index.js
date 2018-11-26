// pages/setting/index/index.js
var app=getApp();
Page({

  data: {

  },

  topage_cgpwd:function(){
    wx.navigateTo({
      url: '../cgPwd/index',
    })
  },

  toLogOut:function(e){
    var that=this;
    wx.showModal({
      content: '确认退出吗',
      success: function (res) {
        if (!res.cancel) {
          app.getCode(that.logOut);
        }
      }
    })
  },

  logOut:function(code){
    var url = app.globalData.apiUrl + '/user/openId?code=' + code;
    wx.request({
      url: url,
      method: "DELETE",
      header: { "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW" },
      data: {},
      success: function (res) {
        switch (res.data.code) {
          case 200:
            wx.reLaunch({
              url: '../../login/index',
            })
            break;
          case 400: app.warning(res.data.msg); break;
          case 404: app.warning(res.data.msg); break;
          case 500: app.warning(res.data.msg); break;
        }
      },
      fail: function () {
        app.warning('服务器错误');
      }
    })
  }
  
})