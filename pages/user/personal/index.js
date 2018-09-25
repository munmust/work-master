// pages/user/personal/index.js
var QR = require('../../../func/qrcode.js');//生成二维码用的js文件
var util = require('../../../func/base64.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      stuName: app.globalData.stuName,
      stuId: app.globalData.stuId
    });

    var mes={
      "legal": 'No2Class',
      "stuId": app.globalData.stuId,
      "stuName": app.globalData.stuName
    };
    var str=JSON.stringify(mes);
    var base64str = util.baseEncode(str);
    var img = QR.createQrCodeImg(base64str, { size: 400 }); //生成二维码
    this.setData({qrcode:img});
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