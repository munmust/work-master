// pages/setting/certificate/Qcertificate/create/index.js
var util = require('../../../../../utils/newutil.js');
var check = require('../../../../../utils/checkutil.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    certificateName: '', //证书名称
    certificateUnit: '', //发证单位
    certificateGrade: '', //证书等级
    certificateNumber: '', //证书编号
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
    certificateType: 'Normal', //证书类型
    certificateStart: '2000-01', //时间选择最早时间
    certificateTime: '', //发证时间
    teacherSubject: '', //任教学科
    teacherLevel: '幼儿园教师资格证', //教师资格证资格
    description: '', //详情
    teacher: false, //判断显示
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var now = new Date();

    /*
      初始化证书时间
    */

    that.setData({
      certificateTime: util.getYM(now),
    });
  },

  /*
    input框数据
  */

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
      case 'description':
        this.setData({
          description: e.detail.value
        });
        break;
      default:
        break;
    }
  },
  /*
    修改发证时间
  */
  changeCertificateTime: function (e) {
    this.setData({
      'certificateTime': e.detail.value,
    });
  },
  /*
  判断中文和英文
*/
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
  /*
    提交创建
  */
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
            if (thank.certificateGrade != "" && !that.checkCEN(thank.certificateGrade)) {
              wx.showToast({
                title: '证书等级不能有特殊字符',
                icon: 'none',
                duration: 3000
              })
            } else {
              if (thank.description == "") {
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
            if (thank.description == "") {
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
    let certificateTimes = thank.certificateTime.split("-");
    var certificatePublishTime = new Date(certificateTimes[0], certificateTimes[1] - 1);
    wx.request({
      url: app.globalData.apiUrl + '/certificate',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        "certificateName": thank.certificateName,
        "certificatePublishTime": certificatePublishTime.getTime(),
        "certificateType": "QUALIFICATIONS",
        "rank": thank.certificateGrade,
        "certificateNumber": thank.certificateNumber,
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
  onReady: function () {},


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