//pages/setting/registrationManager/index/index.js
var app = getApp();
Page({
  data:{
    empty: true,
    ifempty:true,
    activityId:'201812011402584031155910012018'
  },
  onLoad:function(){
      var that=this;
      wx.request({
        url: app.globalData.apiUrl +'/activityEntry' ,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('server_token')
        },
        data:{
          activityId:this.data.activityId
        },
        success:function(res){
          console.log(res.data);
          switch (res.data.errorCode){
            case '400':
              app.warning('无报名信息');
              break;
            case '200':
              console.log(res.data.errorMsg);
              that.setData({
                ifempty:false
              })
              break;
          }
        },
        fail:function(){
          app.warning('服务器错误');
        }

      })
  },
  toRgistration:function(){
    wx.navigateTo({
      url: '../registration/index',
    })
  },

  getExecl:function(){
      var that=this;
      wx.downloadFile({
        url: app.globalData.apiUrl + '/activityEntry/activityEntryRecordFile?activityEntryId=2018121118128361052300710012018',
        success: function (res) {
          console.log(res); var filePath = res.tempFilePath

          console.log(filePath)

          wx.openDocument({
            filePath: filePath,
            fileType: 'xls',
            success: function (res) {
              console.log("打开文档成功")
              console.log(res);
            },
            fail: function (res) {
              console.log("fail");
              console.log(res)
            },
            complete: function (res) {
              console.log("complete");
              console.log(res)
            }
          })
        },
        fail: function (res) {
          console.log('fail')
          console.log(res)
        },
        complete: function (res) {
          console.log('complete')
          console.log(res)
        }



      })
  }
  
  

})