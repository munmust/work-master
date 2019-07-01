//重审 tag2
//useridInput    控件事件函数，将用户输入的账号实时保存到data中。
//passwdInput    控件事件函数，将用户输入的密码实时保存到data中。
//checkString    检查字符串是否合法。
//checkChar      检查字符是否合法（只允许数字和字母）。
//onReady        开头动画。
//login          登录。

var app = getApp();
Page({

  data: {
    username: '',
    password: ''
  },

  //账号输入
  usernameInput: function (e) {
    this.setData({ username: e.detail.value });
  },

  //密码输入
  passwordInput: function (e) {
    this.setData({ password: e.detail.value });
  },

  //检查字符串是否合法
  checkString: function (oneString) {
    var flag = true;
    for (var i = 0; i < oneString.length && flag; i++) {
      flag = this.checkChar(oneString.charAt(i));
    }
    return flag;
  },

  //检查字符是否合法
  checkChar: function (oneChar) {
    var flag = false;
    if (!flag && (oneChar >= '0' && oneChar <= '9')) flag = true;
    if (!flag && (oneChar >= 'a' && oneChar <= 'z')) flag = true;
    if (!flag && (oneChar >= 'A' && oneChar <= 'Z')) flag = true;
    return flag;
  },

  login: function () {
    var that = this;
    app.getCode(that.reallogin);
  },

  reallogin: function (code) {
    var that = this;
    //登录
    wx.request({
      url: app.globalData.apiUrl + '/user/openId',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        username: that.data.username,
        password: that.data.password,
        code: code
      },
      success: function (res) {
        switch (res.data.errorCode) {
          case "200":
          console.log(res);
            wx.setStorageSync('server_token', res.data.data.token);
            var token = wx.getStorageSync('server_token');
            app.globalData.stuId = res.data.data.userInfo.stuId;
            app.globalData.realName = res.data.data.userInfo.realName;
            app.globalData.major = res.data.data.userInfo.major;
            app.globalData.classId = res.data.data.userInfo.classId;
            app.globalData.grade = res.data.data.userInfo.grade;
            app.globalData.roleInfo = res.data.data.roleInfo;
            wx.switchTab({
              url: '../home/index/index',
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
        app.warning('服务器错误，请稍后重试');
      }
    })
  }

});