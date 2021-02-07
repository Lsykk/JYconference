var util = require("../../utils/util");
import md5 from "../../utils/MD5";
var app = getApp();

Page({
  data: {
    morning : false,
    afternoon : false,
    evening: false,
    sche_num: false,
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
      const bgc = app.globalData.colorList[ index % 11 ] 
      const state1 = "shceList["+ index +"].s_time"
      const state2 = "shceList["+ index +"].e_time"
      const state3 = "shceList["+ index +"].bg_color"
      const state4 = "shceList["+ index +"].shijianduan"
      this.setData({
          [state1]:  new_start_time,
          [state2]:  new_end_time,
          [state3]:  bgc,
          [state4]:  sjd
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
  //查看行程详情
  Tapiteminfo: function(e){
    var iteminfo_object = this.data.shceList.find(item => item.id == e.currentTarget.dataset.id)
    var str= JSON.stringify(iteminfo_object);
    wx.navigateTo({
        url: '../schedule_info/schedule_info?str='+ str ,
      })
  },
    //切换日期
    mydata(e){
      // console.log(e);
      let data = e.detail.data
      // console.log(data)
      this.setData({
        Request_date : data
      })
      this.onRequest();
     }
})