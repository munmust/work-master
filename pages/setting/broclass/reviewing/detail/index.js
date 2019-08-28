// pages/home/reviewing/detail/index.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryBean:[],
  },

  cancel: function() {

    var that = this;

    //开发测试
    console.log(that.data.queryBean.localeApplyId);

    wx.showModal({

      title: '警告',
      content: '确定要取消申请吗?',
      success(res) {

        if (res.confirm) {

          wx.request({
            url: app.globalData.apiUrl + '/localeapply/applyuser',

            method: 'PUT',

            data: {
              localeApplyId: that.data.queryBean.localeApplyId,
              status: 'CANCEL'
            },

            header: {
              'Authorization': app.globalData.token,
              'Content-Type': 'application/x-www-form-urlencoded'
            },

            success: function (res) {

              //开发测试
              console.log('用户取消场地申请传回的数据');
              console.log(res.data);

              switch (res.data.errorCode) {
                case "200":
                  wx.showModal({
                    title: '提示',
                    content: '取消成功',
                    showCancel: false,
                    success(res) {
                      if(res.confirm){
                        wx.navigateBack({
                          delta:2
                        })
                      }
                    }
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
          })

        }

      }

    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    var queryBean = JSON.parse(options.queryBean)
    that.setData({
      queryBean:queryBean
    })

    //开发测试
    //console.log(that.data.queryBean)
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