//函数列表
//onLaunch  小程序启动时调用
//getCode   获取用户code
//getOpenID 获取用户openID
//warning   仅为了缩减代码量

App({
  globalData: {
    code:     null,
    userId:   null,
    userName: null
  },

  onLaunch: function () {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    var that=this;
    wx.login({
      success:function(res){
        that.globalData.code=res.code;
      }
    })
  },
  warning:function(address,content){
    wx.showModal({ 
      title: '警告:'+address,
      content: ''+content, 
      showCancel: false 
    });
  }

})