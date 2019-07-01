var app = getApp();

Page({

  data: {
    listData: [],
    pastPractice:0,
    empty: true,
  },

  onLoad: function(options) {
    this.showSeals();
    this.getPastStamp()
  },
  getPastStamp: function () {
    var that = this
    wx.request({
      url: app.globalData.apiUrl + '/activity/past',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            var temp = res.data.data
            var pastPractice = temp.pastPracticeActivity
            if (pastPractice > 0) {
              that.setData({
                pastPractice: pastPractice
              })
            }
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function () {
        app.warning('服务器错误')
      }
    })
  },

  showSeals: function(code) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/user/activityStamp?activityType=practiceActivity',
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
            if (res.data.data.activityStamps.length > 0) {
              that.data.empty = false;
            }
            //更新视图
            that.setData({
              listData: res.data.data.activityStamps,
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