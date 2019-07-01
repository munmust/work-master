var app = getApp();
Page({
  data:{
    title: '',
    money: '',
    content: '',
    remark: '',
    financeMessageId:null
  },
  onLoad: function (options){
    var that = this;
    var mess = JSON.parse(options.mes);
    var detail = JSON.parse(options.org);
    that.setData({ 
      financeMessageId: mess.financeMessageId,
      title: mess.financeName,
      money: mess.budget,
      content: mess.financeInfo,
      remark: mess.remark,
      detail:detail
    });
  },
  submit: function () {
    var that = this;
    if ((that.data.show == true && (that.data.title == '' || that.data.money == '' || that.data.content == '')) || (that.data.show == false && that.data.money == '')) {
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none',
        duration: 1000
      })
    } else {
      var myreg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      if (!myreg.test(that.data.money)) {
        wx.showToast({
          title: '请输入正确的数字(不超过两位小数)',
          icon: 'none',
          duration: 1000
        })
      } else {
        wx.request({
          url: app.globalData.apiUrl + '/finance/budget',
          method: 'PUT',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': wx.getStorageSync('server_token')
          },
          data: {
            financeMessageId: that.data.financeMessageId,
            financeName: that.data.title,
            budget: that.data.money,
            financeInfo: that.data.content,
            remark: that.data.remark
          },
          success: function (res) {

            switch (res.data.errorCode) {
              case "200":
                wx.redirectTo({
                  url: '../manager/index?message=' + JSON.stringify(that.data.detail)
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
    }
  },
  input: function (e) {
    var that = this;
    var which = e.currentTarget.dataset.name;
    var value = e.detail.value;
    switch (which) {
      case 'title':
        that.data.title = value;
        break;
      case 'money':
        that.data.money = value;
        break;
      case 'content':
        that.data.content = value;
        break;
      case 'remark':
        that.data.remark = value;
        break;
    }
  },
})