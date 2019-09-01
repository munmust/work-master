//函数列表
//loadActivities  加载活动信息
//process         对读取到的信息进行一个加工（为了用户看得懂）
//click           监听活动项点击事件
//changeStatus    改变活动状态
//tabChange       标签页改变的监听函数
var app = getApp();

Page({

  data: {
    //默认显示已通过活动
    showSearch:true,
    showState:true,
    current: 'APPROVED',
    showPage: 2,
    actionSheetHidden: true,
    listData: [],
    publishList: [],
    approvList: [],
    finishList: [],
    restartList: [],
    actionSheetItems: [
      ['详细信息', '下线活动', '分配记录员'],
      ['详细信息', '上线活动', '分配记录员', '取消活动'],
      ['详细信息', '重启活动'],
      ['详细信息', '下线活动', '分配记录员'],
      ['详细信息', '分配记录员']
    ],
    page: [0, 0, 0, 0, 0], //每页的页数
    empty: [true, true, true, true],
    hasMoreData: [true, true, true, true, true],
    // 下拉菜单
    first: '类型',
    second: '学期',
    thirds: '排序',
    typeIndex: '0',
    termIndex: '0',
    orderIndex: '1',
    tab: [true, true, true],
    typeTabList: [{
      'id': '0',
      'title': '不限'
    }, {
      'id': '1',
      'title': '校园活动'
    }, {
      'id': '2',
      'title': '社会实践'
    }, {
      'id': '3',
      'title': '志愿活动'
    }, {
      'id': '4',
      'title': '义工活动'
    }, {
      'id': '5',
      'title': '讲座活动'
    }],
    termTabList: [{
      'id': '0',
      'title': '不限'
    }, {
      'id': '1',
      'title': '2017第1学期'
    }, {
      'id': '2',
      'title': '2017第2学期'
    }, {
      'id': '3',
      'title': '2018第1学期'
    }, {
      'id': '4',
      'title': '2018第2学期'
    }],
    currentTab: null
  },

  onLoad: function (options) {
    var that=this;
    var type=options.type;
    var showSearch, showState;
    switch (type) {
      case 'manage':
        break;
      case 'party':
        that.setData({
          showSearch: false,
          showState: false,
          showPage: 4
        });

        break;
      case 'volunteerWork':
        that.setData({
          showSearch: false,
          showState: false,
          typeIndex: '4',
          showPage: 4
        })
        break;
      case 'volunteerActivity':
        this.setData({
          typeIndex: '9',
          typeTabList: [{
            'id': '9',
            'title': '志愿活动'
          }]
        })
        break;
      case 'practice':
        this.setData({
          typeIndex: '8',
          typeTabList: [{
            'id': '8',
            'title': '社会实践'
          }]
        })
        break;
    }

    that.setData({
      type:type
    })
    
    //加载并显示活动信息
    if(type!='party'){
      that.requestActivities();
    }else{
      that.getPartyActivity();
    }
    

    
  },

  tabChange({
    detail
  }) {
    var showPage;
    switch (detail.key) {
      case 'PUBLISHED':
        showPage = 1;
        break;
      case 'APPROVED':
        showPage = 2;
        break;
      case 'FINISHED':
        showPage = 3;
        break;
      case 'RESTARTED':
        showPage = 4;
        break;
    }
    this.setData({
      current: detail.key,
      showPage: showPage
    });
    if (this.data.page[showPage] == 0) {
      this.requestActivities();
    }

  },


  // 顶部筛选区域
  tabNav: function(e) {
    var data = [true, true, true],
      index = e.target.dataset.currentind;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })

    if (this.data.currentTab != index) {
      this.setData({
        currentTab: index
      })
    }
  },
  //筛选项点击操作
  filter: function(e) {
    var that = this,
      id = e.currentTarget.dataset.id;
    switch (e.currentTarget.dataset.index) {
      case '0':
        that.setData({
          tab: [true, true, true],
          type_id: id,
          typeIndex: id
        });
        break;
      case '1':
        that.setData({
          tab: [true, true, true],
          term_id: id,
          termIndex: id
        });
        break;
      case '2':
        that.setData({
          tab: [true, true, true],
          order_id: id,
          orderIndex: id
        });
        break;
    }
    var showPage = that.data.showPage;
    var pageTemp = that.data.page;
    var hasMoreDataTemp = that.data.hasMoreData;
    pageTemp[showPage] = 0;
    hasMoreDataTemp[showPage] = true;
    switch (showPage) {
      case 1:
        that.setData({
          publishList: [],
          hasMoreData: hasMoreDataTemp,
          page: pageTemp
        })
        break;
      case 2:
        that.setData({
          approvList: [],
          hasMoreData: hasMoreDataTemp,
          page: pageTemp
        })
        break;
      case 3:
        that.setData({
          finishList: [],
          hasMoreData: hasMoreDataTemp,
          page: pageTemp
        })
        break;
      case 4:
        that.setData({
          restartList: [],
          hasMoreData: hasMoreDataTemp,
          page: pageTemp
        })
        break;
    }
    this.requestActivities();
  },

  //下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    var showPage = that.data.showPage;
    var pageTemp = that.data.page;
    var type=that.data.type;
    var hasMoreDataTemp = that.data.hasMoreData;
    pageTemp[showPage] = 0;
    hasMoreDataTemp[showPage] = true;
    switch (showPage) {
      case 1:
        that.setData({
          publishList: [],
          hasMoreData: hasMoreDataTemp,
          page: pageTemp
        })
        break;
      case 2:
        that.setData({
          approvList: [],
          hasMoreData: hasMoreDataTemp,
          page: pageTemp
        })
        break;
      case 3:
        that.setData({
          finishList: [],
          hasMoreData: hasMoreDataTemp,
          page: pageTemp
        })
        break;
      case 4:
        that.setData({
          restartList: [],
          hasMoreData: hasMoreDataTemp,
          page: pageTemp
        })
        break;
    }
    if(type!='party'){
      this.requestActivities();
    }else{
      this.getPartyActivity();
    }
    
    wx.stopPullDownRefresh();
  },

  //加载更多数据
  onReachBottom: function() {
    var that = this;
    if (that.data.hasMoreData[that.data.showPage]) {
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


  requestActivities: function() {
    var that = this;
    var showPage = that.data.showPage;
    var typeIndex = that.data.typeIndex,
      termIndex = that.data.termIndex,
      orderIndex = that.data.orderIndex;
    var type=that.data.type;
    var contentList;
    var obj = {}; //data数据
    obj['limit'] = 15;
    if (type == 'party' || type == 'volunteerWork'){
      obj['limit'] = 1000;
    }
    obj['page'] = that.data.page[showPage];
    if (that.data.page[showPage] == 0) {
      contentList = [];
    }
    switch (showPage) {
      case 1:
        showPage = 'PUBLISHED';
        contentList = that.data.publishList;
        break;
      case 2:
        showPage = 'APPROVED';
        contentList = that.data.approvList;
        break;
      case 3:
        showPage = 'FINISHED';
        contentList = that.data.finishList;
        break;
      case 4:
        showPage = 'RESTARTED';
        contentList = that.data.restartList;
        break;
    }
    switch (typeIndex) {
      case '0':
        typeIndex = null;
        break;
      case '1':
        typeIndex = 'schoolActivity';
        break;
      case '2':
      case '8':
        typeIndex = 'practiceActivity';
        break;
      case '3':
      case '9':
        typeIndex = 'volunteerActivity';
        break;
      case '4':
        typeIndex = 'volunteerWork';
        break;
      case '5':
        typeIndex = 'lectureActivity';
        break;
    }
    switch (termIndex) {
      case '0':
        termIndex = null;
        break;
      case '1':
        termIndex = '2017A';
        break;
      case '2':
        termIndex = '2017B';
        break;
      case '3':
        termIndex = '2018A';
        break;
      case '4':
        termIndex = '2018B';
        break;
    }

    if (type != 'volunteerWork' && type != 'party'){
      obj['state'] = showPage;
    }
    
    if (typeIndex != null) {
      obj['activityType'] = typeIndex;
    }
    if (termIndex != null) {
      if(that.data.showPage!=4){
        obj['term'] = termIndex;
      }
    }
    wx.request({
      url: app.globalData.apiUrl + '/activity',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: obj,
      success: function(res) {
        switch (res.data.errorCode) {
          case "200":
            // //将获取的活动列表保存
            showPage = that.data.showPage;
            var contentTemp = res.data.data.content;
            that.setData({
              listData: contentTemp
            });
            // //处理活动列表
            that.process();
            var pageTemp = that.data.page;
            var hasMoreDataTemp = that.data.hasMoreData;
            hasMoreDataTemp[showPage] = !res.data.data.end;
            pageTemp[showPage]++;
            var empty=that.data.empty;
            empty[showPage-1]=true;
            if (contentTemp.length > 0) {
              empty[showPage-1] = false;
            }
            that.setData({empty:empty});
            switch (showPage) {
              case 1:
                that.setData({
                  publishList: contentList.concat(that.data.listData),
                  hasMoreData: hasMoreDataTemp,
                  page: pageTemp
                })
                break;
              case 2:
                that.setData({
                  approvList: contentList.concat(that.data.listData),
                  hasMoreData: hasMoreDataTemp,
                  page: pageTemp
                })
                break;
              case 3:
                that.setData({
                  finishList: contentList.concat(that.data.listData),
                  hasMoreData: hasMoreDataTemp,
                  page: pageTemp
                })
                break;
              case 4:
                that.setData({
                  restartList: contentList.concat(that.data.listData),
                  hasMoreData: hasMoreDataTemp,
                  page: pageTemp
                })
                break;
            }


            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function() {
        app.warning('服务器错误')
      }
    })
  },

  process: function() {
    var that = this;
    var theShow = that.data.showPage,
      theOrder = that.data.orderIndex;
    var listData = that.data.listData;

    //倒序处理，展现在页面中为时间降序排列
    for (var i = (listData.length - 1); i >= 0; i--) {
      //将活动类型翻译成中文
      switch (listData[i].type) {
        case 'schoolActivity':
          listData[i].type = '校园活动';
          break;
        case 'practiceActivity':
          listData[i].type = '社会实践';
          break;
        case 'volunteerActivity':
          listData[i].type = '志愿活动';
          break;
        case 'volunteerWork':
          listData[i].type = '义工活动';
          break;
        case 'lectureActivity':
          listData[i].type = '讲座活动';
          break;
        case 'partyActivity':
          listData[i].type = '党建活动';
          break;
        case 'partyTimeActivity':
          listData[i].type = '交换一小时';
          break;
      }
      //将数据库日期或时间戳转换成视图日期
      // listData[i].startTime = app.getDateStrByTimeStr(listData[i].startTime);
      // listData[i].finishTime = app.getDateStrByTimeStr(listData[i].finishTime);
      listData[i].start = app.getDateStrByTimeStr(listData[i].start);
      listData[i].end = app.getDateStrByTimeStr(listData[i].end);
      //如果活动时长为0，则改为“未设置”
      if (listData[i].duration == null) {
        listData[i].duration = '未设置';
      }
    }

    if (theOrder[theShow] == '0') {
      var n = listData.length;
      for (var i = 0; i < n / 2; i++) {
        var temp = listData[i];
        listData[i] = listData[n - 1 - i];
        listData[n - 1 - i] = temp;
      }
    }

    that.setData({
      listData: listData
    })

  },

  click: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var status = e.currentTarget.dataset.status;
    var type=that.data.type;
    var aim; //用于指向目标活动的数组元素
    var asIdx; //用于确定actionSheet的选项
    //根据状态和索引定位点击的活动项以及选择actionSheet的选项
    switch (status) {
      case 'PUBLISHED':
        aim = that.data.publishList[index];
        asIdx = 0;
        break;
      case 'APPROVED':
        aim = that.data.approvList[index];
        asIdx = 1;
        break;
      case 'FINISHED':
        aim = that.data.finishList[index];
        asIdx = 2;
        break;
      case 'RESTARTED':
        aim = that.data.restartList[index];
        asIdx = 3;
        if (type == 'party' || type =='volunteerWork'){
          asIdx = 4;
        }
        break;
    }
    var jsonStr = JSON.stringify(aim);
    //显示下方ActionSheet
    wx.showActionSheet({

      itemList: that.data.actionSheetItems[asIdx], //根据不同的类型选择不同的actionSheet选项
      itemColor: '#000000',
      success: function(res) {
        switch (res.tapIndex) {
          //操作0，显示详细信息
          //操作1：更改活动状态
          //操作2：分配记录员
          //操作3：取消活动
          case 0:
            wx.navigateTo({
              url: '../detail/index?mes=' + jsonStr
            });
            break;
          case 1:
            if (type != 'party' && type !='volunteerWork'){
              var newStatus;
              switch (status) {
                case 'PUBLISHED':
                  newStatus = 'finish';
                  break;
                case 'APPROVED':
                  newStatus = 'publish';
                  break;
                case 'FINISHED':
                  newStatus = 'restart';
                  break;
                case 'RESTARTED':
                  newStatus = 'finish';
                  break;
              }
              wx.login({
                success: function (res) {
                  that.changeStatus(aim, newStatus);
                }
              });
            }else{
              wx.navigateTo({
                url: '../distribute/index?mes=' + jsonStr
              });
            }
            
            break;
          case 2:
            wx.navigateTo({
              url: '../distribute/index?mes=' + jsonStr
            });
            break;
          case 3:
            wx.showModal({
              title: '提示',
              content: '是否取消活动',
              success: function (res) {
                if (res.confirm) {
                  var newStatus = 'cancel';
                  wx.login({
                    success: function (res) {
                      that.changeStatus(aim, newStatus);
                    }
                  })
                }
              }
            })
            break;

        }
      }
    })
  },

  changeStatus: function(activity, status) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/activity',
      method: 'PUT',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        activityId: activity.activityId,
        operation: status,
      },
      success: function(res) {
        switch (res.data.errorCode) {
          case "200":
            wx.showToast({
              title: '操作成功'
            });
            
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function() {
        app.warning('服务器错误')
      }
    })

  },

  getPartyActivity:function(){
    var that=this;
    wx.request({
      url: app.globalData.apiUrl + '/activity',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        limit:1000,
        page:0,
        activityType: 'partyActivity'
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            // //将获取的活动列表保存
            var contentTemp = res.data.data.content;
            that.setData({
              listData: contentTemp
            });
            // //处理活动列表
            that.process();
            that.getPartyTimeActivity(that.data.listData);

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
  getPartyTimeActivity: function (message) {
    var that = this;
    var empty=that.data.empty;
    wx.request({
      url: app.globalData.apiUrl + '/activity',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        limit: 1000,
        page: 0,
        activityType: 'partyTimeActivity'
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            // //将获取的活动列表保存
            var contentTemp = res.data.data.content;
            that.setData({
              listData: contentTemp
            });
            // //处理活动列表
            that.process();
            empty[3]=false;
            that.setData({
              restartList: message.concat(that.data.listData),
              empty:empty
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
  }

});