//pages/setting/registrationManager/index/index.js
var app = getApp();
Page({
  data:{
    empty: true,
  },
  toRgistration:function(){
    wx.navigateTo({
      url: '../registration/index',
    })
  }

})