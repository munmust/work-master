//函数列表
//toMySeal      跳转至页面：我的活动章
//toMyCode      跳转至页面：我的二维码
//toMyScanWork  跳转至页面：我的扫码任务

const app = getApp()
Page({

  data: {},

  onLoad:function(){
    this.setData({ identity: app.globalData.identity});
  },
  changePage:function(e){
    console.log(e.currentTarget.dataset.type);
    var path;
    switch(e.currentTarget.dataset.type){
      case 'school':
        path='../mk_school/index';
        break;
      case 'social':
        path = '../mk_social/index';
        break;
      case 'volunteer':
        path = '../mk_volunteer/index';
        break;
      case 'organization':
        path = '../mk_organization/index';
        break;
    }
    wx.navigateTo({
      url: path,
    })
  }
})
