// pages/home/create1/index.js

var app = getApp();

var date = new Date();

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    //场地数据的传输
    locale_name: [],
    locale_id: [],
    locale_code: [],
    

    //场地的数据定义
    choosed_class: '请选择教室',
    choosed_locale_id: '',
    choosed_locale_code: '',

    //日期定义
    time_date: '请选择时间',
    current_date: date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate(),
    gap_days: '',
    end_year: '',
    end_month: '',
    end_day: '',
    end_date: ''
  },

  //获取日期
  bindTimeChange: function (e) {

    let time_date = e.detail.value;
    this.setData({
      time_date: time_date
    })

    //开发测试
    console.log('用户选择的日期为',this.data.time_date);
  },

  //获取地点
  bindPickerChange: function (e) {
    let choosed_class = this.data.locale_name[e.detail.value];
    let choosed_locale_id = this.data.locale_id[e.detail.value];
    let choosed_locale_code = this.data.locale_code[e.detail.value];

    this.setData({
      choosed_class: choosed_class,
      choosed_locale_id: choosed_locale_id,
      choosed_locale_code: choosed_locale_code
    });

    //开发测试
    console.log('用户选择的教室为',this.data.choosed_class);
   },

  //用户确认场地及日期
  submit: function () {

    //设置缓存
    wx.setStorage({
      key: 'time_date',
      data: this.data.time_date
    })

    wx.setStorage({
      key: 'choosed_locale_id',
      data: this.data.choosed_locale_id
    })

    wx.setStorage({
      key: 'choosed_locale_code',
      data: this.data.choosed_locale_code
    })

    //判断场地和时间是否为空
    if (this.data.choosed_locale_id == '' || this.data.time_date == '请选择时间') {

      app.warning('场地和日期不能为空!');

    } else {

      wx.request({

        url: app.globalData.apiUrl + '/localearea/areas',

        method: 'GET',

        data: {
          localeId: this.data.choosed_locale_id,
          timeDate: this.data.time_date
        },

        header: {
          'Authorization': wx.getStorageSync('server_token')
        },

        success: function (res) {
          switch (res.data.errorCode) {
            case "200":

              var used_time_bucket = new Array();
              var time_bucket = ['8:00-12:00', '12:00-16:00', '16:00-18:00', '18:00-22:00'];

              for (var i = 0; i < res.data.data.length; i++) {
                used_time_bucket[i] = res.data.data[i].timeBucket;
              }

              //时间段数据处理
              for (var i in used_time_bucket) {
                for (var k in time_bucket) {
                  if (used_time_bucket[i] == time_bucket[k]) {
                    time_bucket.splice(k, 1);
                    continue;
                  }
                }
              }

              //设置缓存
              wx.setStorage({
                key: 'time_bucket',
                data: time_bucket
              });

              //开发测试
              console.log('可用时间段为',time_bucket);

              if (time_bucket.length == 0) {
                wx.showModal({
                  title: '提示',
                  content: '啊哦~这个场地好像被占走了哦',
                  showCancel: false,
                });
              } else {
                //页面跳转
                wx.navigateTo({
                  url: '../create2/index'
                })
              }
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
        },

      })
    }

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取缓存
    let locale_name = wx.getStorageSync('locale_name');
    let locale_id = wx.getStorageSync('locale_id');
    let locale_code = wx.getStorageSync('locale_code');

    this.setData({
      locale_name: locale_name,
      locale_id: locale_id,
      locale_code: locale_code
    });

    //日期处理(只显示当天及30天后))
    if (date.getMonth() + 1 == 1 || date.getMonth() + 1 == 3 || date.getMonth() + 1 == 5 || date.getMonth() + 1 == 7 || date.getMonth() + 1 == 8 || date.getMonth() + 1 == 10 || date.getMonth() + 1 == 12) {
      //31天的月份
      this.data.gap_days = 31;
    } else if (date.getMonth() + 1 == 2) {
      //判断闰年
      if (((date.getFullYear() % 400 == 0) || (date.getFullYear() % 100 != 0)) && (date.getFullYear() % 4 == 0)) {
        this.data.gap_days = 29;
      } else {
        this.data.gap_days = 28;
      }

    } else {
      this.data.gap_days = 30;
    }

    //跨年日期处理
    if (date.getMonth() + 1 == 12) {
      this.data.end_year = date.getFullYear() + 1;
      this.data.end_month = 1;
    } else {
      this.data.end_year = date.getFullYear();
      this.data.end_month = date.getMonth() + 2;
    }

    this.data.end_day = 30 - (this.data.gap_days - date.getDate());

    var end_date = this.data.end_year + '-' + this.data.end_month + '-' + this.data.end_day;

    this.setData({
      end_date: end_date
    })

    //开发测试
    console.log('开始日期为', this.data.current_date);
    console.log('截至日期为', this.data.end_date);

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
