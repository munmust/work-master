// pages/home/check1/index.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commit_data: []
  },


  userchoose:function(e){
    var that = this

    var index = e.currentTarget.dataset.index;

    var queryBean = JSON.stringify(that.data.commit_data[index]);

    wx.navigateTo({
      url: '../detail/index?queryBean=' + queryBean,
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

      url: app.globalData.apiUrl + '/localeapply/applyadmin',

      method: 'GET',

      data: {
        status: 'COMMIT',
        limit: '999999999'
      },

      header: {
        'Authorization': wx.getStorageSync('server_token')
      },

      success: function (res) {

        //开发测试
        console.log('学工查询传回的数据', res.data.data.content);

        switch (res.data.errorCode) {
          case "200":
            var commit_data = res.data.data.content;
            that.setData({
              commit_data: commit_data
            });

            if (that.data.commit_data.length == 0) {
              wx.showModal({
                title: '提示',
                content: '当前暂无申请',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    });
                  }
                }
              });
            }
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