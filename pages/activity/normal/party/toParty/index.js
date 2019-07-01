Page({
  data: {
    
  },
  changePage: function (e) {
    var path;
    switch (e.currentTarget.dataset.type) {
      case 'flag':
        path = '../flag/index';
        break;
      case 'exchange':
        path = '../exchange/index';
        break;
    }
    wx.navigateTo({
      url: path
    })
  },
})