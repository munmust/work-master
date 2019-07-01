// pages/setting/certificate/Scertificate/certificateDetail/index/index.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certificateList: [],
    actionSheetItems: ['申请详情', '修改申请', '删除申请'],
    certificateId: ''
  },
  toChange: function (e) {
    let that = this;
    const certificateId = e.target.id;
    that.setData({
      certificateId: certificateId
    })
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
            wx.navigateTo({
              url: '../detail/index?certificateId=' + certificateId + '&passId=' + ""
            })
            break;
          case 1:
            wx.navigateTo({
              url: '../update/index?certificateId=' + certificateId + '&passId=' + ""
            })
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
  request: function () {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/certificate/certificates',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        certificateType: 'SKILL'
      },
      success: function (res) {
        let data = res.data.data;

        let certificateList = data;
        certificateList.forEach((item) => {
          if (item.status == "UNREVIEWED") {
            item.status = "待审核";
            item.ok = false;
          } else {
            item.status = "已审核";
            item.ok = true;
          }
        });
        that.setData({
          certificateList: certificateList
        })
      },
      fail: function (error) {}
    })
  },
  toDelete: function () {
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
              certificateId: that.data.certificateId,
              certificateType: 'SKILL',
            },
            success: function (res) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 3000
              })
              that.request();
            },
            fail: function (error) {
              wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 3000
              })
            }
          })
        } else if (res.cancel) {

        }
      }
    })

  },
  toDetail: function (e) {
    let certificateId = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/index?certificateId=' + certificateId + '&passId=' + ""
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.request();
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