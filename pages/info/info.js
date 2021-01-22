Page({
  data: {
    confo_info:{
      title:'会议 |《信息部年度会议》',
      start_time:'2021年01月15日 10:00',
      end_time:'2021年01月15日 11:30',
      room:'30楼大会议室',
      people:'赟总',
      attendee:['王峥','严志海','刘世源'],
      other:'请需要作报告的同事提前准备好PPT,每个人限时五分钟'
    }
  },
  onLoad: function (option) {
    var newdata = JSON.parse(option.str)
    this.setData({
      confo_info: newdata
    });
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})