var util = require("../../utils/util");
var utils = require("../../utils/time-utils");
let BASE64 = require("../../utils/Base64.js");
let DES3 = require("../../utils/DES3.js");

Page({
  data: {
    selectWeek:0,
    timeBean:{},
    user_token: '',
    username:'',
    Request_date:'',
    shceList :[
      {
          id:'001',
          name: "用餐-2号包厢",
          type: "工作安排",
          people: ['BBB','BBB','BBB','BBB','BBB','BBB'],
          s_time:"2021-01-21 10:00:00",
          e_time:"2021-01-21 11:30:00",
          other:"aefdbscfvjdsnvkzndvabv"
        }, {
          id:'001',
          name: "用餐-2号包厢",
          type: "工作安排",
          people: ['BBB','BBB','BBB','BBB','BBB','BBB'],
          s_time:"2021-01-21 10:00:00",
          e_time:"2021-01-21 11:30:00",
          other:"aefdbscfvjdsnvkzndvabv"
        }, 
        {
          id:'001',
          name: "用餐-2号包厢",
          type: "工作安排",
          people: ['BBB','BBB','BBB','BBB','BBB','BBB'],
          s_time:"2021-01-21 10:00:00",
          e_time:"2021-01-21 11:30:00",
          other:"aefdbscfvjdsnvkzndvabv"
        },{
          id:'001',
          name: "用餐-2号包厢",
          type: "工作安排",
          people: ['BBB','BBB','BBB','BBB','BBB','BBB'],
          s_time:"2021-01-21 10:00:00",
          e_time:"2021-01-21 11:30:00",
          other:"aefdbscfvjdsnvkzndvabv"
        }, {
          id:'001',
          name: "用餐-2号包厢",
          type: "工作安排",
          people: ['BBB','BBB','BBB','BBB','BBB','BBB'],
          s_time:"2021-01-21 10:00:00",
          e_time:"2021-01-21 11:30:00",
          other:"aefdbscfvjdsnvkzndvabv"
        }, {
          id:'001',
          name: "用餐-2号包厢",
          type: "工作安排",
          people: ['BBB','BBB','BBB','BBB','BBB','BBB'],
          s_time:"2021-01-21 10:00:00",
          e_time:"2021-01-21 11:30:00",
          other:"aefdbscfvjdsnvkzndvabv"
        }
      ]
  },
  onLoad: function (options) {
    for (let index = 0; index < this.data.shceList.length; index++) {
      this.data.shceList[index].start_time = 
        this.data.shceList[index].s_time.substr(11)
    }
    this.setData({
      shceList : this.data.shceList
    })
    console.log(this.data.shceList);
  },
  onReady: function () {
    this.setData({
      timeBean: utils.getWeekDayList(this.data.selectWeek)
    })
  },
  lastWeek:function(e){   
    var selectWeek = --this.data.selectWeek;
    var timeBean = this.data.timeBean
    timeBean = utils.getWeekDayList(selectWeek)
    if (selectWeek != 0) {
      timeBean.selectDay = 0;
    }
    this.setData({
      timeBean,
      selectWeek
    });
    // console.log(this.data.timeBean);
    // console.log(this.data.selectWeek);
    this.setData({
      Request_date: this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day
    })
    console.log(this.data.Request_date);
    this.onRequest();
  },
  nextWeek:function(e){
    var selectWeek = ++this.data.selectWeek;
    var timeBean = this.data.timeBean
    timeBean = utils.getWeekDayList(selectWeek)
    if (selectWeek != 0){
      timeBean.selectDay = 0;
    }
    this.setData({
      timeBean,
      selectWeek
    })
    // console.log(this.data.timeBean);
    // console.log(this.data.selectWeek);
    this.setData({
      Request_date: this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day
    })
    console.log(this.data.Request_date);
    this.onRequest();
  },
  dayClick:function(e){
    var timeBean = this.data.timeBean
    timeBean.selectDay = e.detail;
    this.setData({
      timeBean
    })
    // console.log(e)
    // console.log(this.data.timeBean.yearMonth)
    // console.log(this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day)
    this.setData({
      Request_date: this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day
    })
    console.log(this.data.Request_date);
    this.onRequest();
  },
  Tapiteminfo: function(e){
    // console.log(e.currentTarget.dataset.id)
    // var iteminfo_object = this.data.Conference_list.find(item => item.id == e.currentTarget.dataset.id)
    // console.log(iteminfo_object)
    // var str= JSON.stringify(iteminfo_object);
    wx.navigateTo({
        url: '../info/info' ,
      })
  },
})