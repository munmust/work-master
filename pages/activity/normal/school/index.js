var app = getApp();

Page({

  data: {
    listData: [],
    pastSchool:0,
    empty: true,
  },

  onLoad: function(options) {
    this.showSeals()
    this.getPastStamp()
  },
  getPastStamp:function(){
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
            var pastSchool = temp.pastSchoolActivity
            if(pastSchool>0){
              that.setData({
                pastSchool: temp.pastSchoolActivity
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
      url: app.globalData.apiUrl + '/user/activityStamp?activityType=schoolActivity',
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
              var tempTerm = res.data.data.activityStamps[i].term;
              switch (tempTerm) {
                case '2017A':
                  res.data.data.activityStamps[i].term = '2017-2018 第一学期'
                  break;
                case '2017B':
                  res.data.data.activityStamps[i].term = '2017-2018 第二学期'
                  break;
                case '2018A':
                  res.data.data.activityStamps[i].term = '2018-2019 第一学期'
                  break;
                case '2018B':
                  res.data.data.activityStamps[i].term = '2018-2019 第二学期'
                  break;
              }
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