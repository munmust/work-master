//函数列表
//onLoad            加载界面时执行
//loadStorageToData 加载本地数据，并更新视图
//saveDataToStorage 将data存到本地
//scanCode          扫描二维码
//addParticipant    添加参与者
//submit            提交
//chooseLevel       选择实践等级
//inputHours        输入时长
//inputWork         输入义工名称
import {
  $wuxSelect
} from '../../../../dist/index'
var util = require('../../../../func/base64.js');
var app = getApp();

Page({
  data: {
    Activity_Id: '', //活动id
    Activity_Name: '', //活动名称
    Activity_Type: '', //活动类型
    Participants_Array: [], //参与者字符串
    Index: 0,
    ifScan: true, //如果为true，代表可以继续扫码，即小于5个；反之是到5个，但提交失败，不允许继续扫码
    //活动相关的属性
    Grade: '',
    Time: '',
    Work: '',
    Show_Grade: false,
    Show_Time: false,
    Show_ChangeTime: false,
    Show_Work: false
  },

  onLoad: function(options) {
    var that = this;
    //获取该活动的信息，并显示活动名
    this.data.Activity_Id = options.acId;
    this.data.Activity_Name = options.acName;
    this.data.Activity_Type = options.acType;
    this.setData({
      Activity_Name: that.data.Activity_Name
    });
    //恢复异常前保存的数据
    this.loadStorageToData();
    //根据活动类型选择显示的控件
    switch (that.data.Activity_Type) {
      case 'volunteerActivity':
        that.data.Show_Time = true;
        break;
      case 'practiceActivity':
        that.data.Show_Grade = true;
        break;
      case 'volunteerWork':
        that.data.Show_Time = true;
        that.data.Show_Work = true;
        break;
      case 'partyTimeActivity':
        that.data.Show_ChangeTime = true;
        break;
    }
    that.setData({
      Show_Time: that.data.Show_Time,
      Show_Grade: that.data.Show_Grade,
      Show_Work: that.data.Show_Work,
      Show_ChangeTime: that.data.Show_ChangeTime
    });
  },

  loadStorageToData: function() {
    var that = this;
    wx.getStorage({
      key: 'ScanActivity' + that.data.Activity_Id,
      success: function(res) {
        if (res.data != null) {
          var Data_Json_Str = res.data;
          var Data_Json = JSON.parse(Data_Json_Str);
          //恢复这些重要的数据
          that.data.Participants_Array = Data_Json.Participants_Array;
          that.data.Index = Data_Json.Index;
          that.data.ifScan = Data_Json.ifScan;
        }
        that.setData({
          Participants_Array: that.data.Participants_Array
        });
      }
    })
  },

  saveDataToStorage: function() {
    var that = this;
    var Data_Json = {
      "Activity_Id": that.data.Activity_Id,
      "Activity_Name": that.data.Activity_Name,
      "Participants_Array": that.data.Participants_Array,
      "Index": that.data.Index,
      "ifScan": that.data.ifScan
    };
    var Data_Json_Str = JSON.stringify(Data_Json);
    wx.setStorage({
      key: 'ScanActivity' + that.data.Activity_Id,
      data: Data_Json_Str
    })
  },

  scanCode: function() {
    var that = this;
    //先判断是否能扫码
    if (!that.data.ifScan) {
      app.warning('请提交后再扫码');
      return;
    }
    var Participant_Mes = {};
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        //解密base64加密的字符串
        var Participant_Mes_Encrypted = res.result;
        var Participant_Mes_Str = util.baseDecode(Participant_Mes_Encrypted);
        //如果json字符串第一个是怪异字符，则去掉
        let firstCode = Participant_Mes_Str.charCodeAt(0);
        if (firstCode < 0x20 || firstCode > 0x7f) {
          Participant_Mes_Str = Participant_Mes_Str.substring(1);
        }
        //转成json对象
        try {
          Participant_Mes = JSON.parse(Participant_Mes_Str);
        } catch (e) {
          app.warning('微信无法识别该二维码');
        }
        var currentTime = (new Date()).getTime();
        if (currentTime >= Participant_Mes.timestamp && (currentTime - Participant_Mes.timestamp)>=20000){
          app.warning('二维码已过期');
          return;
        }
        if (Participant_Mes.legal != "No2Class") {
          app.warning('小程序无法识别该二维码');
          return;
        };
        //添加扫码记录
        this.addParticipant(Participant_Mes);
      },
      fail: function() {
        app.warning('扫码失败');
      }
    });
  },

  addParticipant: function(Participant_Mes) {
    var that = this;
    //将参与者添入数组
    that.data.Participants_Array[that.data.Index] = Participant_Mes;
    that.data.Index++;
    //同步到本地
    that.saveDataToStorage();
    //更新视图
    that.setData({
      Participants_Array: that.data.Participants_Array
    });
    //集满5个后提交
    if (that.data.Index == 5) {
      that.submit();
    }
  },

  submit: function() {
    var that = this;
    //先检查数据是否合法
    switch (that.data.Activity_Type) {
      case 'volunteerActivity':
        //志愿活动检查时长
        if (that.data.Time == '') {
          app.warning('未输入活动时长');
          return;
        }
        break;
      case 'practiceActivity':
        if (that.data.Grade == '') {
          app.warning('选择实践等级');
          return;
        }
        break;
      case 'volunteerWork':
        if (that.data.Work == '' || that.data.Time == '') {
          app.warning('信息输入不完整');
          return;
        }
        break;
    }
    //先把数组转换成字符串
    var Participants_Str = '';
    var i = 0;
    for (i = 0; i < that.data.Index - 1; i++) {
      Participants_Str = Participants_Str + that.data.Participants_Array[i].stuId + ',';
    }
    Participants_Str = Participants_Str + that.data.Participants_Array[i].stuId;
    //提交
    wx.request({
      url: app.globalData.apiUrl + '/activityStamp',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        activityId: that.data.Activity_Id,
        participants: Participants_Str,
        time: that.data.Time,
        grades: that.data.Grade,
        volunteerWorkName: that.data.Work
      },
      success: function(res) {
        switch (res.data.errorCode) {
          case "200":
            //提示提交成功，并清空参与者数组
            wx.showToast({
              title: '提交成功',
              duration: 1000
            })
            that.data.Participants_Array = [];
            that.data.Index = 0;
            that.data.ifScan = true;
            //提交完成后清空本地相应缓存
            wx.removeStorage({
              key: 'ScanActivity' + that.data.Activity_Id
            });
            //再次将新的data保存到本地
            that.saveDataToStorage();
            //更新视图
            that.setData({
              Participants_Array: that.data.Participants_Array
            });
            break;
          case "206":
            that.data.Participants_Array = [];
            that.data.Index = 0;
            that.data.ifScan = true;
            //提交完成后清空本地相应缓存
            wx.removeStorage({
              key: 'ScanActivity' + that.data.Activity_Id
            });
            //再次将新的data保存到本地
            that.saveDataToStorage();
            //更新视图
            that.setData({
              Participants_Array: that.data.Participants_Array
            });
            app.warning(res.data.errorMsg);
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            //失败并且已经有5条数据，不再允许继续扫码
            if (that.data.Index == 5) {
              that.data.ifScan = false
            }
            app.warning(res.data.errorMsg);
        }
      }
    })
  },

  selectGrade: function() {
    var that = this;
    $wuxSelect('#Grade_Select').open({
      value: '通过',
      options: [
        '优秀',
        '通过',
        '不合格'
      ],
      onConfirm: (value, index, options) => {
        switch (value) {
          case "优秀":
            that.data.Grade = 'E';
            break;
          case "通过":
            that.data.Grade = 'P';
            break;
          case "不合格":
            that.data.Grade = 'F';
            break;
        }
      }
    });
  },

  inputTime: function(e) {
    var that=this;
    if (e.detail.value<0){
      wx.showModal({
        title: '请检查时长',
        content: '时长不能为负数',
        success: function (res) {
          if (res.confirm) {
            
          }
        }
      })
      return;
    }
    this.data.Time = e.detail.value;
    console.log(this.data.Time);
  },

  inputWork: function(e) {
    this.data.Work = e.detail.value;
  },

  click: function (e){
    var that=this;
    var index = e.currentTarget.dataset.index;
    var mess = that.data.Participants_Array[index];
    wx.showModal({
      title: '删除已扫人员',
      content: '确定删除'+mess.stuId+' '+mess.stuName+'吗',
      success: function (res) {
        if (res.confirm) {
          that.data.Index--;
          that.data.Participants_Array.splice(index,1);
          //同步到本地
          that.saveDataToStorage();
          that.setData({
            Index: that.data.Index,
            Participants_Array: that.data.Participants_Array
          })
        }

      }
    })

  }

})