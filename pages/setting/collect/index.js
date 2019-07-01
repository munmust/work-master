import {
  $wuxSelect
} from '../../../dist/index'
var app = getApp();

Page({
  data: {
    majorVal: '',
    majorTitle: '选择专业',
    classsVal: '',
    classsTitle: '选择班级',
    gradeVal: '',
    gradeTitle: '选择年级',
    majorList:[]
  },
  onLoad: function() {
    this.getList();
  },
  onMajor() {
    var that = this;
    $wuxSelect('#wux-select2').open({
      value: this.data.majorVal,
      options: that.data.majorList,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            majorVal: value,
            majorTitle: options[index],
          })
        }
      },
    })
  },
  onClass() {
    $wuxSelect('#wux-select3').open({
      value: this.data.classsVal,
      options: [
        '1班',
        '2班',
        '3班',
        '4班',
        '5班',
        '6班',
        '7班',
        '8班',
        '9班',
        '10班',
        '11班',
        '12班',
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            classsVal: value,
            classsTitle: options[index],
          })
        }
      },
    })
  },
  onGrade() {
    $wuxSelect('#wux-select1').open({
      value: this.data.gradeVal,
      options: ['2014', '2015', '2016', '2017', '2018'],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            gradeVal: value,
            gradeTitle: options[index],
          })
        }
      },
    })
  },
  getList: function() {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/major/all',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('server_token')
      },
      success: function(res) {
        switch (res.data.errorCode) {
          case "200":
            var temp = res.data.data;
            var majorList=[];
            for (var i = 0; i < temp.length; i++) {
              majorList.push(temp[i].majorName)
            }
            that.setData({ majorList: majorList})

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
  toSubmit() {
    var that = this;
    var majorVal = that.data.majorVal;
    var classsVal = that.data.classsVal;
    var gradeVal = that.data.gradeVal;
    if (majorVal == '' || classsVal == '' || gradeVal == '') {
      app.warning('必填信息未填写完整');
      return;
    }
    wx.showModal({
      content: '确认提交？',
      success: function(res) {
        if (!res.cancel) { //确认提交
          wx.request({
            url: app.globalData.apiUrl + '/user/message',
            method: 'PUT',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': wx.getStorageSync('server_token')
            },
            data: {
              grade: gradeVal,
              classId: classsVal,
              major: majorVal
            },
            success: function(res) {
              switch (res.data.errorCode) {
                case "200":
                  app.globalData.major = majorVal
                  app.globalData.classId = classsVal
                  app.globalData.grade = gradeVal
                  wx.switchTab({
                    url: '../../home/index/index'
                  });
                  wx.showToast({
                    title: '提交成功',
                    icon: 'succes',
                    duration: 1000,
                    mask: true
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
              app.warning('服务器错误');
            }
          });
        }
      }
    })

  }
})