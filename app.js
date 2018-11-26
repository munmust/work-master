//函数列表
//onLunch 小程序初始化监听函数
//getCode 获取code并执行callback
//warning 弹窗提示（为了缩减代码，用一个函数调用代替wx.showModal）
//getDateStrByTimeStr 将后台传入的数据库字符串转换为“-年-月-日-时-分”的字符串
App({
  globalData: {
    role:     null,
    code:     null,
    stuId:    null,
    stuName:  null,
    apiUrl:   'https://hupanyouth.cn/secondclass-1.0.1'
  },

  onLaunch: function () {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getCode:function(callback){
    wx.login({
      success: function (res) {
        callback(res.code);
      }
    })
  },

  warning:function(content){
    wx.showModal({ 
      content: ''+content, 
      showCancel: false 
    });
  },

  getDateStrByTimeStr:function(time){
    var dateTime = new Date(time);
    var dateStr = '';
    dateStr += dateTime.getFullYear() + '年';
    dateStr += (dateTime.getMonth()+1) + '月';
    dateStr += dateTime.getDate() + '日';
    dateStr += dateTime.getHours() + '时';
    dateStr += dateTime.getMinutes() + '分';
    return dateStr;
  }

})