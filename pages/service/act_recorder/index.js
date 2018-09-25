//函数列表

var app = getApp();
Page({
  data: {
    listData: []
  },

  onLoad: function (options) {
    this.showTasks();
  },
  

  showTasks: function () {
    var that = this;
    wx.request({
      //查看扫码员的扫码任务
      url: 'https://hupanyouth.cn/lv/common/scavenger/search',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        stuId: app.globalData.stuId,
        openId: app.globalData.openId
      },
      success: function (res) {
        if (res.data.code == 200) {
          //如果有扫码任务，将任务信息保存到data，然后更新视图。
          that.data.listData = res.data.data.aclist;
          that.setData({ listData: res.data.data.aclist });
        } else if (res.data.code == 400) {
          //如果没有扫码任务，则返回到上一页面。
          app.warning('myScanWork', '您不是扫码员');
          wx.navigateBack({});
        }
      },
      fail: function (res) {
        app.warning('myScanWork', '服务器错误');
        wx.navigateBack({});
      }
    });

  },

  toScan:function(e){
    
    var data=e.currentTarget.dataset;
    var acName=data.name;
    var acId=data.id;
    wx.navigateTo({
      url: '../act_scan/index?acName='+acName+'&acId='+acId,
    })
  }
  
})