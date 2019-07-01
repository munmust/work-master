// pages/setting/borrow/borrowdetail/detail/index.js
var app=getApp();
var util = require('../../../../../utils/newutil.js');
import {
  $wuxSelect
} from '../../../../../dist/index'
/*
    loanRecordId:借用记录Id
    assetId:物资Id
    assetName:物资名称
    orginaztion: 所属组织名称
    loanAmount：借用的数量
    assetInfo: 物资用途
    reAmount:归还的数量
    reType: 最终提交时的归还类型
    reAType: 消耗品的归还类型
    reDType: 耐用品的归还类型
    createTime:借用的时间
    assetD:false ：是否为耐用品
    remark:归还备注
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loanRecordId:"",
    assetId: "",
    assetName: "",
    orginaztion: "",
    ext_info: "",
    loanAmount: "",
    assetInfo: "",
    reAmount:"",
    reType: '',
    reAType: '',
    reDType: '',
    createTime:'',
    assetD:false,
    remark:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
      获取由index传进来点击的借用记录的借用记录Id
    */
    this.setData({
      loanRecordId: options.id
    });
    var that = this;
    /*
      获取借用记录的信息
    */
    wx.request(
      {
        url: app.globalData.apiUrl +'/assetLoanRecord/records',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        loanRecordId: that.data.loanRecordId
      },
      success:(res)=> {
        switch(res.data.errorCode) {
          case "200":
            that.setData({
              assetId: res.data.data[0].assetId,
              assetName: res.data.data[0].assetName,
              assetInfo: res.data.data[0].assetInfo,
              loanAmount: res.data.data[0].remain,
              createTime: res.data.data[0].createTime,
            })
          if(res.data.data[0].assetType!=="Consumable"){
            that.setData({
              assetD:true
            })
          }
        break;
        case "400":
        wx.showToast({
          title: '出错了，请重试', 
          icon: 'fail',
          duration: 2000
        })
            break;
        default:
          wx.redirectTo({
            url: '../index/index',
          })
            app.warning('服务器错误，请稍后重试');
        break;
      }
      },
  fail: function () {
    wx.redirectTo({
      url: '../index/index',
    })
    app.warning('服务器错误，请稍后重试');
  }
    })
  },
  /*
    归还数量焦点取消后
  */
  numberInput: function (e) {
    var that = this;
    that.setData({
      reAmount: e.detail.value
    })
    var reg = /^[0-9]+$/;
    if (that.data.reAmount == "" || that.data.reAmount == 0 || !(reg.test(that.data.reAmount))){
        app.warning("请勿为空或输入0和数字以外的值");
    }
  },
  Input: function (e) {
    var that = this;
    that.setData({
      remark: e.detail.value
    });
  },
  /*
   消耗品归还选择
  */
  chooseAType: function () {
    var that = this;
    $wuxSelect('#select-Atype').open({
      value: '',
      options: [
        '归还',
        '消耗',
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            reAType: value,
          })
        };
        switch (value) {
          case '归还':
          that.setData({
            reAType:'归还'
          })
            that.data.reAType = '归还';
            break;
          case '消耗':
            that.data.reAType = '消耗';
            break;
        }
      },
    })
  },
  /*
    耐用品归还选择
  */
  chooseDType: function () {
    var that = this;
    $wuxSelect('#select-Dtype').open({
      value: '',
      options: [
        '归还',
        '报损',
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            reDType: value,
          })
        };
        switch (value) {
          case '归还':
            that.data.reDType = '归还';
            break;
          case '报损':
            that.data.reDType = '报损';
            break;
        }
      },
    })
  },
  toSubmit: function () {
    var that = this;
    wx.showModal({
      content: '确认提交？',
      success: function (res) {
       /*
        将消耗品和耐用品的归还类型整合
       */
        if(that.data.reAType==""){
          that.setData({
            reType: that.data.reDType
          })
        }else{
          that.setData({
            reType:that.data.reAType
          })
        }
        var reg = /^[0-9]+$/;
          if (that.data.reAmount == "" || that.data.reAmount == 0 || !(reg.test(that.data.reAmount))) {
            app.warning("数量请勿为空或输入0和数字以外的值");
          }
          else if (that.data.reType == "") {
            app.warning("请选择归还类型")
          } 
          else if (that.data.reAmount > that.data.loanAmount) {
            app.warning("归还数量不能大于借用数量")
          } 
          else {
              app.getCode(that.submit);
          }
        }
    })
  },
  /*
    提交
  */
  submit: function (code) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl +'/assetBackRecord',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        loanRecordId: that.data.loanRecordId,
        assetId:that.data.assetId,
        type: (that.data.reType)==="归还"?"back":"destroy",
        amount: that.data.reAmount,
        remark: that.data.remark
      },
      success: (res) => {
        switch (res.data.errorCode) {
          case "200":
            wx.redirectTo({
              url: '../index/index',
            })
            wx.showToast({
              title: '归还成功',
              icon: 'success',
              duration: 2000
            })
            break;
          case "400":
            app.warning(res.data.errorMsg);
            break;
          default:
          console.log(res);
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