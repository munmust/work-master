//函数列表
//loadActivities  加载活动信息
//requestActivities 请求活动信息（因为要先获取code，所以得和loadActivities分开为两个函数）
//process         对读取到的信息进行一个加工（为了用户看得懂）
//click           监听活动项点击事件
//changeStatus    改变活动状态
//tabChange       标签页改变的监听函数
var app = getApp();

Page({

  data: {
    current: 'Running',
    showPage: 1,
    actionSheetHidden: true,
    listData: [],
    runningList: [],
    pendingList: [],
    pauseList: [],
    passedList: [],
    actionSheetItems: [
      ['详细信息', '下线活动', '分配记录员'],
      ['详细信息', '上线活动', '分配记录员'],
      ['详细信息', '重启活动']
    ]
  },

  onLoad: function () {
    //加载并显示活动信息
    this.loadActivities();
  },

  tabChange({ detail }) {
    var showPage;
    switch (detail.key) {
      case 'Running': showPage = 1; break;
      case 'Pending': showPage = 2; break;
      case 'OffLine': showPage = 3; break;
    }
    this.setData({
      current: detail.key,
      showPage: showPage
    });
  },

  loadActivities: function () {
    var that = this;
    wx.login({
      success: function (res) {
        //获取code成功后请求活动列表
        that.requestActivities(res.code);
      }
    })
  },

  requestActivities: function (code) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/activity/all?code=' + code,
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      data: {},
      success: function (res) {
        switch (res.data.code) {
          case 200:
            //将获取的活动列表保存
            that.data.listData = res.data.data.activityList;
            //处理活动列表
            that.process();
            //更新视图
            that.setData({
              runningList: that.data.runningList,
              pendingList: that.data.pendingList,
              pauseList: that.data.pauseList,
              passedList: that.data.passedList
            });
            break;
        }
      },
      fail: function () { app.warning('服务器错误') }
    })
  },

  process: function () {
    //先清空各数组
    var that = this;
    that.data.runningList = [];
    that.data.pendingList = [];
    that.data.pauseList = [];
    that.data.passedList = [];
    //处理各活动信息
    var listData = that.data.listData;
    var runningList = that.data.runningList;
    var pendingList = that.data.pendingList;
    var pauseList = that.data.pauseList;
    var passedList = that.data.passedList;
    for (var i = 0; i < listData.length; i++) {
      //将活动类型翻译成中文
      switch (listData[i].type) {
        case 'xyhd': listData[i].type = '校园活动'; break;
        case 'shsj': listData[i].type = '社会实践'; break;
        case 'zyhd': listData[i].type = '志愿活动'; break;
        case 'zzll': listData[i].type = '组织履历'; break;
      }
      //将数据库日期或时间戳转换成视图日期
      // listData[i].startTime = app.getDateStrByTimeStr(listData[i].startTime);
      // listData[i].finishTime = app.getDateStrByTimeStr(listData[i].finishTime);
      listData[i].created = app.getDateStrByTimeStr(listData[i].created);
      listData[i].modified = app.getDateStrByTimeStr(listData[i].modified);
      //将活动状态翻译成中文；然后按类别指派到不同数组中去
      switch (listData[i].status) {
        case 'Running': runningList.push(listData[i]); break;
        case 'Pending': pendingList.push(listData[i]); break;
        case 'Passed': passedList.push(listData[i]); break;
        case 'Pause': pauseList.push(listData[i]); break;
      }
      //如果活动时长为0，则改为“未设置”
      if (listData[i].duration == 0) {
        listData[i].duration = '未设置';
      }
    }
  },

  click: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var status = e.currentTarget.dataset.status;
    var aim;//用于指向目标活动的数组元素
    var asIdx;//用于确定actionSheet的选项
    //根据状态和索引定位点击的活动项以及选择actionSheet的选项
    switch (status) {
      case 'Running': aim = that.data.runningList[index]; asIdx = 0; break;
      case 'Pending': aim = that.data.pendingList[index]; asIdx = 1; break;
      case 'Passed': aim = that.data.passedList[index]; asIdx = 2; break;
      case 'Pause': aim = that.data.pauseList[index]; asIdx = 2; break;
    }
    var jsonStr = JSON.stringify(aim);
    //显示下方ActionSheet
    wx.showActionSheet({
      itemList: that.data.actionSheetItems[asIdx],//根据不同的类型选择不同的actionSheet选项
      itemColor: '#000000',
      success: function (res) {
        switch (res.tapIndex) {
          //操作0，显示详细信息
          //操作1：更改活动状态
          //操作2：分配记录员
          case 0: wx.navigateTo({ url: '../detail/index?mes=' + jsonStr }); break;
          case 1:
            var newStatus;
            switch (status) {
              case 'Running': newStatus = 'Pause'; break;
              case 'Pending': newStatus = 'Running'; break;
              case 'Pause': newStatus = 'Pending'; break;
              case 'Passed': newStatus = 'Pending'; break;
            }
            wx.login({ success: function (res) { that.changeStatus(aim, res.code, newStatus); } })
            break;
          case 2:
            wx.navigateTo({ url: '../distribute/index?mes=' + jsonStr });
            break;
        }
      }
    })
  },

  changeStatus: function (activity, code, status) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/activity',
      method: 'PUT',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        id: activity.id,
        status: status,
        code: code
      },
      success: function (res) {
        switch (res.data.code) {
          case 200:
            wx.showToast({ title: '操作成功' });
            that.loadActivities();
            break;
          case 400: app.warning(res.data.msg); break;
          case 401: app.warning(res.data.msg); break;
          case 403: app.warning(res.data.msg); break;
        }
      },
      fail: function () { app.warning('服务器错误') }
    })
  }
});