// pages/setting/certificate/Ccertificate/certificateDetail/detail/index.js
var app = getApp();
var util = require("../../../../../../utils/newutil.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    certificateId: '',        
    certificateName: '',         
    certificateGrade: '',          
    certificateType: '',
    certificateTime: '',
    isTeam: false,
    TeamName: '',
    workerOne: false,
    workerTwo: false,
    workerThree: false,
    workerFour: false,
    workOne: '',
    workTwo: '',
    workThree: '',
    workFour: '',
    teacherTwo: true,
    teacherOne: true,
    teacherOneNumber: '',
    teacherOneName: '',
    teacherTwoNumber: '',
    teacherTwoName: '',
    description: '',
    passId: '',
    passBtn: false
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
        passBtn: true
      })
    }
    /**
     *获取证书详情 
     */
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
                workerOne: true,
                workerTwo: true,
                workOne: works[0],
                workTwo: works[1]
              })
            } else if (works.length == 3) {
              that.setData({
                workerOne: true,
                workerTwo: true,
                workerThree: true,
                workOne: works[0],
                workTwo: works[1],
                workThree: works[2]
              })
            } else if (works.length == 4) {
              that.setData({
                workerOne: true,
                workerTwo: true,
                workerThree: true,
                workerFour: true,
                workOne: works[0],
                workTwo: works[1],
                workThree: works[2],
                workFour: works[3]
              })
            }
            if (data.teamName != "") {
              that.setData({
                isTeam: true,
                TeamName: data.teamName,
                certificateType: '团队竞赛'
              })
            } else {
              that.setData({
                isTeam: false,
                TeamName: '',
                certificateType: '个人竞赛'
              })
            }
            if (data.teacher[0].teacherOneNumber == "") {
              that.setData({
                teacherOne: false
              })
            }
            if (data.teacher[1].teacherTwoNumber == "") {
              that.setData({
                teacherTwo: false
              })
            }
            that.setData({
              certificateId: data.certificateId,
              certificateName: data.competitionName,
              certificateGrade: data.rank,
              teacherOneNumber: data.teacher[0].teacherOneNumber,
              teacherOneName: data.teacher[0].teacherOneName,
              teacherTwoNumber: data.teacher[1].teacherTwoNumber,
              teacherTwoName: data.teacher[1].teacherTwoName,
              description: data.extInfo.description,
              certificateTime: date
            });
            break;
          default:
            wx.showToast({
              title: res.data.errorMsg,
              icon: "none",
              duration: 3000
            })
            break;
        }

      },
      fail: function () {

      }
    });
  },
/**
 * 证书审核
 */
  toPass: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定通过该证书？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.apiUrl + '/certificateStamp',
            method: 'PUT',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': wx.getStorageSync('server_token')
            },
            data: {
              certificateId: that.data.certificateId,
              certificateType: "COMPETITION"
            },
            success: function (res) {
              switch (res.data.errorCode) {
                case '200':
                  wx.navigateBack({});
                  wx.showToast({
                    title: "通过成功",
                    icon: "success",
                    duration: 3000
                  })
                  break;

                default:
                  wx.showToast({
                    title: res.data.errorMsg,
                    icon: "none",
                    duration: 3000
                  })
                  break;
              }

            },
            fail: function () {
              wx.showToast({
                title: res.data.errorMsg,
                icon: "none",
                duration: 3000
              })
            }
          })
        } else if (res.cancel) {

        }
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