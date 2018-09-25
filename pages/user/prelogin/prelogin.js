//函数列表
//onLoad    在加载页面时调用（先等待openid，再用openid进行登录）
//prelogin  用openID预登陆
//warning   只是为了缩减代码量而存在的

var app = getApp();

Page({

  data: {},

  onLoad: function (options) {
    console.log('11');
    getCode();
    console.log('12');
  },

  prelogin: function () {
    wx.request({
      url: 'https://hupanyouth.cn/userlogin',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: { code:app.globalData.code },
      success: function (res){
        console.log('success');
      },
      fail:function(){
        console.log('fail');
      }
    })
  }
})