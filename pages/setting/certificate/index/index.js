// pages/setting/certificate/index/index.js
const app = getApp();
var util = require('../../../../func/base64.js');
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
      showExamine: showExamine,
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
  examine: function () {
    var that = this;
    var Participant_Mes = {};
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        //解密base64加密的字符串
        var Participant_Mes_Encrypted = res.result;
        var Participant_Mes_Str = util.baseDecode(Participant_Mes_Encrypted);
        //如果json字符串第一个是怪异字符，则去掉
        let firstCode = Participant_Mes_Str.charCodeAt(0);
        if (firstCode < 0x20 || firstCode > 0x7f) {
          Participant_Mes_Str = Participant_Mes_Str.substring(1);
        }
        //转成json对象
        try {
          Participant_Mes = JSON.parse(Participant_Mes_Str);
        } catch (e) {
          app.warning('微信无法识别该二维码');
        }
        if (Participant_Mes.legal != "No2Class") {
          app.warning('小程序无法识别该二维码');
          return;
        };
        wx.navigateTo({
          url: '../examineList/index?stuId=' + Participant_Mes.stuId,
        })
      },
      fail: function () {
        app.warning('扫码失败');
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