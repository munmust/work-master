// pages/setting/broclass/learningsearch/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  toSucceed: function () {
    wx.request({

      url: app.globalData.apiUrl + '/localeapply/applyadmin',

      method: 'GET',

      data: {
        status: 'FIRST',
        limit: '999999999'
      },

      header: {
        'Authorization': wx.getStorageSync('server_token')
      },

      success: function (res) {

        //开发测试
        console.log('学工查询历史传回的数据', res.data.data.content);

        switch (res.data.errorCode) {
          case "200":
            var succeed_data = res.data.data.content;

            wx.navigateTo({
              url: '../succeed/index/index?succeed_data=' + JSON.stringify(succeed_data),
            })
            break;
          case "400":
            app.warning(res.data.errorMsg);
            break;
          case "401":
            app.warning(res.data.errorMsg);
            break;
          default:
            app.warning(res.data.errorMsg);
            break;
        }
      },
      fail: function (res) {
        app.warning('服务器错误');
      }
    });
  },

  toCancel: function () {
    wx.request({

      url: app.globalData.apiUrl + '/localeapply/applyadmin',

      method: 'GET',

      data: {
        status: 'CANCEL',
        limit: '999999999'
      },

      header: {
        'Authorization': wx.getStorageSync('server_token')
      },

      success: function (res) {

        //开发测试
        console.log('学工查询历史传回的数据', res.data.data.content);

        switch (res.data.errorCode) {
          case "200":
            var cancel_data = res.data.data.content;

            wx.navigateTo({
              url: '../cancel/index/index?cancel_data=' + JSON.stringify(cancel_data),
            })
            break;
          case "400":
            app.warning(res.data.errorMsg);
            break;
          case "401":
            app.warning(res.data.errorMsg);
            break;
          default:
            app.warning(res.data.errorMsg);
            break;
        }
      },
      fail: function (res) {
        app.warning('服务器错误');
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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