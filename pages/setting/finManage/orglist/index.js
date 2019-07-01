var app = getApp();
Page({

  data: {
    association: [],
    config: {
      animation: true, // 过渡动画是否开启
      search: true, // 是否开启搜索
      searchHeight: 45, // 搜索条高度
      suctionTop: false // 是否开启标题吸顶
    }
  },
  onLoad() {
    var that=this;

    wx.request({
      url: app.globalData.apiUrl + '/organization/all',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            var map = {},
              dest = [];
            for (var i = 0; i < res.data.data.length; i++) {
              var ai = res.data.data[i];
              if (!map[ai.firstAlpha]) {
                dest.push({
                  title: ai.firstAlpha,
                  item: [ai]
                });
                map[ai.firstAlpha] = ai;
              } else {
                for (var j = 0; j < dest.length; j++) {
                  var dj = dest[j];
                  if (dj.firstAlpha == ai.firstAlpha) {
                    dj.data.push(ai);
                    break;
                  }
                }
              }
            }
            that.setData({
              association: dest
            })
            
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


  },
  bindtap(e) {
    var jsonStr = JSON.stringify(e.detail);
    wx.navigateTo({
      url: '../manager/index?message=' + jsonStr
    });
  },

})