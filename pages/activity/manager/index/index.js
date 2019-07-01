//函数列表
//changePage  跳转到对应页面

const app = getApp();
var listArray = require('../../../../utils/listArray.js');

Page({

  data: {

  },

  onLoad: function () { 
    var roleInfo = app.globalData.roleInfo;
    var manageArray = listArray.getSData();
    var showArray=[];
    var makeItem=null;
    for (var i = 0; i < roleInfo.length; i++) {
      switch (roleInfo[i]) {
        case 'ACTIVITY_MANAGER':
          makeItem = manageArray[0];
          showArray.push(manageArray[1]);
          break;
        case 'PARTY_ACTIVITY_MANAGER':
          showArray.push(manageArray[2]);
          break;
        case 'VOLUNTEER_WORK_MANAGER':
          showArray.push(manageArray[3]);
          break;
        case 'VOLUNTEER_ACTIVITY_MANAGER':
          makeItem = manageArray[0];
          showArray.push(manageArray[4]);
          break;
        case 'PRACTICE_ACTIVITY_MANAGER':
          makeItem = manageArray[0];
          showArray.push(manageArray[5]);
          break;
      }
    }
    this.setData({
      showArray:showArray,
      makeItem: makeItem
    })
  },

  changePage: function (e) {
    var path;
    var type = e.currentTarget.dataset.type;
    switch (type) {
      case 'manage':
      case 'party':
      case 'volunteerWork':
      case 'volunteerActivity':
      case 'practice': path = '../manage/overview/index?type='+type; break;
      case 'make': path = '../make/index'; break;

    }
    wx.navigateTo({ url: path })
  }
})
