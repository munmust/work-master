// pages/service/mk_detail/index.js
Page({

  data: {

  },
  onLoad: function (options) {
    var jsonStr = options.mes;
    var detail = JSON.parse(jsonStr);
    this.setData({ detail: detail });
  },

})