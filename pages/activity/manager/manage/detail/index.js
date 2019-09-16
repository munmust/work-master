// pages/service/mk_detail/index.js
const app = getApp();

Page({

  data: {
    activityId: ''
  },
  onLoad: function (options) {
    var jsonStr = options.mes;
    var detail = JSON.parse(jsonStr);
    this.setData({
      activityId: detail.activityId
    })
    switch (detail.state){
      case 'PUBLISHED': detail.state ='已上线';break;
      case 'APPROVED': detail.state = '准备中'; break;
      case 'FINISHED': detail.state = '已下线'; break;
      case 'RESTARTED': detail.state = '重启中'; break;
    }
    switch(detail.term){
      case '2017A': detail.term ='2017-2018 第一学期';break;
      case '2017B': detail.term = '2017-2018 第二学期'; break;
      case '2018A': detail.term = '2018-2019 第一学期'; break;
      case '2018B': detail.term = '2018-2019 第二学期'; break;
    }
    this.setData({ detail: detail });
  },

  judgeActivity() {
    var that = this;
    var activityId = that.data.activityId;
    that.toRequest(activityId);
  },

  toRequest(activityId) {
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
    console.log("123");
    wx.navigateTo({
      url: '/pages/setting/registrationManager/registration/index?activityId=' + that.data.activityId
    })
  },

  toIndex() {
    var that = this;
    wx.navigateTo({
      url: '/pages/setting/registrationManager/index/index?activityId=' + that.data.activityId,
    })
  }
})