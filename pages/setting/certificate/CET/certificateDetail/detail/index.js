// pages/setting/certificate/CET/certificateDetail/detail/index.js
var app = getApp();
var util = require("../../../../../../utils/newutil.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certificateType: '',
    certificateGrade: '',
    certificateTime: '',
    description: '',
    passBtn: false,
    passId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var certificateId = options.certificateId;
    var id = options.passId;
    if (id != "") {
      that.setData({
        passId: id,
        passBtn: true
      })
    }
    this.request(certificateId);
  },
  request: function (certificateId) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/certificate',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        certificateId: certificateId,
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case '200':
            let date = util.getYM(new Date(res.data.data.certificatePublishTime));
            that.setData({
              certificateId: res.data.data.certificateId,
              certificateType: res.data.data.rank,
              certificateGrade: res.data.data.certificateGrade,
              description: res.data.data.extInfo.description,
              certificateTime: date
            })
            break;
          default:
            break;
        }
      },
      fail: function (error) {

      }
    })
  },
  toPass: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定通过该证书？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.apiUrl + '/certificateStamp',
            method: 'PUT',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': wx.getStorageSync('server_token')
            },
            data: {
              certificateId: that.data.certificateId,
              certificateType: "CET_4_6"
            },
            success: function (res) {
              wx.navigateBack({});
              wx.showToast({
                title: "通过成功",
                icon: "success",
                duration: 3000
              })
            },
            fail: function () {
              wx.showToast({
                title: res.data.errorMsg,
                icon: "none",
                duration: 3000
              })
            }
          })
        } else if (res.cancel) {

        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})