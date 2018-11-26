//函数列表

var app = getApp();
Page({
  data: {
    empty: true,
    listData: []
  },

  onLoad: function (options) {
    console.log('记录员');
    this.showTasks();
  },

  showTasks: function () {
    var that = this;
    wx.request({
      //查看扫码员的扫码任务
      url: app.globalData.apiUrl + "/scanner/search",
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { stuId: app.globalData.stuId },
      success: function (res) {
        switch (res.data.code) {
          case 200:
            if (res.data.data.Privilege.length>0){
              that.data.empty=false;
            }
            that.setData({
              listData: res.data.data.Privilege,
              empty: that.data.empty
            });
            break;
          case 400: app.warning(res.data.msg); break;
          case 401: app.warning(res.data.msg); break;
          case 404: app.warning(res.data.msg); break;
        }
      },
      fail: function (res) {
        app.warning('服务器错误');
      }
    });

  },

  toScan: function (e) {

    var data = e.currentTarget.dataset;
    var acName = data.name;
    var acId = data.id;
    wx.navigateTo({
      url: '../scan/index?acName=' + acName + '&acId=' + acId,
    })
  }

})