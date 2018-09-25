// pages/service/act_volunteer/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.showVolunteerAct();
  },


  showVolunteerAct: function () {
    var that = this;
    wx.request({
      url: 'https://hupanyouth.cn/lv/common/useractivity/search',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: { stuId: app.globalData.stuId },
      success: (res) => {
        if (res.data.code == 200) {
          //成功获取数据，则更新data和视图。
          that.data.listData = res.data.data.aclist;
          that.setData({ listData: res.data.data.aclist });
        } else if (res.data.code == 400) {
          app.warning('mySeal', '获取失败');
        }
      },
      fail: function () {
        app.warning('mySeal', '服务器错误');
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