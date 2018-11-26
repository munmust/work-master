
var app = getApp();

Page({

  data: {
    listData: [],
    empty: true
  },

  onLoad: function (options) {
    this.showSeals();
  },

  showSeals: function (code) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/userActivity/type',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: { stuId: app.globalData.stuId, activityType: 'zyhd' },
      success: function (res) {
        console.log(res.data);
        var timestr, newTimeStr;
        //将数据库时间字符串转为视图时间字符串
        for (var i = 0; i < res.data.data.activityList.length; i++) {
          timestr = res.data.data.activityList[i].created;
          newTimeStr = app.getDateStrByTimeStr(timestr);
          res.data.data.activityList[i].created = newTimeStr;
        }
        //计算时长
        var totalDuration = 0;
        for (var i = 0; i < res.data.data.activityList.length; i++) {
          totalDuration += res.data.data.activityList[i].duration;
        } 
        if (res.data.data.activityList.length > 0) {
          that.data.empty = false;
        }
        //更新视图
        that.setData({
          listData: res.data.data.activityList,
          totalDuration: totalDuration,
          empty: that.data.empty
        });
      },
      fail: function () { app.warning('服务器错误'); }
    })
  }

})