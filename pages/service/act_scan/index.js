//函数列表
//onLoad    加载界面时执行
//ScanCode  扫描二维码
//imgToJson 二维码图转json对象
//addRecord 增加扫码记录项
//submit    提交扫码记录数组
var util = require('../../../func/base64.js');
var app = getApp();
Page({
  data: {
    acId: '',
    acName: '',
    index: 0,
    submitData: {
      num: 0,
      acarr: []
    },
    clickNum: 0 //防止连点造成多次提交的标识数
  },

  onLoad: function (options) {
    var that=this;
    //恢复异常前保存的数据
    wx.getStorage({
      key: 'scan_records',
      success: function(res) {
        that.data.submitData=res.data;
        if(res.data!=""){
          that.setData({ list: that.data.submitData.acarr });
        }else{
          //为了避免取出的数据为null，即之前根本没存过。
          that.data.submitData = { num: 0, acarr: [] };
        }
      },
    });
    //本次扫码的活动信息
    this.data.acId = parseInt(options.acId);
    this.data.acName = options.acName;
    this.setData({
      acName: options.acName//页面显示一下活动名
    });
  },

  scanCode: function () {
    var stuMes = {};
    var that=this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        //这个步骤是必要的，因为在json字符串转json对象时，会因为json字符串第一个怪异的字符而转换失败。
        var mmes = res.result;
        var mes = util.baseDecode(mmes);
        let firstCode = mes.charCodeAt(0);
        if (firstCode < 0x20 || firstCode > 0x7f) {
          mes = mes.substring(1); // 去除第一个诡异字符
        }
        //转成json对象
        try {
          stuMes = JSON.parse(mes);
        } catch (e) {
          app.warning('codeScanner', '无法识别的二维码');
        }
        if (stuMes.legal != 'No2Class') {//如果非法二维码，则不作处理
          app.warning('codeScanner', '无法识别的二维码');
          return;
        };
        //添加扫码记录
        this.addRecord(stuMes);
        //为了安全起见，将数据存到本地
        wx.setStorage({
          key: 'scan_records',
          data: that.data.submitData,
        })
        //询问是否继续
        wx.showModal({
          title:'提示',
          content: '是否继续',
          success:function(res){
            if(res.confirm){
              that.scanCode();
            }
          }
        })
      }
    });
  },

  addRecord: function (stuMes) {
    //submitData是提交的数据，格式为{scaId:,stuId:,acId:}
    //stuMes在传入之前的格式是{stuId:,stuName:}
    stuMes.scaId = app.globalData.stuId;
    stuMes.acId = this.data.acId;
    var submitData = this.data.submitData;
    submitData.acarr[submitData.num] = stuMes;
    this.setData({ list: submitData.acarr });
    submitData.num++;
    if (submitData.num >= 5) {
      this.submit();
    }
  },

  submit: function () {
    //这主要是为了避免重复点击造成多次传输同一份数据
    if (this.clickNum == 1) return;
    else this.clickNum == 1;
    var that = this;
    //先将不必要的属性，诸如legal和stuName删除
    for (var i = 0; i < that.data.submitData.num; i++) {
      delete that.data.submitData.acarr[i].legal;
      delete that.data.submitData.acarr[i].stuName;
    }
    //先将json格式的对象转换成字符串格式
    var dataJsonObj = {
      "num": that.data.submitData.num,
      "openId": app.globalData.openId,
      "acarr": that.data.submitData.acarr
    };
    var dataJsonString = JSON.stringify(dataJsonObj);
    //然后上传
    wx.request({
      url: 'https://hupanyouth.cn/lv/common/useractivity/arradd',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: dataJsonString,
      success: function (res) {
        if (res.data.code == 200) {
          //提交成功，则从本地清空记录（arr.length=0可以清空数组）
          that.data.submitData.num = 0;
          that.data.submitData.acarr.length = 0;
          that.data.clickNum = 0;
          wx.showToast({ title: '上传中', icon: 'loading', duration: 1000 });
          that.setData({ list: that.data.submitData.acarr });
          //再将本地的数据进行同步情空
          wx.setStorage({
            key: 'scan_records',
            data: that.data.submitData,
          })
        } else if (res.data.code == 400) {
          //提交失败，则不清除本地记录，发出警报
          app.warning('codeScanner', '失败，参数不一致');
        } else if (res.data.code == 500) {
          //提交失败，则不清除本地记录，发出警报
          app.warning('codeScanner', '失败，错误异常');
        }
      },
      fail: function () {
        app.warning('codeScanner', '服务器错误');
      }
    });
  }
})