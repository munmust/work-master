// pages/home/index/index.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   * 
   */
  data: {
    can_show:true,
    show_view_locale: false,
    show_view_learning: false,
    show_view_league: false,
    role_info: []
  },

  //申请人申请场地
  apply: function() {

    wx.request({

      url: app.globalData.apiUrl + '/locale/locales',

      method: 'GET',

      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },

      data: {
        status: 'USABLE'
      },

      success: function (res) {

        switch (res.data.errorCode) {

          case "200":

            var locale_name = new Array();
            var locale_id = new Array();
            var locale_code = new Array();

            for (var i = 0; i < res.data.data.length; i++) {
              locale_name[i] = res.data.data[i].localeName;
              locale_id[i] = res.data.data[i].localeId;
              locale_code[i] = res.data.data[i].localeCode;
            }

            wx.setStorage({
              key: 'locale_name',
              data: locale_name,
            })

            wx.setStorage({
              key: 'locale_id',
              data: locale_id,
            })

            wx.setStorage({
              key: 'locale_code',
              data: locale_code,
            })

            wx.navigateTo({
              url: '../create1/index'
            })

            break;

          case "401":

            app.warning(res.data.errorMsg);

            break;

          default:

            app.warning(res.data.errorMsg);

            break;
        }
      },


      fail: function () {
        app.warning('服务器错误');
      }

    })

  },

  //申请人查询
  locale_search: function () {
    
    //页面跳转
    wx.navigateTo({
      url: '../search/index',
    })
  },

  //学工
  learning_search: function() {

    //页面跳转
    wx.navigateTo({
      url: '../learningcheck/index/index'
    })

  },

  //团学
  league_search:function(){

    //页面跳转
    wx.navigateTo({
      url: '../leaguecheck/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //角色权限获取
    let role_info = app.globalData.roleInfo;
    this.setData({
      role_info: role_info
      // role_info: "LOCALE_MEMBER"
    });

    //开发测试
    console.log('role_info值为' + this.data.role_info);

    //权限处理
    for (var i = 0; i < this.data.role_info.length; i++) {
      switch(this.data.role_info[i]){
        case"LEARNING_MANAGER":
          this.setData({
            show_view_learning: true
          });
        break;
        case 'LEAGUE_MANAGER':
          this.setData({
            show_view_league: true
          });
          break;
        case 'LOCALE_MEMBER':
          this.setData({
            show_view_locale: true
          });
          break;
        default:
         
          break;
      }
      if (this.data.role_info[i] == 'LEARNING_MANAGER') {
        this.setData({
          show_view_learning: true,
          can_show:false
        });

      }
        if(this.data.role_info[i] == 'LEAGUE_MANAGER') {
        this.setData({
          show_view_league: true,
          can_show:false
        });
  
      }
       if (this.data.role_info[i] == 'LOCALE_MEMBER') {
        this.setData({
          show_view_locale: true,
          can_show:false
        });
   
      }
    }
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