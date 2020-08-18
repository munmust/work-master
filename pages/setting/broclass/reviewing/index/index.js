// pages/home/reviewing/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewing_data: [],
  },

  userchoose:function(e){

    var that = this;

    var index = e.currentTarget.dataset.index;

    var queryBean = JSON.stringify(that.data.reviewing_data[index]);

    wx.navigateTo({
      url: '../detail/index?queryBean=' + queryBean ,
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
    let reviewing_data = wx.getStorageSync('reviewing_data');

    if (reviewing_data.length == 0) {
      wx.showModal({
        title: '啊哦!出错了!',
        content: '请先申请场地再来查询呢~',
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

    this.setData({
      reviewing_data: reviewing_data
    });

    //开发测试
    console.log('申请中页面接收到的数据');
    console.log(this.data.reviewing_data);
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