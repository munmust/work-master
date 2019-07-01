// pages/setting/certificate/Qcertificate/certificateDetail/update/index.js
let app = getApp();
var util = require("../../../../../../utils/newutil.js");
var check = require('../../../../../../utils/checkutil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certificateName: '', //证书名称
    certificateUnit: '', //发证单位
    certificateGrade: '', //证书等级
    certificateNumber: '', //证书编号
    certificateType: 'Normal', //证书类型
    certificateStart: '2000-01', //时间选择最早时间
    typeIndex: 0,
    gradeIndex: 0,
    gradeArray: [
      '幼儿园教师资格证',
      '小学教师资格证',
      '初级中学教师资格证',
      '高级中学教师资格证',
      '中等职业学校教师资格证',
      '中等职业学校实习指导教师资格证',
      '高等学校教师资格证',
      '成人/大学教育的教师资格证'
    ],
    typeArray: ['常规证书',
      '教师资格证',
      'ACCA/CFA'
    ], //类型选择
    certificateTime: '', //发证时间
    teacherSubject: '', //任教学科
    teacherLevel: '幼儿园教师资格证', //教师资格证资格
    description: '', //详情
    teacher: false,
    passId: '',
    isPass: false //判断显示                         //判断显示
  },
  bindTypeChange(e) {
    var that = this;
    switch (e.detail.value) {
      case '0':
        that.setData({
          typeIndex: e.detail.value,
          certificateType: 'Normal',
          teacherLevel: "",
          teacherSubject: "",
          teacher: false
        })
        break;
      case '1':
        that.setData({
          typeIndex: e.detail.value,
          certificateType: 'Teacher',
          teacher: true
        })
        break;
      case '2':
        that.setData({
          typeIndex: e.detail.value,
          certificateType: "International",
          teacherLevel: "",
          teacherSubject: "",
          teacher: false
        })
        break;
    }
  },
  bindGradeChange: function (e) {
    var that = this;
    switch (e.detail.value) {
      case '0':
        that.setData({
          gradeIndex: e.detail.value,
          teacherLevel: '幼儿园教师资格证',
        })
        break;
      case '1':
        that.setData({
          gradeIndex: e.detail.value,
          teacherLevel: '小学教师资格证',
        })
        break;
      case '2':
        that.setData({
          gradeIndex: e.detail.value,
          teacherLevel: '初级中学教师资格证',
        })
      case '3':
        that.setData({
          gradeIndex: e.detail.value,
          teacherLevel: '高级中学教师资格证',
        })
        break;
      case '4':
        that.setData({
          gradeIndex: e.detail.value,
          teacherLevel: '中等职业学校教师资格证',
        })
        break;
      case '5':
        that.setData({
          gradeIndex: e.detail.value,
          teacherLevel: '中等职业学校实习指导教师资格证',
        })
        break;
      case '6':
        that.setData({
          gradeIndex: e.detail.value,
          teacherLevel: '高等学校教师资格证',
        })
        break;
      case '7':
        that.setData({
          gradeIndex: e.detail.value,
          teacherLevel: '成人/大学教育的教师资格证',
        })
        break;
    }
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
      case 'certificateUnit':
        that.setData({
          certificateUnit: e.detail.value
        })
        break;
      case 'certificateGrade':
        this.setData({
          certificateGrade: e.detail.value
        })
        break;
      case 'certificateNumber':
        this.setData({
          certificateNumber: e.detail.value
        })
        break;
      case 'teacherSubject':
        this.setData({
          teacherSubject: e.detail.value
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
            const type = res.data.data.type;
            const level = res.data.data.extInfo.teacherLevel;
            switch (res.data.data.type) {
              case 'Normal':
                that.setData({
                  typeIndex: 0
                })
                break;
              case 'Teacher':
                that.setData({
                  typeIndex: 1
                })
                break;
              default:
                that.setData({
                  typeIndex: 2
                })
                break;
            }
            if (type == "Teacher") {
              that.setData({
                teacher: true,
                certificateTypeValue: "教师资格证",
                teacherLevel: res.data.data.extInfo.teacherLevel,
                teacherSubject: res.data.data.extInfo.teacherSubject,
              });
              for (let i = 0; i < that.data.gradeArray.length; i++) {
                if (that.data.gradeArray[i] == res.data.data.extInfo.teacherLevel) {
                  that.setData({
                    gradeIndex: i
                  })
                }
              }
            } else if (type == "International") {
              that.setData({
                teacher: false,
                certificateTypeValue: "ACCA/CFA",
              })
            } else {
              that.setData({
                teacher: false,
                certificateTypeValue: "常规证书",
              })
            }
            const time = res.data.data.certificatePublishTime;
            let date = util.getYM(new Date(time));
            that.setData({
              certificateId: res.data.data.certificateId,
              certificateName: res.data.data.certificateName,
              certificateNumber: res.data.data.certificateNumber,
              certificateUnit: res.data.data.certificateOrganization,
              certificateType: res.data.data.type,
              certificateGrade: res.data.data.rank,
              certificateTime: date,
              description: res.data.data.extInfo.description
            })
            break;
          default:
            wx.redirectTo({
              url: '../index/index'
            })
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
        wx.redirectTo({
          url: '../index/index',
        });

      }
    });
  },
  /*
  判断中文和英文
  */
  // checkCE: function (str) {
  //   let reg = /^[\u4e00-\u9fa5_a-zA-Z]+$/;
  //   return reg.test(str);
  // },
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
  // checkCEN: function (str) {
  //   let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
  //   return reg.test(str)
  // },
  toSubmit: function () {
    var that = this;
    var thank = this.data;
    if (thank.certificateType != 'Teacher') {
      that.setData({
        teacherLevel: "",
        teacherSubject: ""
      })
    }
    /*
      必填信息验证
    */
    if (thank.certificateName == "" || thank.certificateUnit == "" || !check.checkCEN(thank.certificateName) || !check.checkCEN(thank.certificateUnit)) {
      wx.showToast({
        title: '必填信息不能为空和出现特殊字符',
        icon: 'none',
        duration: 3000
      })
    } else {
      /*
        如果是教师资格证
      */
      if (thank.certificateType == 'Teacher') {
        /*
          任教学科为空或者有特殊字符
        */
        if (thank.teacherSubject == "" || !check.checkCEN(thank.teacherSubject)) {
          wx.showToast({
            title: '任教学科不能为空或出现特殊字符',
            icon: 'none',
            duration: 3000
          })
        } else {
          /*
            输入了证书编号的验证
          */
          if (thank.certificateNumber != "" && !that.checkEN(thank.certificateNumber)) {
            wx.showToast({
              title: '证书编号不能出现#以外的特殊字符',
              icon: 'none',
              duration: 3000
            })
          } else {
            /*
              输入了证书等级的验证
            */
            if (thank.certificateGrade != "" && !check.checkCEN(thank.certificateGrade)) {
              wx.showToast({
                title: '证书等级不能有特殊字符',
                icon: 'none',
                duration: 3000
              })
            } else {
              if (thank.description === "") {
                wx.showToast({
                  title: "证书详情不能为空",
                  icon: "none"
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

      } else {
        /*
        输入了证书编号的验证
      */
        if (thank.certificateNumber != "" && !that.checkEN(thank.certificateNumber)) {
          wx.showToast({
            title: '证书编号不能出现#以外的特殊字符',
            icon: 'none',
            duration: 3000
          })
        } else {
          /*
            输入了证书等级的验证
          */
          if (thank.certificateGrade != "" && !check.checkCEN(thank.certificateGrade)) {
            wx.showToast({
              title: '证书等级不能有特殊字符',
              icon: 'none',
              duration: 3000
            })
          } else {
            if (thank.description === "") {
              wx.showToast({
                title: "证书详情不能为空",
                icon: "none"
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
  submitRequest: function () {
    var that = this;
    var thank = this.data;
    let certificateTimes = thank.certificateTime.split("-");
    var certificatePublishTime = new Date(certificateTimes[0], certificateTimes[1] - 1);
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
        "certificatePublishTime": certificatePublishTime.getTime(),
        "certificateType": "QUALIFICATIONS",
        "rank": thank.certificateGrade,
        "certificateOrganization": thank.certificateUnit,
        "type": thank.certificateType,
        "extInfo": {
          "description": thank.description,
          "teacherLevel": thank.teacherLevel,
          "teacherSubject": thank.teacherSubject
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
    var that = this;
    var thank = this.data;
    let certificateTimes = thank.certificateTime.split("-");
    var certificatePublishTime = new Date(certificateTimes[0], certificateTimes[1] - 1);
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
        "certificatePublishTime": certificatePublishTime.getTime(),
        "certificateType": "QUALIFICATIONS",
        "rank": thank.certificateGrade,
        "certificateNumber": thank.passId,
        "certificateOrganization": thank.certificateUnit,
        "confirmUserId": thank.passId,
        "type": thank.certificateType,
        "extInfo": {
          "description": thank.description,
          "teacherLevel": thank.teacherLevel,
          "teacherSubject": thank.teacherSubject
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