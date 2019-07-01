// pages/setting/borrow/borrowdetail/index/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loanList:[],
    empty: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showLoan();
  },
  showLoan:function(){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl +'/assetLoanRecord/records',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            if (res.data.data.length > 0) {
              that.data.empty = false;
            }
            //更新视图
            res.data.data.map((item)=>{
              if(item.status=="Loading"){
                item.show=true
              }else{
                item.show=false
              }
              if (item.assetType == "Consumable"){
                item.type=true
              }else{
                item.type=false
              }
            });
            that.setData({
              loanList: res.data.data,
              empty: that.data.empty
            });
            break;
          case "401":
            app.warning(res.data.errorCode);
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function () {
        app.warning('服务器错误');
      }
    })
  },

  toDetail:function(e){
      wx.redirectTo({
        url: '../detail/index?id=' + e.currentTarget.id
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