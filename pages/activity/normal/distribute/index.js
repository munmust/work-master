
var app = getApp();
Page({
  data:{
    total:1,//总数
    surplus:0,
    schoolMax:1,//校园活动最大数
    schoolValue:0,
    lectureMax:1,//讲座活动最大数
    lectureValue:0,
    pastSchool:0,
    pastLecture:0
  },
  onLoad:function(){
    this.getStamp();
  },
  onChangeSchool(e) {
    this.setData({
      schoolValue: e.detail.value
    })
    
  },
  onChangeLecture(e) {
    this.setData({
      lectureValue: e.detail.value
    })

  },
  getStamp:function(){
    var that=this
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
            var total = temp.undistributedStamp + temp.pastSchoolActivity + temp.pastLectureActivity
            that.setData({
              total: total,
              surplus: temp.undistributedStamp,
              schoolMax: total,
              lectureMax: total,
              schoolValue: temp.pastSchoolActivity,
              lectureValue: temp.pastLectureActivity,
              pastSchool: temp.pastSchoolActivity,
              pastLecture: temp.pastLectureActivity
            })
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
  toSubmit(){
    var that=this
    var total = that.data.total
    var schoolValue = that.data.schoolValue
    var lectureValue = that.data.lectureValue
    var sumTemp=schoolValue+lectureValue
    if(sumTemp>total){
      app.warning('超出分配额')
    }else{
      wx.request({
        url: app.globalData.apiUrl + '/activity/past',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('server_token')
        },
        data:{
          pastSchoolActivity: schoolValue,
          pastLectureActivity: lectureValue,
          undistributedStamp:total-sumTemp
        },
        success: function (res) {
          console.log(res)
          switch (res.data.errorCode) {
            case "200":
              wx.switchTab({
                url: '../../../home/index/index'
              });
              wx.showToast({
                title: '分配成功',
                icon: 'succes',
                duration: 1000,
                mask: true
              });
              break;
            case "401":
              app.reLaunchLoginPage();
              break;
            default:
              app.warning(res.data.errorMsg);
          }
        },
        fail: function () {
          app.warning('服务器错误');
        }
      })
    }
  }
})