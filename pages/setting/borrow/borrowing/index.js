/*
    code:二维码信息
    asset_id:物资Id,
    asset_type:物资类型,
    asset_name:物资名字,
    orginaztion:所属组织,
    amount:总数量,
    remain:剩余数量,
    ext_info:扩展信息,
    loanAmount:借用数量,
    assetInfo:物资的用处
*/
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    assetId:"",
    assetName:"",
    assetType:"",
    assetOrganizationName:"",
    assetAmount:"",
    assetRemain:"",
    //ext_info:"",
    loanAmount:"",
    assetInfo:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      assetId:options.assetId
    })
    wx.request({
      url: app.globalData.apiUrl+ '/asset',
      method:"GET",
      header:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data:{
        assetId:options.assetId
      },
      success:function(res){
        switch(res.data.errorCode){
          case "200":
            switch (res.data.data.assetStatus) {
              case "canLoan":
                wx.showToast({
                  title: '扫码成功',
                  icon: 'success',
                  duration: 2000
                })
                app.getCode(that.showDetail);
                break;
              case "allLoan":
                wx.redirectTo({
                  url: '../index/index',
                });
                wx.showToast({
                  title: '物资也全部借出',
                  icon: 'none',
                  duration: 2000
                })
                break;
              case "notExistence":
                wx.redirectTo({
                  url: '../index/index',
                });
                wx.showToast({
                  title: '物资码不存在',
                  icon: 'none',
                  duration: 2000
                })
                break;
              case "tempNotLoan":
                wx.redirectTo({
                  url: '../index/index',
                });
                wx.showToast({
                  title: '物资暂时不可借',
                  icon: 'none',
                  duration: 2000
                })
                break;
              default:
                wx.redirectTo({
                  url: '../index/index',
                });
                wx.showToast({
                  title: res.data.data.errorMsg,
                  icon: 'none',
                  duration: 2000
                })
                break;
            }
          break;
          case "400":
            wx.redirectTo({
              url: '../index/index',
            });
            wx.showToast({
              title: '物资码不存在',
              icon: 'none',
              duration: 2000
            })
          break;
          default:
            wx.redirectTo({
              url: '../index/index',
            });    
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'none',
              duration: 2000
            })
            break;
        }
        
      },
      fail:function(error){
        wx.redirectTo({
          url: '../index/index',
        });
        wx.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        })
      }
    })

},
showDetail:function(){
  var that = this;
  wx.request({
    url: app.globalData.apiUrl +'/asset',
    method: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': wx.getStorageSync('server_token')
    },
    data: {
      assetId: that.data.assetId
    },
    success: (res) => {
      switch (res.data.errorCode) {
        case "200":
          that.setData({
            assetId: res.data.data.assetId,
            assetName: res.data.data.assetName,
            assetType: res.data.data.assetType ==="Durable"?"耐用品":"消耗品",
            assetOrganizationName: res.data.data.assetOrganizationName,
            assetAmount: res.data.data.assetAmount,
            assetRemain: res.data.data.assetRemain,
          });
          break;
        case "400":
          wx.redirectTo({
            url: '../index/index',
          });
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 2000
          })
          break;
        default:
          wx.redirectTo({
            url: '../index/index',
          });
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 2000
          })
          break;
      }
    },
    fail: function () {
      wx.redirectTo({
        url: '../index/index',
      });
      app.warning('服务器错误，请稍后重试');
    }
  })
},
  loanInput: function (e) {
    var that=this;
    that.setData({
      loanAmount:e.detail.value
    })
    var reg = /^[0-9]+$/; 
    if (that.data.loanAmount == "" || that.data.loanAmount==0||!(reg.test(that.data.loanAmount))){
      app.warning("请勿输入小于或等于0的数字或输入数字以外的值");
    }
  },
  infoInput:function (e){
    var that = this;
    that.setData({
      assetInfo: e.detail.value 
    })
  },

  toSubmit: function () {
    var that = this;
    var reg = /^[0-9]+$/; 
    wx.showModal({
      content: '确认提交？',
      success: function (res) {
        if ((that.data.loanAmount == "" || that.data.loanAmount == 0 || !(reg.test(that.data.loanAmount)))){
          app.warning("请勿输入小于或等于0的数字或输入数字以外的值");
        } else if (that.data.loanAmount > that.data.assetRemain){
            app.warning("借用数量多于可借数量");
          }
      else{
        app.getCode(that.submit);
      }}
    })
  },

  submit: function (code) {
   var that=this;
    wx.request({
      url: app.globalData.apiUrl +'/assetLoanRecord',
      method:'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        assetId: that.data.assetId,
        amount: that.data.loanAmount,
        assetInfo: that.data.assetInfo
      },
      success:(res)=>{
        switch (res.data.errorCode) {
        case "200":
            wx.redirectTo({
              url: '../index/index',
            });
            wx.showToast({
              title: '借用成功',
              icon:'success',
              duration:2000
            })
          break;
        case "400":
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'fail',
              duration: 2000
            })
            break;
          case "401":
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'fail',
              duration: 2000
            })
            break;
        default:
            app.warning('服务器错误，请稍后重试');
            break;
        }
        },
        fail: function () {
          app.warning('服务器错误，请稍后重试');
        }
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