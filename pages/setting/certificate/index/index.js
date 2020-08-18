// pages/setting/certificate/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showExamine: false,
    showDistribute: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var role = app.globalData.roleInfo
    var showExamine = false;
    var showDistribute = false;
    for (var i = 0; i < role.length; i++) {
      if (role[i] == 'CERTIFICATE_MANAGER') {
        showExamine = true
        showDistribute = true
      } else if (role[i] == 'CERTIFICATE_CONFIRM') {
        showExamine = true
      }
    }
    this.setData({
      showExamine: showDistribute,
      showDistribute: showDistribute
    })
  },
  toQcertificate: function () {
    wx.navigateTo({
      url: '../Qcertificate/index/index',
    })
  },
  toScertificate: function () {
    wx.navigateTo({
      url: '../Scertificate/index/index',
    })
  },
  toCcertificate: function () {
    wx.navigateTo({
      url: '../Ccertificate/index/index',
    })
  },
  toCET: function () {
    wx.navigateTo({
      url: '../CET/index/index',
    })
  },
  toDistribute: function () {
    wx.navigateTo({
      url: '../distribute/index',
    })
  },
  toExamine: function () {
    wx.navigateTo({
      url: '../examineList/index',
    })
  },
  toImport: function () {
    wx.navigateTo({
      url: '../import/index',
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