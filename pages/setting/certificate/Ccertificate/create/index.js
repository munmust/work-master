// pages/setting/certificate/Ccertificate/create/index.js
var util = require('../../../../../utils/newutil.js');
var check = require('../../../../../utils/checkutil.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certificateName: '',
    certificateGrade: '',
    certificateStart: '2000-01',
    certificateTime: '',
    certificateTypeValue: '个人竞赛',
    certificateType: 'Personal',
    typeIndex: 0,
    typeArray: [
      '个人竞赛',
      '团队竞赛'
    ],
    Team: false,
    TeamName: '',
    workOne: '',
    workTwo: '',
    workThree: '',
    workFour: '',
    teacherOneNumber: '',
    teacherTwoNumber: '',
    teacherOneName: '',
    teacherTwoName: '',
    description: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var now = new Date();
    that.setData({
      certificateTime: util.getYM(now)
    })
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
      case 'TeamName':
        that.setData({
          TeamName: e.detail.value
        })
        break;
      case 'workOne':
        that.setData({
          workOne: e.detail.value
        })
        break;
      case 'workTwo':
        that.setData({
          workTwo: e.detail.value
        })
        break;
      case 'workThree':
        that.setData({
          workThree: e.detail.value
        })
        break;
      case 'workFour':
        that.setData({
          workFour: e.detail.value
        })
        break;
      case 'teacherOneNumber':
        that.setData({
          teacherOneNumber: e.detail.value
        })
        break;
      case 'teacherTwoNumber':
        that.setData({
          teacherTwoNumber: e.detail.value
        })
        break;
      case 'teacherOneName':
        that.setData({
          teacherOneName: e.detail.value
        })
        break;
      case 'teacherTwoName':
        that.setData({
          teacherTwoName: e.detail.value
        })
        break;
      case 'description':
        that.setData({
          description: e.detail.value
        })
        break;
    }
  },
  bindTypeChange: function (e) {
    var that = this;
    switch (e.detail.value) {
      case '0':
        that.setData({
          certificateType: 'Personal',
          typeIndex: 0,
          Team: false
        })
        break;

      default:
        that.setData({
          certificateType: 'Team',
          typeIndex: 1,
          Team: true
        })
        break;
    }
  },
  changeCertificateTime: function (e) {
    this.setData({
      certificateTime: e.detail.value
    })
  },
  toSubmit: function () {
    var that = this;
    var thank = this.data;
    if (thank.certificateName == "" || thank.certificateGrade == "" || !check.checkCEN(thank.certificateGrade) || !check.checkCEN(thank.certificateName)) {
      wx.showToast({
        title: '名称/等级不能为空和出现特殊字符',
        icon: 'none',
        duration: 3000
      })
    } else {
      if (thank.certificateType === 'Team') {
        if (thank.TeamName == "" || thank.workOne == "") {
          wx.showToast({
            title: '队伍名/队员不能为空',
            icon: 'none',
            duration: 3000
          })
        } else {
          if (!check.checkN(thank.workOne)) {
            wx.showToast({
              title: '队员学号只能为数字',
              icon: 'none',
              duration: 3000
            })
          } else {
            let workers = [thank.workOne, thank.workTwo, thank.workThree, thank.workFour];
            workers = workers.filter((item) => {
              if (item != "") {
                return item;
              }
            });
            let isRepeat = false;
            let isMy = false;
            let myId = app.globalData.stuId;
            for (let i = 0; i < workers.length; i++) {
              if (workers[i] == myId) {
                isMy = true;
              } else {
                if (workers[i] == workers[i + 1]) {
                  isRepeat = true;
                }
              }

            }
            if (isRepeat || isMy) {
              wx.showToast({
                title: "队员请勿输入自己的学号或已填写学号",
                icon: "none",
                duration: 3000
              })
            } else {
              if ((thank.teacherOneNumber != "" && thank.teacherOneName == "") || (thank.teacherOneName != "" && thank.teacherOneNumber == "") || (thank.teacherTwoName != "" && thank.teacherTwoNumber == "") || (thank.teacherTwoNumber != "" && thank.teacherTwoName == "")) {
                wx.showToast({
                  title: "指导老师工号或名字不能为空",
                  icon: "none",
                  duration: 3000
                })
              } else {
                if ((thank.teacherOneNumber != "" && !check.checkEN(thank.teacherOneNumber)) || (thank.teacherTwoNumber != "" && !check.checkEN(thank.teacherTwoNumber)) || (thank.teacherOneNumber != "" && !check.checkCEN(thank.teacherOneName)) || (thank.teacherTwoNumber != "" && !check.checkCEN(thank.teacherTwoName))) {
                  wx.showToast({
                    title: "指导老师工号和姓名不能出现特殊字符",
                    icon: "none",
                    duration: 3000
                  })
                } else {
                  if (thank.description === "") {
                    wx.showToast({
                      title: '证书详情不能为空',
                      icon: 'none',
                      duration: 3000
                    })
                  } else {
                    that.submitRequest();
                  }
                }
              }
            }
          }
        }
      } else {
        if ((thank.teacherOneNumber != "" && thank.teacherOneName == "") || (thank.teacherOneName != "" && thank.teacherOneNumber == "") || (thank.teacherTwoName != "" && thank.teacherTwoNumber == "") || (thank.teacherTwoNumber != "" && thank.teacherTwoName == "")) {
          wx.showToast({
            title: "指导老师工号或名字不能为空",
            icon: "none",
            duration: 3000
          })
        } else {
          if ((thank.teacherOneNumber != "" && !check.checkEN(thank.teacherOneNumber)) || (thank.teacherTwoNumber != "" && !check.checkEN(thank.teacherTwoNumber)) || (thank.teacherOneNumber != "" && !check.checkCEN(thank.teacherOneName)) || (thank.teacherTwoNumber != "" && !check.checkCEN(thank.teacherTwoName))) {
            wx.showToast({
              title: "指导老师工号和姓名不能出现特殊字符",
              icon: "none",
              duration: 3000
            })
          } else {
            if (thank.description === "") {
              wx.showToast({
                title: '证书详情不能为空',
                icon: 'none',
                duration: 3000
              })
            } else {
              that.submitRequest();
            }
          }
        }
      }
    }
  },

  submitRequest: function () {
    var that = this;
    var thank = this.data;
    let stuId = app.globalData.stuId;
    let certificateTimes = thank.certificateTime.split("-");
    var certificatePublishTime = new Date(certificateTimes[0], certificateTimes[1] - 1);
    if (thank.certificateType == "Personal") {
      that.setData({
        TeamName: '',
        workOne: '',
        workTow: '',
        workThree: '',
        workFour: ''
      })
    };
    let teacher = [{
      "teacherOneNumber": thank.teacherOneNumber,
      "teacherOneName": thank.teacherOneName,

    }, {
      "teacherTwoNumber": thank.teacherTwoNumber,
      "teacherTwoName": thank.teacherTwoName,
    }];
    let workers = [stuId, thank.workOne, thank.workTwo, thank.workThree, thank.workFour];
    workers = workers.filter((item) => {
      if (item != "") {
        return item;
      }
    })
    wx.request({
      url: app.globalData.apiUrl + '/certificate',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        "competitionName": thank.certificateName,
        "certificatePublishTime": certificatePublishTime.getTime(),
        "certificateType": "COMPETITION",
        "rank": thank.certificateGrade,
        "teamName": thank.TeamName,
        "workUserId": workers,
        "teacher": teacher,
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
              title: '创建成功',
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
          title: '创建失败',
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