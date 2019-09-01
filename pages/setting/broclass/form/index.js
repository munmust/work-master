// pages/form/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    locale_area_id: '',

    avatarUrl: "/images/prove.png",
    
    tel: '',
    tel_length: '0',
    usage: '',
    usage_length: '0',
    remark: '',
    remark_length: '0',
    status: 'COMMIT',
    time_bucket: '',
    time_date: '',
    locale_id: '',
    locale_code: '',
    locale_area_id: '',
    document: '',
    org:'',
    org_length:'0',


  },

  imginput: function (e) {

    var that = this

    wx.chooseImage({

      count: 1, //最多可以选择的图片总数

      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有

      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有

      success: function (res) {
        
        var tempPaths = res.tempFilePaths

        that.setData({
          avatarUrl:tempPaths[0]
        })

        //请求接口

        wx.uploadFile({

          url: app.globalData.yesapi,

          filePath: res.tempFilePaths[0],

          name: 'file',

          header: {

            "Content-Type": "application/x-www-form-urlencoded"

          },

          formData: {
            file_name: '1.png',
            app_key: 'F367CB0840D05EA1B94B66396F7F2973',
            s: "App.CDN.UploadImg"

          },

          success: function (res) {
            that.data.document = JSON.parse(res.data).data.url;
            console.log(that.data.document);
          }

        })

        console.log(res);

      },
    })

  },

  telinput: function (e) {
    let tel = e.detail.value;
    let tel_length = tel.length;
    this.data.tel = tel;
    this.setData({
      tel_length: tel_length
    });

    //开发测试
    console.log('用户输入tel:',this.data.tel);
    console.log('tel长度:', this.data.tel_length);
  },

  //组织
  orginput:function(e){

    let org = e.detail.value;
    let org_length = org.length;
    this.data.org = org;
    this.setData({
      org_length:org_length
      
    });
    //开发测试
    console.log('用户输入org',this.data.org);
    console.log('org长度',this.data.org_length);
  },

  usageinput: function (e) {
    let usage = e.detail.value;
    let usage_length = usage.length;
    this.data.usage = usage;
    this.setData({
      usage_length: usage_length
    });

    //开发测试
    console.log('用户输入usage:',this.data.usage);
    console.log('usage长度:', this.data.usage_length);
  },

  remarkinput: function (e) {
    let remark = e.detail.value;
    let remark_length = remark.length;
    this.data.remark = remark;
    this.setData({
      remark_length: remark_length
    });

    //开发测试
    console.log('用户输入remark:',this.data.remark);
    console.log('remark长度:', this.data.remark_length);
  },

  submit: function () {

    if (this.data.tel == '' || this.data.usage == '' || this.data.remark == ''||this.data.org == '') {

      app.warning('请输入完整信息!');

    } else {

      wx.request({

        url: app.globalData.apiUrl + '/localeapply/apply',

        method: 'POST',

        data: {
          timeDate: this.data.time_date,
          timeBucket: this.data.time_bucket,
          status: this.data.status,
          localeId: this.data.locale_id,
          localeCode: this.data.locale_code,
          localeAreaId: this.data.locale_area_id,
          tel: this.data.tel,
          usages: this.data.usage,
          remark: this.data.remark,
          document: this.data.document,
          organizationName:this.data.org,
        },

        header: {
          'Authorization': wx.getStorageSync('server_token'),
          'content-type': 'application/x-www-form-urlencoded'
        },

        success: function (res) {

          //开发测试
          console.log('申请场地传回的数据');
          console.log(res.data);

          switch (res.data.errorCode) {
            case "200":
              //app.warning(res.data.errorMsg);
              wx.showModal({
                title: '提示',
                content: res.data.errorMsg,
                showCancel: false,
                success(res) {

                  console.log('用户点击确定');

                  wx.navigateBack({
                    //url: '/pages/broclass/index/index',
                    delta:3
                  })

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
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let locale_area_id = wx.getStorageSync('locale_area_id');
    let time_date = wx.getStorageSync('time_date');
    let time_bucket = wx.getStorageSync('choose_time');
    let locale_id = wx.getStorageSync('choosed_locale_id');
    let locale_code = wx.getStorageSync('choosed_locale_code');

    this.setData({
      locale_area_id: locale_area_id,
      time_date: time_date,
      time_bucket: time_bucket,
      locale_id: locale_id,
      locale_code: locale_code
    })

    //开发测试
    console.log('form页面接收到的各个数据:','time_bucket:',this.data.time_bucket,',time_date:',this.data.time_date,',locale_id:' + this.data.locale_id,',locale_area_id:',this.data.locale_area_id,',locale_code:',this.data.locale_code);

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

    //开发测试
    // console.log('form页面onUnload');

    wx.request({

      url: app.globalData.apiUrl + '/localearea/occupy',

      method: 'PUT',

      data: {
        localeAreaId: this.data.locale_area_id,
        status: 'CANCEL'
      },

      header: {
        'Authorization': wx.getStorageSync('server_token'),
        'content-type': 'application/x-www-form-urlencoded'
      },
      
      
      success: function (res) {

        //开发测试
        console.log('取消场地传回的数据',res.data);

        switch (res.data.errorCode) {
          case "200":

            //开发测试
            console.log(res.data.errorMsg);

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
      },

    })

  },

})