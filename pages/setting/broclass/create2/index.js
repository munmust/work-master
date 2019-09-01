// pages/home/create2/index.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //时间段
    time_bucket: '',
    choose_time: '请选择时间段',

    //场地信息
    time_date: '',
    locale_id: '',
    status: 'SUBMITING'
  },

  //获取可用时间段
  bindPickerChange: function (e) {

    let choose_time = this.data.time_bucket[e.detail.value];

    this.setData({
      choose_time: choose_time
    })

    //开发测试
    console.log('用户选择的时间段为',this.data.choose_time);

  },


  submit: function () {

    if (this.data.choose_time == '请选择时间段') {
      app.warning('请选择时间段!');
    } else {
      //开发测试
      console.log('create2页面submit时locale_id的值为',this.data.locale_id);
      console.log('create2页面传递的用户选择的时间段的值为',this.data.choose_time);

      wx.setStorage({
        key: 'choose_time',
        data: this.data.choose_time
      })

      wx.request({

        url: app.globalData.apiUrl + '/localearea/occupy',

        method: 'POST',

        data: {
          timeDate: this.data.time_date,
          timeBucket: this.data.choose_time,
          status: this.data.status,
          localeId: this.data.locale_id
        },

        header: {
          'Authorization': wx.getStorageSync('server_token'),
          'content-type': 'application/x-www-form-urlencoded'
        },

        success: function (res) {

          //开发测试
          console.log('占用场地传回的数据');
          console.log(res.data);

          switch (res.data.errorCode) {
            case "200":

              wx.setStorage({
                key: 'locale_area_id',
                data: res.data.data.localeAreaId,
              })

              //页面跳转
              wx.navigateTo({
                url: '../form/index'
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

      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //开发测试
    // console.log('create2页面onLoad');

    let time_bucket = wx.getStorageSync('time_bucket');
    let locale_id = wx.getStorageSync('choosed_locale_id');
    let time_date = wx.getStorageSync('time_date');

    this.setData({
      time_bucket: time_bucket,
      locale_id: locale_id,
      time_date: time_date
    })

    // console.log('create2接收到的可用时间段为',this.data.time_bucket);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    //开发测试
    // console.log('create2页面onReady');

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //开发测试
    // console.log('create2页面onShow');
    

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    //开发测试
    // console.log('create2页面onHide');

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    //开发测试
    // console.log('create2页面onUnload');

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
