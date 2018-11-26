//函数列表
//changePage  跳转到对应页面

const app = getApp()
Page({

  data: {},

  onLoad: function () { },

  changePage: function (e) {
    var path;
    switch (e.currentTarget.dataset.type) {
      case 'manage': path = '../manage/overview/index'; break;
      case 'make': path = '../make/index'; break;
    }
    wx.navigateTo({ url: path })
  }
})
