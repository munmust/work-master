// pages/setting/certificate/Scertificate/certificateDetail/update/index.js
let app = getApp();
var util = require("../../../../../../utils/newutil.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certificateName: '',
    certificateId: '',
    certificateNumber: '',
    certificateStart: '2000-01',
    certificateGrade: '',
    certificateTime: '',
    certificateEndTime: '',
    description: '',
    passId: '',
    isPass: false
  },
  input: function (e) {
    var that = this;
    let inputType = e.currentTarget.dataset.name;
    switch (inputType) {
      case 'certificateName':
        that.setData({
          certificateName: e.detail.value
        })
        break;
      case 'certificateGrade':
        that.setData({
          certificateGrade: e.detail.value
        })
        break;
      case 'certificateNumber':
        that.setData({
          certificateNumber: e.detail.value
        })
        break;
      case 'description':
        that.setData({
          description: e.detail.value
        })
        break;
    }
  },
  bindTextAreaChange: function (e) {
    this.setData({
      description: e.detail.value
    })
  },
  changeCertificateTime: function (e) {
    this.setData({
      certificateTime: e.detail.value

    })

  },
  changeCertificateEndTime: function (e) {
    this.setData({
      certificateEndTime: e.detail.value
    })
  },
  /*
  判断中文和英文
*/
  checkCE: function (str) {
    let reg = /^[\u4e00-\u9fa5_a-zA-Z]+$/;
    return reg.test(str);
  },
  /*
    判断数字字母和#
  */
  checkEN: function (str) {
    let reg = /^[a-zA-Z0-9#]+$/;
    return reg.test(str);
  },
  /*
    判断中文数字英文
  */
  checkCEN: function (str) {
    let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
    return reg.test(str)
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
            let startTime = util.getYM(new Date(res.data.data.certificatePublishTime))
            let endTime;
            if (res.data.data.expirationTime == null) {
              endTime = util.getYM(new Date());
            } else {
              endTime = util.getYM(new Date(res.data.data.expirationTime));
            }
            that.setData({
              certificateId: res.data.data.certificateId,
              certificateName: res.data.data.certificateName,
              certificateNumber: res.data.data.certificateNumber,
              certificateGrade: res.data.data.rank,
              certificateTime: startTime,
              certificateEndTime: endTime,
              description: res.data.data.extInfo.description,
            })
            break;
          default:
            wx.showToast({
              title: res.data.data.errorMsg,
              icon: 'none',
              duration: 3000
            })
            wx.redirectTo({
              url: '../index/index',
            });
            break;
        }
      },
      fail: function (error) {
        wx.showToast({
          title: res.data.data.errorMsg,
          icon: 'none',
          duration: 3000
        })
        wx.redirectTo({
          url: '../index/index',
        });
      }
    });
  },
  toSubmit: function () {
    var that = this;
    var thank = this.data;
    if (thank.certificateName == "" || !that.checkCEN(thank.certificateName)) {
      wx.showToast({
        title: '证书全称不能为空或出现特殊字符',
        icon: 'none',
        duration: 3000
      })
    } else {
      if (thank.certificateGrade != "" && !that.checkCEN(thank.certificateGrade)) {
        wx.showToast({
          title: '证书等级不为空或出现特殊字符',
          icon: 'none',
          duration: 3000
        })
      } else {
        if (thank.description == "") {
          wx.showToast({
            title: '证书等级不能为空',
            icon: 'none',
            duration: 3000
          })
        } else {
          if (thank.isPass) {
            that.passRequest();
          } else {
            that.submitRequest();
          }
        }
      }
    }
  },
  submitRequest: function () {
    var that = this;
    var thank = this.data;
    let certificateTimes = thank.certificateTime.split("-");
    var certificatePublishTime = new Date(certificateTimes[0], certificateTimes[1] - 1).getTime();
    let certificateEndTimes = thank.certificateEndTime.split("-");
    var expirationTime = new Date(certificateEndTimes[0], certificateEndTimes[1] - 1).getTime();
    var newDate = util.getYM(new Date());

    if (thank.certificateEndTime < newDate) {
      expirationTime = ""
    }
    if (certificatePublishTime > newDate) {
      wx.showToast({
        title: "发证时间不能大于当前时间",
        icon: 'none',
        duration: 3000
      })
    } else {
      if (certificatePublishTime > expirationTime) {
        wx.showToast({
          title: "发证时间大能小于有效时间",
          icon: 'none',
          duration: 3000
        })
      } else {
        wx.request({
          url: app.globalData.apiUrl + '/certificate',
          method: "PUT",
          header: {
            'Content-Type': 'application/json',
            'Authorization': wx.getStorageSync('server_token')
          },
          data: {
            "certificateId": thank.certificateId,
            "certificateName": thank.certificateName,
            "certificatePublishTime": certificatePublishTime,
            "certificateType": 'SKILL',
            "rank": thank.certificateGrade,
            "expirationTime": expirationTime,
            "certificateNumber": thank.certificateNumber,
            "extInfo": {
              "description": thank.description
            }
          },
          success: function (res) {
            switch (res.data.errorCode) {
              case '200':
                wx.redirectTo({
                  url: '../index/index',
                })
                wx.showToast({
                  title: "修改成功",
                  icon: 'none',
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
              title: res.data.data.errorMsg,
              icon: 'none',
              duration: 3000
            })
          }
        })
      }
    }
  },
  passRequest: function () {
    var that = this;
    var thank = this.data;
    let certificateTimes = thank.certificateTime.split("-");
    var certificatePublishTime = new Date(certificateTimes[0], certificateTimes[1] - 1).getTime();
    let certificateEndTimes = thank.certificateEndTime.split("-");
    var expirationTime = new Date(certificateEndTimes[0], certificateEndTimes[1] - 1).getTime();
    var newDate = util.getYM(new Date());

    if (thank.certificateEndTime < newDate) {
      expirationTime = ""
    }
    if (certificatePublishTime > newDate) {
      wx.showToast({
        title: "发证时间不能大于当前时间",
        icon: 'none',
        duration: 3000
      })
    } else {
      if (certificatePublishTime > expirationTime) {
        wx.showToast({
          title: "发证时间大能小于有效时间",
          icon: 'none',
          duration: 3000
        })
      } else {
        wx.request({
          url: app.globalData.apiUrl + '/certificate',
          method: "PUT",
          header: {
            'Content-Type': 'application/json',
            'Authorization': wx.getStorageSync('server_token')
          },
          data: {
            "certificateId": thank.certificateId,
            "certificateName": thank.certificateName,
            "certificatePublishTime": certificatePublishTime,
            "certificateType": 'SKILL',
            "rank": thank.certificateGrade,
            "expirationTime": expirationTime,
            "confirmUserId": thank.passId,
            "certificateNumber": thank.certificateNumber,
            "extInfo": {
              "description": thank.description
            }
          },
          success: function (res) {
            switch (res.data.errorCode) {
              case '200':
                wx.navigateBack({});
                wx.showToast({
                  title: "修改成功",
                  icon: 'none',
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
              title: res.data.data.errorMsg,
              icon: 'none',
              duration: 3000
            })
          }
        })
      }
    }
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