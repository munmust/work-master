//函数说明
//loadRecorders 加载记录员列表
//tailor        将不必要的记录员信息进行裁剪（为了后面逻辑简便）
//checkChange   监听checkBox
//repeal        撤销选中的记录员（在这里获取code）
//realRepeal    撤销选中的记录员（调用接口通知后端）
//onInputChange 监听input的输入（记录员的学号）
//add           添加记录员（在这里获取code）
//realAdd       添加记录员（调用接口通知后端）
//2018年11月8日更新：增加和删除扫码员需要权限才能进行，添加一个code验证
//仍存问题：删除多个扫码员权限时，由于接口只提供了一个扫码员权限的删除，所以需要循环完成。但是code只能用一次，所以现在用的方法是在循环内多次获取code，然后再调用接口。等待之后又一次性删除多个扫码员权限的接口出来了再改动。
var app = getApp();

Page({

  data: {
    activityId: null,
    activityName: null,
    listData: [],
    newRecorderId: null
  },

  onLoad: function (options) {
    var jsonStr = options.mes;
    var mes = JSON.parse(jsonStr);
    var that = this;
    //将传过来的活动id和活动名进行一个设置
    that.data.activityId = mes.activityId;
    that.data.activityName = mes.activityName;
    //基本信息存储后，加载页面
    that.loadPage();
    //将数据显示到页面上
    that.setData({
      activityName: that.data.activityName,
      listData: that.data.listData
    });
  },

  loadPage: function () {
    var that = this;
    //查询相应活动的扫码员信息
    that.loadRecorders(that.tailor);
  },

  loadRecorders: function (success_callback) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/activityStamp/stamper?activityId=' + that.data.activityId,
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {},
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            that.data.listData = res.data.data;
            that.setData({
              listData: that.data.listData
            });
            //对查询到的信息进行剪裁
            success_callback();
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function () { app.warning('服务器错误'); }
    })

  },

  tailor: function () {
    var that = this;
    var listData = that.data.listData;
    for (var i = 0; i < listData.length; i++) {
      //仅保留一个学号userId和姓名userName
      delete listData[i].userInfoId;
      delete listData[i].userId;
      delete listData[i].sex;
      delete listData[i].majorId;
      delete listData[i].classId;
      delete listData[i].enrollDate;
      delete listData[i].extInfo;
      //然后设置checked属性和activityId属性
      listData[i].checked = false;
      listData[i].activityId = that.data.activityId;
    }
  },

  checkBoxChange: function (e) {

    var that = this;
    var listData = this.data.listData;
    for (var i = 0; i < listData.length; i++) {
      if (listData[i].stuId == e.currentTarget.dataset.index) {
        listData[i].checked = !listData[i].checked;//置反checked属性即可
        break;
      }
    }
  },

  repeal: function (e) {
    var that = this;
    var listData = that.data.listData;
    var activityId = that.data.activityId;
    var stuId;
    for (var i = 0; i < listData.length; i++) {
      if (listData[i].checked == false) continue;
      stuId = listData[i].stuId;
      wx.login({
        success: function (res) {
          that.realRepeal(activityId, stuId);
        }
      })
    }
  },

  realRepeal: function (activityId, stuId) {//暂时只提供删除一个
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/activityStamp/stamper',
      method: 'DELETE',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        stamperStuId: stuId,
        activityId: activityId
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            wx.showToast({ title: '撤销成功' });
            that.loadPage();
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function () { app.warning('服务器错误'); }
    });
  },

  onInputChange: function (e) {
    this.data.newRecorderId = e.detail.value;
  },

  add: function () {
    var that = this;
    wx.login({
      success: function (res) {
        that.realAdd();
      }
    })
  },

  realAdd: function () {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/activityStamp/stamper',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        activityId: that.data.activityId,
        stamperStuId: that.data.newRecorderId
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            wx.showToast({ title: '记录员添加成功' });
            that.loadPage();
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function () { app.warning('服务器错误'); }
    })
  }
})