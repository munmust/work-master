var app = getApp();
Page({
  data: {
    detail:null
  },
  onLoad: function (options){
    var jsonStr = options.mes;
    var message = JSON.parse(options.detail);
    var detail = JSON.parse(jsonStr);
    this.setData({ detail: detail ,message:message});
  },
  click:function(e){
    var that=this;
    var btn = e.currentTarget.dataset.btn;
    var obj = {};   //data数据
    switch(btn){
      case '1':
        obj['audite']=false;
        break;
        case '2':
        obj['audite'] = true;
        break;
    }
    obj['financeMessageId'] = that.data.detail.financeMessageId;
    
    wx.request({
      url: app.globalData.apiUrl + '/finance/audite',
      method: 'PUT',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: obj,
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            wx.redirectTo({
              url: '../manager/index?message=' + JSON.stringify(that.data.message)
            });
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function () {
        app.warning('服务器错误')
      }
    })
    
  }
})