// pages/service/mk_detail/index.js
Page({

  data: {

  },
  onLoad: function (options) {
    var jsonStr = options.mes;
    var detail = JSON.parse(jsonStr);
    switch (detail.state){
      case 'PUBLISHED': detail.state ='已上线';break;
      case 'APPROVED': detail.state = '准备中'; break;
      case 'FINISHED': detail.state = '已下线'; break;
      case 'RESTARTED': detail.state = '重启中'; break;
    }
    switch(detail.term){
      case '2017A': detail.term ='2017-2018 第一学期';break;
      case '2017B': detail.term = '2017-2018 第二学期'; break;
      case '2018A': detail.term = '2018-2019 第一学期'; break;
      case '2018B': detail.term = '2018-2019 第二学期'; break;
    }
    this.setData({ detail: detail });
  },

})