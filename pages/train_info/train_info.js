Page({
  data: {
    confo_info:{}
  },
  onLoad: function (option) {
    var newdata = JSON.parse(option.str)
    this.setData({
      confo_info: newdata
    });
  }
})