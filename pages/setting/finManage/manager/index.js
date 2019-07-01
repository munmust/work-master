
var app = getApp();
Page({
  data: {
    power:null,
    blacklist:null,//黑名单
    page: [0, 0, 0, 0],    //每页的页数
    hasMoreData: [true, true, true, true],
    detail:null,
    current:'tab1',
    toAuditedList: [],//待审核
    toCancelList: [],//待核销（已审核）
    cancelledList: [],//已核销
    mySubList: [],//我的提交
    message: '2018第二学期',
    actual:'',
    budget:'',
    showPage:2,
    show:null,
    billList: [],  //账单
    empty: [true, true, true, true,true]
  },

  onLoad: function (options){
    var message = JSON.parse(options.message);
    this.setData({ detail: message})
    this.getPower();
    this.getMoney();
  },

  getPower: function () { //获取权限
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/finance/perm',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: { organizationId: that.data.detail.organizationId },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            var show,power;
            if (res.data.data == true) {
              app.globalData.power = 1;
              show = 1;
              power=1;
            } else {
              app.globalData.power = 2;
              show = 4;
              power=2;
            }
            that.setData({ show: show ,power:power});
            that.getBan();
            that.requestActivities();
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
  },

  getBan:function(){  //是否黑名单
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/finance/ban',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {},
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            var ban=res.data.data;
            that.setData({ blacklist:ban});
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
  },

  tabChange({ detail }) {
    var show;
    switch(detail.key){
      case 'ToBeAudited':
        show=1;
        break;
      case 'ToCancel':
        show = 2;
        break;
      case 'Cancelled':
        show = 3;
        break;
      case 'MySubmit':
        show = 4;
        break;
    }
    this.setData({
      show:show,
      current: detail.key
    });
    if(this.data.page[show]==0){
      this.requestActivities();
    }
  },
  termChange: function () {
    var that = this;
    var list = ['2018第一学期', '2018第二学期', '2017第一学期', '2017第二学期'];
    var choice;
    wx.showActionSheet({
      itemList: list,
      success(res) {
        choice = list[res.tapIndex];
        that.setData({
          message: choice,
          page: [0, 0, 0, 0],    //每页的页数
          hasMoreData: [true, true, true, true],
          toAuditedList: [],
          toCancelList: [],
          cancelledList: [],
          mySubList: [],
          billList: []
        });
        that.requestActivities();
      },
      fail(res) {
        
      }
    })
    
  },
  gotonewly:function(){
      var that=this;
      if(that.data.blacklist!=true){
        wx.redirectTo({
          url: '../newly/index?mes=false&org=' + JSON.stringify(that.data.detail)
        });
      }else{
        wx.showToast({
          title: '你已被列入黑名单，无此权限',
          icon: 'none',
          duration: 1000
        })
      }
      
  },
  mState:function(e){
    var that=this;
    var showPage;
    switch (e.detail.key){
      case 0:
        showPage=1;
      break;
      case 1:
        showPage = 2;
      break;
    }
    that.setData({
      showPage:showPage
    });
    if(that.data.showPage==1&&that.data.page[0]==0){
      that.requestActivities();
    }
  },
  click:function(e){
    var that = this;
    if(that.data.blacklist!=true){
      var index = e.currentTarget.dataset.index;
      var status = e.currentTarget.dataset.status;
      var aim; //用于指向目标活动的数组元素
      switch (status) {
        case 'unAudited':
          aim = that.data.toAuditedList[index];//待审核
          var jsonStr = JSON.stringify(aim);
          wx.redirectTo({
            url: '../examine/index?mes=' + jsonStr + '&detail=' + JSON.stringify(that.data.detail)
          });
          break;
        case 'audited':
          aim = that.data.toCancelList[index];
          var jsonStr = JSON.stringify(aim);
          if (that.data.power == 1) {//已审核
            wx.redirectTo({
              url: '../newly/index?mes=' + jsonStr + '&org=' + JSON.stringify(that.data.detail)
            });
          } else {
            wx.navigateTo({
              url: '../detail/index?mes=' + jsonStr + '&type=audited'
            });
          }
          break;
        case 'checked':
          aim = that.data.cancelledList[index];//已核销
          var jsonStr = JSON.stringify(aim);
          wx.navigateTo({
            url: '../detail/index?mes=' + jsonStr + '&type=checked'
          });
          break;
        case 'mySub':
          aim = that.data.mySubList[index];//我的提交
          var jsonStr = JSON.stringify(aim);
          if (aim.status=='未审核'){
            wx.redirectTo({
              url: '../detail/index?mes=' + jsonStr + '&type=mysub' + '&org=' + JSON.stringify(that.data.detail)
            });
          }else{
            wx.navigateTo({
              url: '../detail/index?mes=' + jsonStr + '&type=mysub' + '&org=' + JSON.stringify(that.data.detail)
            });
          }
          break;
        case 'bill':
          aim = that.data.billList[index];//账单
          var jsonStr = JSON.stringify(aim);
          wx.navigateTo({
            url: '../detail/index?mes=' + jsonStr + '&type=bill'
          });
          break;
      }
    }else{
      wx.showToast({
        title: '你已被列入黑名单，无此权限',
        icon: 'none',
        duration: 1000
      })
    }
    
  },
  onReachBottom: function () {//加载更多
    var that = this;
    if ((that.data.showPage == 1 && that.data.hasMoreData[0])||(that.data.showPage==2&&that.data.hasMoreData[that.data.show]&&that.data.show!=4)) {
      wx.showLoading({
        title: '加载中...',
      })
      this.requestActivities();
      wx.hideLoading();
    } else {
      wx.showToast({
        title: '到底啦！',
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    var showPage = that.data.showPage;
    var show=that.data.show;
    var pageTemp = that.data.page;
    var hasMoreDataTemp = that.data.hasMoreData;
    if(showPage==1){
      pageTemp[0] = 0;
      hasMoreDataTemp[0] = true;
      that.setData({
        billList: [],
        hasMoreData: hasMoreDataTemp,
        page: pageTemp
      })
    }else{
      pageTemp[show] = 0;
      hasMoreDataTemp[show] = true;
      switch(show){
        case 1:
          that.setData({
            toAuditedList: [],
            hasMoreData: hasMoreDataTemp,
            page: pageTemp
          })
          break;
        case 2:
          that.setData({
            toCancelList: [], 
            hasMoreData: hasMoreDataTemp,
            page: pageTemp
          })
          break;
        case 3:
          that.setData({
            cancelledList: [],
            hasMoreData: hasMoreDataTemp,
            page: pageTemp
          })
          break;
      }
    }
    this.getMoney();
    this.requestActivities();
    wx.stopPullDownRefresh();

  },
  getMoney:function(){ //预算和实际金额
    var that=this;
    wx.request({
      url: app.globalData.apiUrl + '/finance/total',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: { organizationId: that.data.detail.organizationId},
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            var money = parseFloat(res.data.data.totalMoney);
            money = money.toFixed(2);
            var budget = parseFloat(res.data.data.totalMoneyIncludeBudget);
            budget = budget.toFixed(2);
            that.setData({
              actual: money,
              budget: budget
            })
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
  },

  

  requestActivities:function(){
    var that=this;
    var showPage = that.data.showPage;
    var show=that.data.show;
    var term=that.data.message;
    var obj = {};   //data数据
    var urls;
    switch(term){
      case '2018第一学期':
        term='2018A';
        break;
      case '2018第二学期':
        term = '2018B';
        break;
      case '2017第一学期':
        term = '2017A';
        break;
      case '2017第二学期':
        term = '2017B';
        break;
    }
    obj['term'] = term;
    obj['organizationId'] = that.data.detail.organizationId;
    if(that.data.power==2&&show==4&&showPage==2){
      urls = '/finance/myMessage';
    }else{
      var contentList;
      var state;
      obj['limit'] = 10;
      urls = '/finance/message';
      if (showPage == 1) {
        obj['status'] = 'CHECKED';
        obj['page'] = that.data.page[0];
        contentList = that.data.billList;
        if (that.data.page[0] == 0) {
          contentList = [];
        }
      } else {
        switch (show) {
          case 1:
            state = 'UNAUDITED';
            contentList = that.data.toAuditedList;
            obj['status'] = state;
            obj['page'] = that.data.page[show];
            break;
          case 2:
            state = 'AUDITED';
            contentList = that.data.toCancelList;
            obj['status'] = state;
            obj['page'] = that.data.page[show];
            break;
          case 3:
            state = 'CHECKED';
            contentList = that.data.cancelledList;
            obj['status'] = state;
            obj['page'] = that.data.page[show];
            break;
        }
      }
    }

    wx.request({
      url: app.globalData.apiUrl + urls,
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: obj,
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            var pageTemp = that.data.page;
            var hasMoreDataTemp = that.data.hasMoreData;
            if(showPage==1){
              hasMoreDataTemp[0] = !res.data.data.end;
              pageTemp[0]++;
              var content = res.data.data.content;
              var empty=that.data.empty;
              empty[0] = true;
              if(content.length>0){
                empty[0]=false;
              }
              for (var i = 0; i < content.length;i++){
                content[i].trueMoney = parseFloat(content[i].trueMoney);
                content[i].trueMoney = content[i].trueMoney.toFixed(2);
              }
              that.setData({
                billList: contentList.concat(content),
                hasMoreData: hasMoreDataTemp,
                page: pageTemp,
                empty:empty
              });
            }else{
              var pageTemp = that.data.page;
              var hasMoreDataTemp = that.data.hasMoreData;
              hasMoreDataTemp[show] = !res.data.data.end;
              pageTemp[show]++;
              switch (show) {
                case 1:
                  var content = res.data.data.content;
                  var empty = that.data.empty;
                  empty[show] = true;
                  if (content.length > 0) {
                    empty[show] = false;
                  }
                  for (var i = 0; i < content.length; i++) {
                    content[i].budget = parseFloat(content[i].budget);
                    content[i].budget = content[i].budget.toFixed(2);
                  }
                  that.setData({
                    toAuditedList: contentList.concat(content),
                    hasMoreData: hasMoreDataTemp,
                    page: pageTemp,
                    empty:empty
                  })
                  break;
                case 2:
                  var content = res.data.data.content;
                  var empty = that.data.empty;
                  empty[show] = true;
                  if (content.length > 0) {
                    empty[show] = false;
                  }
                  for (var i = 0; i < content.length; i++) {
                    content[i].budget = parseFloat(content[i].budget);
                    content[i].budget = content[i].budget.toFixed(2);
                  }
                  that.setData({
                    toCancelList: contentList.concat(res.data.data.content),
                    hasMoreData: hasMoreDataTemp,
                    page: pageTemp,
                    empty: empty
                  })
                  break;
                case 3:
                  var content = res.data.data.content;
                  var empty = that.data.empty;
                  empty[show] = true;
                  if (content.length > 0) {
                    empty[show] = false;
                  }
                  for (var i = 0; i < content.length; i++) {
                    content[i].trueMoney = parseFloat(content[i].trueMoney);
                    content[i].trueMoney = content[i].trueMoney.toFixed(2);
                  }
                  that.setData({
                    cancelledList: contentList.concat(res.data.data.content),
                    hasMoreData: hasMoreDataTemp,
                    page: pageTemp,
                    empty: empty
                  })
                  break;
                case 4:
                  var content = res.data.data;
                  var empty = that.data.empty;
                  empty[show] = true;
                  if (content.length > 0) {
                    empty[show] = false;
                  }
                  for (var i = 0; i < content.length;i++){
                    switch (content[i].status){
                      case 'UNAUDITED':
                        content[i].status ='未审核';
                        break;
                      case 'AUDITED':
                        content[i].status = '已审核';
                        break;
                      case 'AUDITED_FAIL':
                        content[i].status = '审核未通过';
                        break;
                      case 'CHECKED':
                        content[i].status = '已核销';
                        break;
                    }
                  }
                  that.setData({
                    mySubList: content,
                    empty: empty
                  })
                  break;
              }
            }

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


})