// pages/setting/certificate/Scertificate/create/index.js
var Util=require('../../../../../utils/newutil.js');
var app =  getApp();  
Page({

  data: {
    certificateName:"",
    certificateGrade:"",
    certificateNumber:"",
    certificateStart:"2000-01",
    certificateTime:"",
    certificateEndTime:"",
    description:"",
        imgUrl: '../../../../../images/upload.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var now=new Date();
    that.setData({
      'certificateTime':Util.getYM(now),
      'certificateEndTime':Util.getYM(now)
    })
  },
  input:function(e){
    var that=this;
    let inputType=e.currentTarget.dataset.name;
    switch(inputType){
      case 'certificateName':
      that.setData({
        certificateName:e.detail.value
      })
      break;
      case 'certificateGrade':
      that.setData({
        certificateGrade:e.detail.value
      })
      break;
      case 'certificateNumber':
      that.setData({
        certificateNumber:e.detail.value
      })
      break;
      case 'description':
      that.setData({
        description:e.detail.value
      })
      break;
    }
  },
  changeCertificateTime:function(e){
    this.setData({
      certificateTime:e.detail.value

    })
    
  },
  changeCertificateEndTime:function(e){
    this.setData({
      certificateEndTime:e.detail.value
    })
  },
/*
  判断中文和英文
*/
checkCE: function (str) {
  let reg = /^[\u4e00-\u9fa5_a-zA-Z]+$/;
  return reg.test(str);
},
/*
  判断数字字母和#
*/
checkEN:function(str){
  let reg=/^[a-zA-Z0-9#]+$/;
  return reg.test(str);
},
/*
  判断中文数字英文
*/
checkCEN: function (str) {
  let reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
  return reg.test(str)
},
  toSubmit:function(){
    var that=this;
    var thank=this.data;
    if(thank.certificateName==""||!that.checkCEN(thank.certificateName)){
      wx.showToast({
        title: '证书全称不能为空或出现特殊字符',
        icon: 'none',
        duration:3000
      })
    }else{
      if(thank.certificateGrade!=""&&!that.checkCEN(thank.certificateGrade)){
        wx.showToast({
          title: '证书等级不能出现特殊字符',
          icon: 'none',
          duration:3000
        })
      }else{
        if(thank.certificateNumber!=""&&!that.checkEN(thank.certificateNumber)){
          wx.showToast({
            title: '证书编号不能出现特殊字符',
            icon: 'none',
            duration:3000
          })
        }else{
          if(thank.description==""){
            wx.showToast({
              title: '证书详细不能为空',
              icon: 'none',
              duration:3000
            })
          }else{
            that.submitRequest();
          }
        }
      }
    }
  },
  submitRequest:function(){
    var that=this;
    var thank=this.data;
    let certificateTimes=thank.certificateTime.split("-");
    var certificatePublishTime=new Date(certificateTimes[0],certificateTimes[1]-1).getTime();
    let certificateEndTimes=thank.certificateEndTime.split("-");
    var expirationTime=new Date(certificateEndTimes[0],certificateEndTimes[1]-1).getTime();
    var newDate=Util.getYM(new Date());
    if(certificatePublishTime>newDate){
      wx.showToast({
        title:"发证时间不能大于当前时间",
        icon:'none',
        duration:3000
      })
    }else{
      if(certificatePublishTime>expirationTime){
        wx.showToast({
          title:"发证时间不能大于有效时间",
          icon:'none',
          duration:3000
        })
      }else{
        if (thank.imgUrl === "../../../../../images/upload.png") {
          wx.showToast({
            title: "请上传证书图片",
            icon: "none",
            duration: 3000
          });
        } else {
        if(thank.certificateEndTime<=newDate){
          expirationTime="";
        }
        wx.request({
          url: app.globalData.apiUrl + '/certificate',
          method: "POST",
          header: {
            'Content-Type': 'application/json',
            'Authorization':wx.getStorageSync('server_token')
          },
          data:{
            "certificateName":thank.certificateName,
            "certificatePublishTime":certificatePublishTime,
            "certificateType":'SKILL',
            "rank":thank.certificateGrade,
            "expirationTime":expirationTime,
            "certificateNumber":thank.certificateNumber,
            "pictureUrl": thank.imgUrl,
            "extInfo":{
              "description":thank.description
            }
          },
          success: function(res) {
            switch (res.data.errorCode) {
              case '200':
                wx.redirectTo({
                  url: '../index/index',
              })
              wx.showToast({
                title:"创建成功",
                icon:'none',
                duration:3000
              })
              break;
              default:
                wx.showToast({
                  title:res.data.errorMsg,
                  icon:'none',
                  duration:3000
                })
                break;
            }
           
          },
          fail:function(error){
            wx.showToast({
              title:res.data.errorMsg,
              icon:'none',
              duration:3000
            })
          }
        })
      }
      }
    }
    
  },
  changeCertificateImg: function () {
    var that = this;
    let date = wx.getStorageSync('date');
    let timeMap = wx.getStorageSync('timeMap');
    // console.log(timeMap);
    if (timeMap[date] === undefined) {
      timeMap[date] = 0;
    }
    if (timeMap[date] >= 10) {
      wx.showModal({
        title: '上传次数超过限制~',
        content: '上传次数超过限制~，请您隔天再上传哦~'
      })
    } else {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: ret => {
        var filePath = ret.tempFilePaths[0];
        let time = Date.parse(new Date());
        console.log(time);
        let fileName = app.globalData.stuId + "-" + time + ".png";
        console.log(fileName);
        console.log(filePath);
        wx.showLoading({
          title: '正在上传',
        })
        that.setData({
          status: '上传中'
        })
        wx.uploadFile({
          url: app.globalData.apiUrl+'/common/aliyun',
          filePath: filePath,
          name: 'file',
          formData: {
            'fileName': fileName
          },
          success: res => {
            wx.showToast({
              title: '图片上传成功'
            });
            timeMap[date] = timeMap[date] + 1;
            wx.setStorageSync('timeMap', timeMap);
            that.setData({
              status: '上传成功'
            })
            console.log(res);
            let data = JSON.parse(res.data);
            console.log(data);
            that.setData({
              imgUrl: data.data.path
            })
          },
          fail: error => {
            wx.showToast({
              title: '上传失败',
            })
          }
        });
      }
    })
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