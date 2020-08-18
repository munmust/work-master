// pages/setting/broclass/learningsearch/cancel/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cancel_data: []
  },

  userchoose: function (e) {

    var that = this;

    var index = e.currentTarget.dataset.index;

    var queryBean = JSON.stringify(that.data.cancel_data[index]);

    wx.navigateTo({
      url: '../detail/index?queryBean=' + queryBean,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cancel_data: JSON.parse(options.cancel_data)
    })
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