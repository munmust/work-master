//onLoad  页面加载监听函数
//onShow  页面显示监听函数
//navigateByRole  根据账号角色跳转到目标页面（学生/教师）

var app=getApp();
Page({

  data: {

  },

  onLoad: function (options) {
    this.navigateByRole();
  },

  onShow: function () {
    this.navigateByRole();
  },

  navigateByRole:function(){
    if(app.globalData.role == "教师"){
      wx.switchTab({ url: '../teacher/index' });
    }else{
      wx.switchTab({ url: '../student/index' });
    }
  }
})