// pages/home/search/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    all_data: []
  },

  toReviewing: function () {
    wx.navigateTo({
      url: '../reviewing/index/index',
    })
  },

  toSucceed: function () {
    wx.navigateTo({
      url: '../succeed/index/index',
    })
  },

  toCancel: function () {
    wx.navigateTo({
      url: '../cancel/index/index',
    })
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
    var that = this;

    wx.request({
      url: app.globalData.apiUrl + '/localeapply/applyuser',

      method: 'GET',

      data: {

        limit: '999999999'
      },

      header: {
        'Authorization': wx.getStorageSync('server_token'),
      },

      success: function (res) {

        //开发测试
        console.log('查询场地传回的数据', res.data.data.content);

        switch (res.data.errorCode) {
          case "200":

            that.setData({
              all_data: res.data.data.content
            });

            //开发测试
            // console.log('页面存储的数据');
            // console.log(that.data.all_data);

            var reviewing_data = [];
            var succeed_data = [];
            var cancel_data = [];
            var k = 0;
            var m = 0;
            var n = 0;
            for (var i = 0 ; i < that.data.all_data.length ; i++) {

              if (that.data.all_data[i].status == 'COMMIT' || that.data.all_data[i].status == 'FIRST') {
                reviewing_data[k] = that.data.all_data[i];
                k++;
              } else if (that.data.all_data[i].status == 'PASS') {
                succeed_data[m] = that.data.all_data[i];
                m++;
              } else {
                cancel_data[n] = that.data.all_data[i];
                n++;
              }
            }

            wx.setStorage({
              key: 'reviewing_data',
              data: reviewing_data,
            });

            wx.setStorage({
              key: 'succeed_data',
              data: succeed_data,
            });

            wx.setStorage({
              key: 'cancel_data',
              data: cancel_data,
            });

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