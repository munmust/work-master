var app = getApp();
Page({
  data: {
    detail: null,
    type:null,
    org:null,
    showPut:false
  },
  onLoad: function (options) {
    var detail = JSON.parse(options.mes);//展示数据
    var type = options.type;//类型
    var org = options.org;
    if (org != null && detail.status=='未审核'){
      this.setData({ org: JSON.parse(org),showPut:true});
    }
    switch(detail.term){
      case '2018A':
        detail.term='2018学年第一学期';
        break;
      case '2018B':
        detail.term = '2018学年第二学期';
        break;
      case '2017A':
        detail.term = '2017学年第一学期';
        break;
      case '2017B':
        detail.term = '2017学年第二学期';
        break;
    }

    switch(detail.type){
      case 'negative':
        detail.type='支出';
        break;
      case 'positive':
        detail.type = '收入';
        break;
    }

    detail.finishTime = app.getDateStrByTimeStr(detail.finishTime);

    this.setData({ detail: detail, type:type });
  },
  change:function(){
    var that=this;
    var jsonStr = JSON.stringify(that.data.detail);
    wx.redirectTo({
      url: '../putbudget/index?mes=' + jsonStr + '&org=' + JSON.stringify(that.data.org)
    });
  }
})