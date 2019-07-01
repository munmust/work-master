var app = getApp();

Page({

  data: {
    listData: [],
    empty: true
  },

  onLoad: function(options) {
    this.showSeals();
  },

  showSeals: function(code) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/user/activityStamp?activityType=volunteerWork',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      success: function(res) {
        switch (res.data.errorCode) {
          case "200":
            var timestr, newTimeStr;
            //将数据库时间字符串转为视图时间字符串
            for (var i = 0; i < res.data.data.activityStamps.length; i++) {
              timestr = res.data.data.activityStamps[i].createTime;
              newTimeStr = app.getDateStrByTimeStr(timestr);
              res.data.data.activityStamps[i].createTime = newTimeStr;
            }
            // //计算时长
            // var totalTime = 0;
            // for (var i = 0; i < res.data.data.activityStamps.length; i++) {
            //   totalTime += res.data.data.activityStamps[i].time;
            // }
            if (res.data.data.activityStamps.length > 0) {
              that.data.empty = false;
            }
            //更新视图
            that.setData({
              listData: res.data.data.activityStamps,
              totalTime: res.data.data.totalTime,
              empty: that.data.empty
            });
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