//函数列表
//useridInput    控件事件函数，将用户输入的账号实时保存到data中。
//passwdInput    控件事件函数，将用户输入的密码实时保存到data中。
//checkString    检查字符串是否合法。
//checkChar      检查字符是否合法（只允许数字和字母）。
//onReady        开头动画。
//login          登录。

var app = getApp();
Page({

  data: {
    stuId: '',
    pwd: '',
    angle: 0
  },

  //账号输入
  useridInput: function (e) {
    this.setData({ stuId: e.detail.value });
  },

  //密码输入
  passwdInput: function (e) {
    this.setData({ pwd: e.detail.value });
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

  //开头动画
  onReady: function () {
    var _this = this;
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    });
  },

  login: function () {
    //先检查特殊字符。如果不合法，则return。
    if (!(this.checkString(this.data.stuId) && this.checkString(this.data.pwd))) {
      wx.showModal({
        title: '警告',
        content: '账号和密码不应包含字母和数字以外的字符!',
        showCancel: false,
        success: () => {
          this.setData({ stuId: '', pwd: '' });
        }
      })
      return;
    }
    //然后登陆
    var that = this;
    console.log(that.data);
    wx.request({
      url: 'https://hupanyouth.cn/lv/common/login',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        openId: app.globalData.openId,
        stuId: that.data.stuId,
        pwd: that.data.pwd
      },
      success: function (res) {
        //code==1或code==2，1代表是扫码员，2代表是学生。把信息保存到globalData中。
        console.log(res.data);
        if (res.data.code == 1 || res.data.code == 2) {
          app.globalData.identity = res.data.code;
          app.globalData.stuId = res.data.data.stuId;
          app.globalData.stuName = res.data.data.stuName;
          wx.switchTab({
            url: '../personal/index',
          });
        } else if (res.data.code == 400) {
          app.warning('login', '参数缺失');
        } else if (res.data.code == 403) {
          app.warning('login', '拒绝访问');
        }
      },
      fail: function () {
        app.warning('login', '服务器错误');
      }
    })
  }

});