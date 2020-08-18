// pages/home/cancel/detail/index.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryBean: [],
    failureMsg: [],
    failureTime: [],
    failureReason: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    var queryBean = JSON.parse(options.queryBean)
    that.setData({
      queryBean: queryBean,
      failureMsg: queryBean.failureMessage
    })

    var failureTime = '';
    var failureReason = '';
    for(var i=0;i<7;i++) {
      failureTime+=that.data.failureMsg[i];
    }
    for(i=8;i<that.data.failureMsg.length;i++) {
      failureReason+=that.data.failureMsg[i];
    }

    that.setData({
      failureTime: failureTime,
      failureReason: failureReason
    })

    //开发测试
    console.log(that.data.queryBean,that.data.failureTime,that.data.failureReason);
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