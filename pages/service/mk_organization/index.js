// pages/service/mk_school/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    host: '',
    array: ['请选择学期', '2017-2018 第一学期', '2017-2018 第二学期', '2018-2019 第一学期', '2018-2019 第二学期'],
    index:0,
    extra: '',
    creating: false,
    modalHidden: true
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


  // 设置学期
  bindTermChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  // 创建活动
  createTask: function () {
    var that = this;
    var data = this.data;

    wx.showToast({
      title: '新建中',
      icon: 'loading',
      duration: 10000
    });

    wx.request({
      url: '',
      data: {
        name: data.name,
        host: data.host,
        time: data.array[data.index],
        extra: data.extra
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        // success

        wx.hideToast();

        wx.navigateTo({
          url: '/pages/',
          success: function (res) {
            // success
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  submit: function () {
    var data = this.data;
    console.log(data);

    var that = this;
    var creating = this.data.creating;

    if (data.name == '' || data.host == '' || data.index == 0 || data.extra == '') {
      this.setData({
        modalHidden: false
      });
    } else {
      if (!creating) {
        this.setData({
          'creating': true
        });
        that.createTask();
      }
    }

  },
  // 隐藏提示弹层
  modalChange: function (e) {
    this.setData({
      modalHidden: true
    })
  },
  onValueChange: function ({ detail }) {
    var data = this.data;
    console.log(detail);
    var dataset = detail;
    switch (dataset.type) {
      case 'name':
        data.name = dataset.value;
        break;
      case 'host':
        data.host = dataset.value;
        break;
      case 'extra':
        data.extra = dataset.value;
        break;
    }
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