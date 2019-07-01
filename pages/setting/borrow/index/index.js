// pages/setting/borrow/index/index.js
var app = getApp();
var util = require('../../../../func/base64.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    assetId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  toBorrowAsset:function () {
    var that=this;
    var assetId;
    wx.scanCode({
      success:(res)=>{
        this.assetId=res.result;
        that.setData({
          assetId: this.assetId
        })
        wx.redirectTo({
          url: '../borrowing/index?assetId=' + that.assetId,
        })
      },
      fail:function(){
        app.warning('扫码失败');
      }
    })
  },
  toBorrowDetail:function () {
    wx.navigateTo({
      url: '../borrowdetail/index/index',
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