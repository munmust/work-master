// pages/setting/certificate/import/index.js
var app = getApp();
wx.cloud.init()
Page({

  data: {
    certificateType: '',
    downloadUrl: ''
  },
  //1.选择excel文件
  chooseExcelCET: function () {
    var that = this
    that.setData({ certificateType: "CET_4_6" })
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        let path = res.tempFiles[0].path;
        //console.log("选择四六级Excel成功",path)
        that.uploadExcel(path);
      }
    })
  },

  chooseExcelCompetition: function () {
    var that = this
    that.setData({ certificateType: "COMPETITION" })
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        let path = res.tempFiles[0].path;
        //console.log("选择竞赛Excel成功", path)
        that.uploadExcel(path);
      }
    })
  },

  chooseExcelSkill: function () {
    var that = this
    that.setData({ certificateType: "SKILL" })
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        let path = res.tempFiles[0].path;
        //console.log("选择技能Excel成功", path)
        that.uploadExcel(path);
      }
    })
  },

  //2.上传excel到云存储
  uploadExcel: function (path) {
    var that = this
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime() + '.xls',
      filePath: path,
      success: res => {
        //console.log("上传云存储成功", res.fileID)
        that.getFileUrl(res.fileID).then(result => {
          //console.log("返回后端", that.data.certificateType, that.data.downloadUrl)
          that.returnToBackend();
        });
      },
      fail: err => {
        console.log("上传云存储失败", err)
      }
    })
  },

  //3.获取云存储文件下载地址并返回后端
  getFileUrl: function (fileID) {
    return new Promise(resolve => {
      var that = this;
      wx.cloud.getTempFileURL({
        fileList: [fileID],
        success: res => {
          that.setData({
            downloadUrl: res.fileList[0].tempFileURL
          })
          //console.log("文件下载链接", res.fileList[0].tempFileURL)
          return resolve();
        },
        fail: err => {
          console.log("网络错误");
        }
      })
    });
  },

  //4.传回后端下载地址及excel证书类型
  returnToBackend: function () {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/certificateManager/certificate/excel',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        certificateType: that.data.certificateType,
        downloadUrl: that.data.downloadUrl
      },
      success: function (res) {
        console.log(res.data)
        switch (res.data) {
          case "200":
            wx.showToast({
              title: '导入成功',
              icon: 'success',
              duration: 3000
            });
            break;
          case "401":
            wx.showToast({
              title: '导入失败，请检查文件类型及证书类型是否正确',
              icon: 'none',
              duration: 3000
            });
            break;
          default:
            app.warning(res.data.errorMsg)
        }
      },
      fail: function () {
        console.log("fail")
        app.warning('服务器错误')
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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