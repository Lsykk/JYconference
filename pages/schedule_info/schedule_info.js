Page({
  data: {
    confo_info:{}
  },
  onLoad: function (option) {
    var newdata = JSON.parse(option.str)
    this.setData({
      confo_info: newdata
    });
    console.log("即将查询的行程详细信息")
    console.log(this.data.confo_info)
  }
})