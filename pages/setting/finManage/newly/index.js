var app = getApp();

Page({
  data: {
    nav_color1: 'nav-active',
    nav_color2: '',
    title: '',
    money: '',
    content: '',
    remark: '',
    power:'',
    show:true,
    type:'positive',
    org:null
  },
  onLoad: function (options){
    var that=this;
    var power = app.globalData.power;
    var jsonStr = options.mes;
    var org = JSON.parse(options.org);
    if(jsonStr!='false'){
      var detail = JSON.parse(jsonStr);
      switch (detail.term) {
        case '2018A':
          detail.term = '2018学年第一学期';
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

      switch (detail.type) {
        case 'negative':
          detail.type = '支出';
          break;
        case 'positive':
          detail.type = '收入';
          break;
      }
      detail.finishTime = app.getDateStrByTimeStr(detail.finishTime);
      that.setData({ 
        detail: detail,
        show:false
      });
    }
    that.setData({
      power:power,
      org: org
    })
  },
  change: function(e) {
    var that = this;
    var item = e.target.dataset.item;
    if (item == 1) {
      that.setData({
        nav_color1: '',
        nav_color2: 'nav-active',
        type: 'negative'
      })
    } else {
      that.setData({
        nav_color1: 'nav-active',
        nav_color2: '',
        type:'positive'
      })
    }
  },
  submit: function() {
    var that = this; 
    if ((that.data.show==true&&(that.data.title == '' || that.data.money == '' || that.data.content == ''))||(that.data.show==false&&that.data.money=='')) {
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none',
        duration: 1000
      })
    } else {
      var myreg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      if (!myreg.test(that.data.money)) {
        wx.showToast({
          title: '请输入正确的数字(不超过两位小数)',
          icon: 'none',
          duration: 1000
        })
      } else {
        var obj = {};   //data数据
        var urls='';
        var methods='';
        if(that.data.show!=false){
          methods='POST';
          obj['organizationId'] = that.data.org.organizationId;
          obj['financeName'] = that.data.title;
          obj['financeInfo'] = that.data.content;
          obj['remark'] = that.data.remark;
          if (that.data.power == 1) {
            obj['type'] = that.data.type;
            obj['trueMoney'] = that.data.money;
            urls = '/finance/tally';
          } else {
            obj['budget'] = that.data.money;
            urls = '/finance/budget';
          }
        }else{
          obj['trueMoney'] = that.data.money;
          obj['financeMessageId'] = that.data.detail.financeMessageId;
          methods='PUT';
          urls ='/finance/check';
        }
        

        wx.request({
          url: app.globalData.apiUrl + urls,
          method: methods,
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': wx.getStorageSync('server_token')
          },
          data: obj,
          success: function (res) {
            
            switch (res.data.errorCode) {
              case "200":
                wx.redirectTo({
                  url: '../manager/index?message=' + JSON.stringify(that.data.org)
                });
                break;
              case "401":
                app.reLaunchLoginPage();
                break;
              default:
                app.warning(res.data.errorMsg);
            }
          },
          fail: function () {
            app.warning('服务器错误')
          }
        })

      }
    }
  },
  input: function(e) {
    var that = this;
    var which = e.currentTarget.dataset.name;
    var value = e.detail.value;
    switch (which) {
      case 'title':
        that.data.title = value;
        break;
      case 'money':
        that.data.money = value;
        break;
      case 'content':
        that.data.content = value;
        break;
      case 'remark':
        that.data.remark = value;
        break;
    }
  },
})