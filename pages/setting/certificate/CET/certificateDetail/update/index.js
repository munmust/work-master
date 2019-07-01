// pages/setting/certificate/CET/certificateDetail/update/index.js
var app = getApp();
var util = require("../../../../../../utils/newutil.js");
var check = require('../../../../../../utils/checkutil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeArray: ['四级证书', '六级证书'],
    typeIndex: 0,
    certificateGrade: '',
    certificateType: '',
    description: '',
    certificateStart: '2000-01',
    certificateId: '',
    passId: '',
    isPass: false,
  },
  input: function (e) {
    this.setData({
      certificateGrade: e.detail.value
    })
  },
  bindTypeChange: function (e) {
    var that = this;
    if (e.detail.value == '0') {
      that.setData({
        typeIndex: 0,
        certificateType: "CET_4"
      })
    } else {
      that.setData({
        typeIndex: 1,
        certificateType: 'CET_6'
      })
    }
  },
  bindTextAreaChange: function (e) {
    this.setData({
      description: e.detail.value
    })
  },
  changeCertificateTime: function (e) {
    this.setData({
      'certificateTime': e.detail.value,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var thank = this.data;
    var certificateId = options.certificateId;
    var id = options.passId;
    if (id != "") {
      that.setData({
        passId: id,
        isPass: true
      })
    }
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
            let data = res.data.data;
            let type = res.data.data.rank;
            let date = util.getYM(new Date(data.certificatePublishTime));
            if (type === "CET_4") {
              typeIndex: 0
            } else {
              that.setData({
                typeIndex: 1
              })
            }
            that.setData({
              certificateGrade: data.certificateGrade,
              certificateType: data.rank,
              description: data.extInfo.description,
              certificateTime: date,
              certificateId: data.certificateId
            })
            break;
          default:
            break;
        }
      },
      fail: function (error) {
        wx.redirectTo({
          url: '../index/index'
        })
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'none',
          duration: 3000
        })
      }
    })

  },
  toSubmit: function () {
    let that = this;
    let thank = this.data;
    let certificateTimes = thank.certificateTime.split("-");
    var certificatePublishTime = new Date(certificateTimes[0], certificateTimes[1] - 1).getTime();
    if (thank.certificateGrade == "") {
      wx.showToast({
        title: "成绩不能为空",
        icon: "none",
        duration: 3000
      });
    } else {
      if (!check.checkPInteger(thank.certificateGrade)) {
        wx.showToast({
          title: "成绩只能为整数",
          icon: "none",
          duration: 3000
        });
      } else {
        if (thank.certificateGrade > 710 || thank.certificateGrade < 425) {
          wx.showToast({
            title: "成绩不能为高于710或小于425",
            icon: "none",
            duration: 3000
          });
        } else {
          let nowDate = (new Date()).getTime();
          if (certificatePublishTime > nowDate) {
            wx.showToast({
              title: "发证时间不能大于当前时间",
              icon: "none",
              duration: 3000
            });
          } else {
            if (thank.description == "") {
              wx.showToast({
                title: "证书详情不能为空",
                icon: "none",
                duration: 3000
              });
            } else {
              if (thank.isPass) {
                that.passRequest();
              } else {
                that.submitRequest();
              }
            }
          }
        }
      }
    }
  },
  submitRequest: function () {
    let that = this;
    let thank = this.data;
    let certificateTimes = thank.certificateTime.split("-");
    var certificatePublishTime = new Date(certificateTimes[0], certificateTimes[1] - 1).getTime();
    wx.request({
      url: app.globalData.apiUrl + '/certificate',
      method: "PUT",
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        "certificateId": thank.certificateId,
        "certificatePublishTime": certificatePublishTime,
        "certificateType": "CET_4_6",
        "rank": thank.certificateType,
        "certificateGrade": thank.certificateGrade,
        "extInfo": {
          "description": thank.description,
        }
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case '200':
            wx.redirectTo({
              url: '../index/index',
            })
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 3000
            })
            break;
          default:
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'none',
              duration: 3000
            })
            break;
        }
      },
      fail: function (error) {
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  passRequest: function () {
    let that = this;
    let thank = this.data;
    let certificateTimes = thank.certificateTime.split("-");
    var certificatePublishTime = new Date(certificateTimes[0], certificateTimes[1] - 1).getTime();
    wx.request({
      url: app.globalData.apiUrl + '/certificate',
      method: "PUT",
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        "certificateId": thank.certificateId,
        "certificatePublishTime": certificatePublishTime,
        "certificateType": "CET_4_6",
        "rank": thank.certificateType,
        "confirmUserId": thank.passId,
        "certificateGrade": thank.certificateGrade,
        "extInfo": {
          "description": thank.description,
        }
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case '200':
            wx.navigateBack({});
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 3000
            })
            break;
          default:
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'none',
              duration: 3000
            })
            break;
        }
      },
      fail: function (error) {
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 3000
        })
      }
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