// pages/home/leaguecheck/detail/index.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryBean : [],
    isMaskWindowShow: false,
  maskWindowList: ['申请理由不充分', '教室临时占用', '其他（输入）', '没有原因'],
  selectIndex: -1,
  isMaskWindowInputShow: false,
  maskWindowInputValue: ""
  },

  pass: function() {

    var that = this;

    wx.showModal({
      title: '注意',
      content: '确定要通过此申请吗?',
      success(res) {
        if(res.confirm) {
          wx.request({

            url: app.globalData.apiUrl + '/localeapply/applyadmin',

            method: 'PUT',

            data: {
              localeApplyId: that.data.queryBean.localeApplyId,
              status: 'PASS'
            },

            header: {
              'Authorization': wx.getStorageSync('server_token'),
              'Content-Type': 'application/x-www-form-urlencoded'
            },

            success: function (res) {

              //开发测试
              console.log('团学通过场地申请传回的数据');
              console.log(res.data);

              switch (res.data.errorCode) {
                case "200":
                  wx.showModal({
                    title: '提示',
                    content: '已通过',
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                    }
                  });
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
          });
        }
      }
    });
  },

  deny: function(text) {

    this.showMaskWindow();
  },

  denysend: function(text) {
    let that = this;
    wx.request({

      url: app.globalData.apiUrl + '/localeapply/applyadmin',

      method: 'PUT',

      data: {
        localeApplyId: that.data.queryBean.localeApplyId,
        status: 'CANCEL',
        failureMessage: text
      },

      header: {
        'Authorization': wx.getStorageSync('server_token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {

        //开发测试
        console.log('团学否决场地申请传回的数据', res.data);

        switch (res.data.errorCode) {
          case "200":
            wx.showModal({
              title: '提示',
              content: '已否决',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            });
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
    });
  },

  //弹框以外区域点击
maskWindowBgClick: function (e) {
  this.dismissMaskWindow();
},

//弹窗区域点击事件
clickTap: function (e) {

},

//切换选择项事件
maskWindowTableSelect: function (e) {
  var index = e.currentTarget.dataset.windowIndex;
  this.setData({
    selectIndex: e.currentTarget.dataset.windowIndex,
    isMaskWindowInputShow: index == 2
  })
},

//输入框输入绑定事件
maskWindowInput: function (e) {
  var value = e.detail.value;
  this.setData({
    maskWindowInputValue: value
  })
},

maskWindowOk: function (e) {
  var index = this.data.selectIndex;
  var text;
  if (index >= 0 && index < 2) {
    text= this.data.maskWindowList[index];
  } else if (index == 2) {
    text = this.data.maskWindowInputValue;
  } else {
    text = "没有原因";
  }
  this.denysend(text); // 真正的取消操作
  this.dismissMaskWindow();
},

maskWindowCancel: function (e) {
  this.dismissMaskWindow();
},

// 显示蒙版弹窗
showMaskWindow: function () {
  this.setData({
    isMaskWindowShow: true,
    selectIndex: -1,
    isMaskWindowInputShow: false,
    maskWindowInputValue: ""
  })
},

// 隐藏蒙版窗体
dismissMaskWindow: function () {
  this.setData({
    isMaskWindowShow: false,
    selectIndex: -1,
    isMaskWindowInputShow: false,
    maskWindowInputValue: ""
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var queryBean = JSON.parse(options.queryBean);
    
    that.setData({
      queryBean: queryBean
    });

    //开发测试
    // console.log('学工查询详细页面数据:');
    // console.log(that.data.queryBean);
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
 