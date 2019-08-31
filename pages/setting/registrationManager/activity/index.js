var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId:''
  },

  inputId(e){
    var that = this;
    that.setData({
      activityId: e.detail.value
    })
  },
  
  judgeActivity(){
    var that = this;
    var activityId=that.data.activityId;
    that.toRequest(activityId);
  },

  toRequest(activityId){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/activityEntry',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        activityId: activityId
      },
      success: function (res) {
        console.log(res.data);
        switch (res.data.errorCode) {
          case "400":
            app.warning('无报名信息');
            that.toRegistration();
            break;
          case "200":
            // app.warning('有报名信息');
            that.toIndex();
            break;
        }
      },
      fail: function () {
        app.warning('服务器错误');
      }

    })
  },

  toRegistration() {
    var that = this;
    wx.navigateTo({
      url: '../registration/index?activityId=' + that.data.activityId,
    })
  },

  toIndex(){
    var that=this;
    wx.navigateTo({
      url: '../index/index?activityId='+that.data.activityId,
    })
  }

  
})