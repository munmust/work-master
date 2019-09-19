//pages/setting/registrationManager/index/index.js
var app = getApp();
var time = require('./time.js');
Page({
  data:{
    empty: true,
    ifempty:true,
    title: '',
    term:'',
    number: '',
    linkman: '',
    contact: '',
    choose: '',
    start: '2019-09-01 00:00:00',
    end: '2019-09-01 00:00:00',
    note: '',
    top:'',
    activityEntryId:'',
    isDisabled:true,
    
    activityId:''
  },
  onLoad: function (option){
      var that=this;
    console.log("ll"+option.activityId);
      that.setData({
        activityId: option.activityId
      })
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
             
              var content = res.data.data.content[0];
              console.log(content.title);
              
              that.setData({
                ifempty: false,
                title: content.title,
                term: content.term,
                number: content.number,
                linkman: content.linkman,
                contact: content.contact,
                choose: content.choose,
                start: time.date_time(content.start),
                end: time.date_time(content.end),
                note: content.note,
                top: content.top,
                activityEntryId:content.activityEntryId
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
    var that=this;
    wx.navigateTo({
      url: '../registration/index?activityId='+that.data.activityId,
    })
  },

  getExecl:function(){
      var that=this;
      var id=that.data.activityEntryId;
    console.log("这是m"+id);
      wx.downloadFile({
        url: app.globalData.apiUrl + '/activityEntry/activityEntryRecordFile?' +'activityEntryId='+id,
        method: 'GET',
        header: {
          //'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('server_token')
        },
        // data: {
        //   activityEntryId:id
        // },
        success: function (res) {
          console.log(res.statusCode); var filePath = res.tempFilePath

          console.log(filePath)
          if (res.statusCode=="500"){
            wx.showToast({
              title: '暂无报名记录',
              icon: 'none',
              duration: 2000
            })
          }else{
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
          }
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