var util = require("../../utils/util");
var utils = require("../../utils/time-utils");
import md5 from "../../utils/MD5";
var app = getApp();

Page({
  data: {
    morning : false,
    afternoon : false,
    evening: false,
    sche_num: false,
    colorList:[
      "#FDE68A",//淡黄
      "#FECACA",
      "#A5F3FC",
      "#C7D2FE",
      "#D9F99D",
      "#E5E5E5",
      "#DDD6FE",
      "#FBCFE8",
      "#FFA5BB",
      "#E7BCF3",
      "#D8DBDA"
    ],
    selectWeek:0,
    timeBean:{},
    user_token: '',
    username:'',
    Request_date:'',
    Paramstring:'',
    Tripstring:'',
    shceList: [],
  },
  onLoad: function () {
    let nowdate = util.formatTime(new Date()) ;
    let nowdate_deal = nowdate.substr(0,10).replace(new RegExp("/","gm"),"-")
    this.setData({
      Request_date : nowdate_deal
    })
    this.onRequest();
  },
  onShow: function () {
    // this.onLoad();
    // console.log("刷新页面");
    this.setData({
      timeBean: utils.getWeekDayList(this.data.selectWeek)
    })
    let nowdate = util.formatTime(new Date()) ;
    let nowdate_deal = nowdate.substr(0,10).replace(new RegExp("/","gm"),"-")
    this.setData({
      Request_date : nowdate_deal
    })
    this.onRequest();
  },
  //获取token
  onRequest:function() {
    this.setData({
      morning: true,
      afternoon: true,
      evening: true
    })
    //请求token
    let nowdate = util.formatTime(new Date()) ;
    let nowdate_deal = nowdate.substr(0,10).replace(new RegExp("/","gm"),"-")
    let secstring = app.globalData.login + nowdate_deal ;
    const secstr = md5.hexMD5(secstring);
    //token参数准备
    const param1 = {
      login: app.globalData.login,
      nowdate: nowdate_deal,
      secstr: secstr 
    }
    const paramstring = JSON.stringify(param1) ;
    this.setData({
      Paramstring : paramstring
    })
    //发请求 获取token
    let _that = this;
    wx.request({
      url: 'http://118.31.73.43:9389/wuchan/weixin/getToken.jsp'+'?'+'tokenParam='+ _that.data.Paramstring,
      method: "post",
      data : {
        "tokenParam" : _that.data.Paramstring
      },
      header: {
        'content-type': 'text/plain'
      },
      success (res) {
        // console.log("获取token成功");
        _that.setData({
          user_token : res.data.token
        })
        _that.onGetScheList();
      },
      fail (res) {
        // console.log("获取token失败");
      }
    })
  },
  //获取行程安排列表
  onGetScheList: function() {
    //获取信息
    //参数准备
    const param2 = {
      token: this.data.user_token,
      userid: app.globalData.uid,
      startdate: this.data.Request_date,
      enddate: this.data.Request_date 
    }
    const tripstring = JSON.stringify(param2) ;
    this.setData({
      Tripstring : tripstring
    })
    //发请求
    let _that = this;
    wx.request({
        url: 'http://118.31.73.43:9389/wuchan/weixin/trip.jsp'+ '?'+'trip=' + _that.data.Tripstring,
        method: "post",
        data: {
          "trip" : _that.data.Tripstring
        },
        header: {
          'content-type': 'text/plain'
        },
        success (res) {
          // console.log("获取行程信息成功");
          _that.setData({
            shceList : res.data.data
          })
          _that.onListDeal();
        },
        fail (res) {
          // console.log("获取行程信息失败");
        }
    })
  },
  //行程信息列表 数据处理
  onListDeal:function() {
 //时间处理 提取 时分
    for (let index = 0; index < this.data.shceList.length; index++) {
      const new_start_time= this.data.shceList[index].start_time.slice(11,16)
      const new_end_time= this.data.shceList[index].end_time.slice(11,16)
      var new_s_time_hour = new_start_time.substr(0,2);
      var new_s_time_min = new_start_time.substr(3,4);
      new_s_time_hour *= 1 ;
      new_s_time_min *= 1 ;
      const sjd = new_s_time_hour * 60 + new_s_time_min ;
      var idd = index.toString();
      const bgc = this.data.colorList[ index % 11 ] 
      const state1 = "shceList["+ index +"].s_time"
      const state2 = "shceList["+ index +"].e_time"
      const state3 = "shceList["+ index +"].id"
      const state4 = "shceList["+ index +"].bg_color"
      const state5 = "shceList["+ index +"].shijianduan"
      this.setData({
          [state1]:  new_start_time,
          [state2]:  new_end_time,
          [state3]:  idd,
          [state4]:  bgc,
          [state5]:  sjd
      })
    }
    //统计上午 下午 晚上 行程个数
    var m = 0 ;
    var a = 0 ;
    var e = 0 ;
    for (let i = 0; i < this.data.shceList.length; i++) {
      if ( this.data.shceList[i].shijianduan < 720 ){
        m++ ;
      }
      else if ( this.data.shceList[i].shijianduan >= 1050) {
        e++ ;
      }
      else {
        a++;
      }
    }
    if(m != 0) {
      this.setData({
        morning : true
      })
    }
    else {
      this.setData({
        morning : false
      })
    }
    if(a != 0) {
      this.setData({
        afternoon : true
      })
    }
    else {
      this.setData({
        afternoon : false
      })
    }
    if(e != 0) {
      this.setData({
        evening : true
      })
    }
    else {
      this.setData({
        evening : false
      })
    }
    if( m + a + e == 0){
      this.setData({
        sche_num : true 
      })
    }
    else {
      this.setData({
        sche_num : false 
      }) 
    }
  },
  onReady: function () {
    this.setData({
      timeBean: utils.getWeekDayList(this.data.selectWeek)
    })
  },
  //上一周
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
    if( this.data.timeBean.yearMonth.length < 7){
      const state1 = "timeBean.yearMonth";
      const change_month = "2021-0" + this.data.timeBean.yearMonth.charAt(this.data.timeBean.yearMonth.length - 1);
        this.setData({
          [state1]: change_month
        });
    }
    if(typeof(this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day)!='string'){
      if( this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day < 10){
        const state2 = "timeBean.weekDayList["+this.data.timeBean.selectDay+"].day";
        const change_day = "0" + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day;
          this.setData({
            [state2]: change_day
          });
      }
    }
    this.setData({
      Request_date: this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day
    })
    // console.log(this.data.Request_date);
    this.onRequest();
  },
  //下一周
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
    if( this.data.timeBean.yearMonth.length < 7){
      const state1 = "timeBean.yearMonth";
      const change_month = "2021-0" + this.data.timeBean.yearMonth.charAt(this.data.timeBean.yearMonth.length - 1);
        this.setData({
          [state1]: change_month
        });
    }
    if(typeof(this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day)!='string'){
      if( this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day < 10){
        const state2 = "timeBean.weekDayList["+this.data.timeBean.selectDay+"].day";
        const change_day = "0" + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day;
          this.setData({
            [state2]: change_day
          });
      }
    }
    this.setData({
      Request_date: this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day
    })
    // console.log(this.data.Request_date);
    this.onRequest();
  },
  //切换日期
  dayClick:function(e){
    var timeBean = this.data.timeBean
    timeBean.selectDay = e.detail;
    this.setData({
      timeBean
    })
    if( this.data.timeBean.yearMonth.length < 7){
      const state1 = "timeBean.yearMonth";
      const change_month = "2021-0" + this.data.timeBean.yearMonth.charAt(this.data.timeBean.yearMonth.length - 1);
        this.setData({
          [state1]: change_month
        });
    }
    if(typeof(this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day)!='string'){
      if( this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day < 10){
        const state2 = "timeBean.weekDayList["+this.data.timeBean.selectDay+"].day";
        const change_day = "0" + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day;
          this.setData({
            [state2]: change_day
          });
      }
    }
    this.setData({
      Request_date: this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day
    })
    // console.log(this.data.Request_date);
    this.onRequest();
  },
  //查看行程详情
  Tapiteminfo: function(e){
    var iteminfo_object = this.data.shceList.find(item => item.id == e.currentTarget.dataset.id)
    var str= JSON.stringify(iteminfo_object);
    wx.navigateTo({
        url: '../schedule_info/schedule_info?str='+ str ,
      })
  },
})