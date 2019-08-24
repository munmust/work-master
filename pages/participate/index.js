var app = getApp();

Page({
  data: {
    showSearch: true,
    demoData:'',
    showState: true,
    listData: '',
    empty: true,
    countDownList: [],
    second:[],
    Url:"",
    activityType:" ",
    activityStatus:"PUBLISHED",
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
    typeState: [
      {
      'id': '0',
      'title': '进行中'},
      {
        'id': '1',
        'title': '已报名'
      },
      {
        'id': '2',
        'title': '已过期'
      },
    ],
    tab: [true, true],
    currentTab: null,
    page:0
  },

  onLoad: function() {
    //默认显示全部
    this.showSeals(); 
  },

  loadInfo(){
    var that = this;
    // 给listDate赋值
    that.setData({
      listData: that.data.demoData,
    });
    // total中转
    let total=[];
    // 将demodate内的秒数全部存入total数组
    that.data.listData.forEach(o => total.push(o.second));
    that.setData({ second: total });
    // this.data.second.forEach(o=>console.log(o));
    that.countDown();
  },


//下拉获取更多数据
  onReachBottom:function(){
      var that=this;
      var page=that.data.page+1;
      that.setData({
        page:page
      });
      that.getdatalist();
  },
  //请求后台 更多数据
  getdatalist:function(){
    var that = this;
    wx.request({
      url: app.globalData.apiUrl +"/activityEntry",
      method:"GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data:{
        page:that.data.page,
        activityType:that.data.activityType,
        state:that.data.activityStatus,
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            // 从后台请求数据成功之后，开始以下的操作
            var arr1 = that.data.listData; //从data获取当前datalist数组
            var arr2 = res.data.data.content; //从此次请求返回的数据中获取新数组
            if(arr2.length==0){
              var page=that.data.page-1;
              that.setData({
                page:page
              })
              wx.showToast({
                title: '暂无更多数据',
              })
            }
            console.log(arr2);
            arr1 = arr1.concat(arr2); //合并数组
            that.setData({
              listData: arr1 //合并后更新datalist
            })
            break;
          case "400":
            wx.showToast({
              title: res.data.errorMsg
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
        app.warning('服务器错误');
      }

    })
  },


// 时间转化函数
  timeFormat(param) {
    //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },

// 计数器
  countDown() {
    //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    // let second = new Date().getTime();
    let sec = this.data.second;
    let countDownArr = [];
    //while(1){
      //this.setData({ countDownList: countDownArr });
      for (let index = 0; index < sec.length; index++) {
        if (sec[index] != 0) {
          sec[index]--;
        }
      }
      this.setData({ second: sec });
      //console.log(sec);
      setTimeout(this.countDown, 1000);
      //console.log(1);
    //}
  },
  
// 加载弹框
  loadDetail(id) {
    wx.showLoading({
      title: '详情加载中...',
    })
  },

  //筛选活动页面请求后台接口的连接
  getUrl(id){
    this.data.Url = app.globalData.apiUrl+id;//Url拼接  未完成  
  },

// 提交报名信息
  signUp(e){
    let status = e.currentTarget.dataset.status;
    let activityId = e.currentTarget.dataset.activityid;
    console.log(status);
    if (status==2){  
        wx.request({
          url: app.globalData.apiUrl +'/user/signUp',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': wx.getStorageSync('server_token')
          },
          data:{
            activityEntryId: activityId,
          },
          success: function (res) {
            console.log(res.data)
            wx.showToast({
              title: res.data.errorMsg
            });
          },
          fail: function () {
            app.warning('服务器错误');
          }   
        });
    }
  },

  // 寻找活动状态
  searchSt(id){
    let D=this.data.listData;
    let status;
    D.forEach(o=>{if(o.id==id){
      status=o.status;
    }})
    if(status=='2'){
      return true;
    }
  },

// 头部筛选栏触发的函数
  tabNav(e){
    var data = [true, true],
    index = e.target.dataset.currentind;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
    if (this.data.currentTab != index) {
      this.setData({
        currentTab: index
      })
    }else{
      this.setData({
        currentTab:null
      })
    }
  },

  //筛选项点击操作
  filter: function (e) {
    var that = this,
    id = e.currentTarget.dataset.id,
    index = e.currentTarget.dataset.index;

    // 改变显示状态
    switch (index) {
      case '0':
        that.setData({
          tab: [true, true],
          type_id: id,
          typeIndex: id
        });
        break;
      case '1':
        that.setData({
          tab: [true, true],
          term_id: id,
          termIndex: id
        });
        break;
    }
    if(index==0){
      that.data.activityType=that.typeChange(id);
      console.log(that.data.activityType);
      this.showSeals();
    }else{
      that.data.activityStatus=that.stateChange(id);
      console.log(that.data.activityStatus);
      this.showState();
    }

    
  },


  //按钮状态转化 
  stateChange(id){
    switch(id){
      case '0':
        return "PUBLISHED";
      case '1':
        return "REGISTERED";
      case '2':
        return "FINISHED";
    }
  },

  //类型转化
  typeChange(id) {
    switch (id) {
      case '0':
        return " ";
      case '1':
        return "schoolActivity";
      case '2':
        return "practiceActivity";
      case '3':
        return "volunteerActivity";
      case '4':
        return "volunteerWork";
      case '5':
        return "lectureActivity";
    }
  },

  //状态 请求后台
  showState:function(){
    var that=this;
    wx.request({
      url: app.globalData.apiUrl + '/user/registeredActivityEntry',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data: {
        state: this.data.activityStatus
        // state:this.data.activityStatus,
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
            // 从后台请求数据成功之后，开始以下的操作
            that.setData({
              demoData: res.data.data.content,
            });
            console.log(that.data.demoData);
            that.loadInfo();
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function () {
        app.warning('服务器错误');
      }
    })
  },
  

  // 类型  请求后台
  showSeals: function(code) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/activityEntry',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      data:{
        activityType:this.data.activityType,
        // state:this.data.activityStatus,
      },
      success: function(res) {
        switch (res.data.errorCode) {
          case "200":
          // 从后台请求数据成功之后，开始以下的操作
            that.setData({
              demoData: res.data.data.content,
            });
            console.log(that.data.demoData);
            that.loadInfo();
            break;
          case "401":
            app.reLaunchLoginPage();
            break;
          default:
            app.warning(res.data.errorMsg);
        }
      },
      fail: function() {
        app.warning('服务器错误');
      }
    })
  }

})