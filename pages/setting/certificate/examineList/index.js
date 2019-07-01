const app = getApp()
Page({
  data: {
    stuId: '',
    current: 'tab1',
    currents: 'tabs1',
    notPass: true,
    certificateType: '',
    Q: true,
    S: false,
    C: false,
    CET: false,
    listData: [],
    QList: [],
    SList: [],
    CList: [],
    CETList: [],
    certificateOkList: [],
    actionSheetItems: ['申请详情', '修改申请'],
    certificateType: '',
    teamId: ''
  },

  toDetail: function (e) {
    let that = this;
    const certificateId = e.target.id;
    that.setData({
      certificateId: certificateId
    })
    wx.request({
      url: app.globalData.apiUrl + '/certificate',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        certificateId: that.data.certificateId
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case '200':
            if (res.data.data.certificateType === "COMPETITION") {
              that.setData({
                teamId: res.data.data.teamId
              })
            }
            that.setData({
              certificateType: res.data.data.certificateType

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
          title: '出现失错误，请重试',
          icon: 'none',
          duration: 3000
        })
      }
    });
    wx.showActionSheet({
      itemList: that.data.actionSheetItems,
      itemColor: '#000000',

      success: function (res) {
        /**
         * 0,详情
         * 2，修改
         * 3，删除
         */
        switch (res.tapIndex) {
          case 0:
            switch (that.data.certificateType) {
              case 'QUALIFICATIONS':
                wx.navigateTo({
                  url: '../Qcertificate/certificateDetail/detail/index?certificateId=' + certificateId + '&passId=' + ""
                })
                break;
              case 'SKILL':
                wx.navigateTo({
                  url: '../Scertificate/certificateDetail/detail/index?certificateId=' + certificateId + '&passId=' + ""
                })
                break;
              case 'COMPETITION':
                wx.navigateTo({
                  url: '../Ccertificate/certificateDetail/detail/index?certificateId=' + certificateId + '&passId=' + ""
                })
                break;
              case 'CET_4_6':
                wx.navigateTo({
                  url: '../CET/certificateDetail/detail/index?certificateId=' + certificateId + '&passId=' + ""
                })
                break;
              default:
                break;
            }
            break;
          case 1:
            switch (that.data.certificateType) {
              case 'QUALIFICATIONS':
                wx.navigateTo({
                  url: '../Qcertificate/certificateDetail/update/index?certificateId=' + certificateId + '&passId=' + app.globalData.stuId
                })
                break;
              case 'SKILL':
                wx.navigateTo({
                  url: '../Scertificate/certificateDetail/update/index?certificateId=' + certificateId + '&passId=' + app.globalData.stuId
                })
                break;
              case 'COMPETITION':
                wx.navigateTo({
                  url: '../Ccertificate/certificateDetail/update/index?certificateId=' + certificateId + '&passId=' + app.globalData.stuId
                })
                break;
              case 'CET_4_6':
                wx.navigateTo({
                  url: '../CET/certificateDetail/update/index?certificateId=' + certificateId + '&passId=' + app.globalData.stuId
                })
                break;
              default:
                break;
            }
            break;
          case 2:
            that.toDelete();
            break;
          default:
            break;
        }
      }
    })
  },
  toDelete: function () {
    var that = this;
    if (that.data.certificateType === "Com") {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定删除证书记录？',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.apiUrl + '/certificate',
              method: 'DELETE',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('server_token')
              },
              data: {
                "certificateId": that.data.certificateId,
                "certificateType": that.data.certificateType,
                "teamId": that.data.teamId
              },
              success: function (res) {
                wx.showToast({
                  title: '删除记录成功',
                  icon: 'success',
                  duration: 3000
                })
                that.request();
              },
              fail: function (error) {
                wx.showToast({
                  title: '出现错误，请重试',
                  icon: 'none',
                  duration: 3000
                })
              }
            })
          } else if (res.cancel) {

          }
        }
      })
    } else {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定删除证书记录？',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.apiUrl + '/certificate',
              method: 'DELETE',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('server_token')
              },
              data: {
                "certificateId": that.data.certificateId,
                "certificateType": that.data.certificateType,

              },
              success: function (res) {
                wx.showToast({
                  title: '删除记录成功',
                  icon: 'success',
                  duration: 3000
                })
                that.request();
              },
              fail: function (error) {
                wx.showToast({
                  title: '出现错误，请重试',
                  icon: 'none',
                  duration: 3000
                })
              }
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  },
  onLoad: function (options) {
    var stuId = options.stuId
    this.getList(stuId);
    this.setData({
      stuId: stuId
    })
  },
  onChange(e) {
    if (e.detail.key === "tab1") {
      this.setData({
        current: e.detail.key,
        notPass: true
      })
    } else {
      this.setData({
        current: e.detail.key,
        notPass: false
      })
    }

  },
  onChanges(e) {
    if (e.detail.key === "tabs1") {
      this.setData({
        currents: e.detail.key,
        Q: true,
        S: false,
        C: false,
        CET: false,
      })
    } else if (e.detail.key === "tabs2") {
      this.setData({
        currents: e.detail.key,
        Q: false,
        S: true,
        C: false,
        CET: false,
      })
    } else if (e.detail.key === "tabs3") {
      this.setData({
        currents: e.detail.key,
        Q: false,
        S: false,
        C: true,
        CET: false,
      })
    } else {
      this.setData({
        currents: e.detail.key,
        Q: false,
        S: false,
        C: false,
        CET: true,
      })
    }
  },

  getList: function (stuId) {
    var that = this
    wx.request({
      url: app.globalData.apiUrl + '/certificateStamp/certificates',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        stuId: stuId
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            let ok = [],
              notok = [],
              Q = [],
              S = [],
              C = [],
              CET = [];
            let all = res.data.data;
            for (let i = 0; i < all.length; i++) {
              if (all[i].status === "UNREVIEWED") {
                notok.push(all[i])
              } else {
                ok.push(all[i])
              }
            }
            for (let i = 0; i < notok.length; i++) {
              if (notok[i].certificateType === "CET_4_6") {
                CET.push(notok[i])
              } else if (notok[i].certificateType === "QUALIFICATIONS") {
                Q.push(notok[i]);
              } else if (notok[i].certificateType === "SKILL") {
                S.push(notok[i]);
              } else {
                C.push(notok[i])
              }
            }
            that.setData({
              QList: Q,
              SList: S,
              CList: C,
              CETList: CET,
              certificateOkList: ok
            })
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function () {
        app.warning('服务器错误')
      }
    })
  },
  toExamineQ: function (e) {
    var that = this;
    var data = e.currentTarget.id;
    wx.navigateTo({
      url: '../Qcertificate/certificateDetail/detail/index?certificateId=' + data + '&passId=' + app.globalData.stuId
    })
  },
  toExamineS: function (e) {
    var that = this;
    var data = e.currentTarget.id;
    wx.navigateTo({
      url: '../Scertificate/certificateDetail/detail/index?certificateId=' + data + '&passId=' + app.globalData.stuId
    })
  },
  toExamineC: function (e) {
    var that = this;
    var data = e.currentTarget.id;
    wx.navigateTo({
      url: '../Ccertificate/certificateDetail/detail/index?certificateId=' + data + '&passId=' + app.globalData.stuId
    })
  },
  toExamineCET: function (e) {
    var that = this;
    var data = e.currentTarget.id;
    wx.navigateTo({
      url: '../CET/certificateDetail/detail/index?certificateId=' + data + '&passId=' + app.globalData.stuId
    })
  },

  onShow: function () {
    this.getList(this.data.stuId);
  },
})