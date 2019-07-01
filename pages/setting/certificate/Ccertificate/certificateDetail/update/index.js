// pages/setting/certificate/Ccertificate/certificateDetail/update/index.js
let app = getApp();
var util = require("../../../../../../utils/newutil.js");
var check = require('../../../../../../utils/checkutil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certificateId: '',
    teamId: '',
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
    description: '',
    passId: '',
    isPass: false,

  },
  bindTypeChange: function (e) {
    var that = this;
    switch (e.detail.value) {
      case '0':
        that.setData({
          typeIndex: e.detail.value,
          Team: false,
          certificateType: 'Personal'
        })
        break;
      case '1':
        that.setData({
          typeIndex: e.detail.value,
          Team: true,
          certificateType: 'Team'
        })
        break;
      default:
        break;
    }
  },
  changeCertificateTime: function (e) {
    this.setData({
      certificateTime: e.detail.value
    })
  },
  input: function (e) {
    let that = this;
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
      case 'certificateName':
        that.setData({
          certificateName: e.detail.value
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
      default:
        break;
    }
  },
  bindTextAreaChange: function (e) {
    this.setData({
      description: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
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
            let workId = data.workUserId;
            let date = util.getYM(new Date(res.data.data.certificatePublishTime));
            let works = [];
            for (let i = 0; i < workId.length; i++) {
              if (workId[i] != "" && workId[i] != app.globalData.stuId) {
                works.push(workId[i]);
              }
            }
            if (works.length == 1) {
              that.setData({
                workerOne: true,
                workOne: works[0]
              })
            } else if (works.length == 2) {
              that.setData({
                workOne: works[0],
                workTwo: works[1]
              })
            } else if (works.length == 3) {
              that.setData({
                workOne: works[0],
                workTwo: works[1],
                workThree: works[2]
              })
            } else if (works.length == 4) {
              that.setData({
                workOne: works[0],
                workTwo: works[1],
                workThree: works[2],
                workFour: works[3]
              })
            }
            if (data.teamName != "") {
              that.setData({
                Team: true,
                TeamName: data.teamName,
                typeIndex: 1,
                certificateType: 'Team'
              })
            } else {
              that.setData({
                Team: false,
                TeamName: '',
                typeIndex: 0,
                certificateType: 'Personal'
              })
            }
            that.setData({
              certificateId: data.certificateId,
              teamId: data.teamId,
              certificateName: data.competitionName,
              certificateTime: date,
              certificateGrade: data.rank,
              teacherOneName: data.teacher[0].teacherOneName,
              teacherOneNumber: data.teacher[0].teacherOneNumber,
              teacherTwoNumber: data.teacher[1].teacherTwoNumber,
              teacherTwoName: data.teacher[1].teacherTwoName,
              description: data.extInfo.description

            })
            break;
          default:
            break;
        }
      },
      fail: function () {
        wx.showToast({
          title: res.data.data.errorMsg,
          icon: 'none',
          duration: 3000
        })
        wx.redirectTo({
          url: '../index/index',
        });
      }
    })
  },
  /**
   * 提交
   */
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
                  if (thank.description == "") {
                    wx.showToast({
                      title: "证书详情不能为空",
                      icon: "none",
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
            if (thank.description == "") {
              wx.showToast({
                title: "证书详情不能为空",
                icon: "none",
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
      }
    }

  },
  /**
   * 提交修改
   */
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
        workTwo: '',
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
      method: "PUT",
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        "certificateId": thank.certificateId,
        "competitionName": thank.certificateName,
        "certificatePublishTime": certificatePublishTime.getTime(),
        "certificateType": "COMPETITION",
        "rank": thank.certificateGrade,
        "teamName": thank.TeamName,
        "workUserId": workers,
        "teacher": teacher,
        "teamId": thank.teamId,
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
          title: '创建失败',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  /**
   * 审核后提交修改
   */
  passRequest: function () {
    var that = this;
    var thank = this.data;
    let stuId = app.globalData.stuId;
    let certificateTimes = thank.certificateTime.split("-");
    var certificatePublishTime = new Date(certificateTimes[0], certificateTimes[1] - 1);
    if (thank.certificateType == "Personal") {
      that.setData({
        TeamName: '',
        workOne: '',
        workTwo: '',
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
      method: "PUT",
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        "certificateId": thank.certificateId,
        "competitionName": thank.certificateName,
        "certificatePublishTime": certificatePublishTime.getTime(),
        "certificateType": "COMPETITION",
        "rank": thank.certificateGrade,
        "teamName": thank.TeamName,
        "confirmUserId": thank.passId,
        "workUserId": workers,
        "teacher": teacher,
        "teamId": thank.teamId,
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