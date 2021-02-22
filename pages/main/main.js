var util = require("../../utils/util");
import md5 from "../../utils/MD5";
var app = getApp();
Page({
  data: {
    meeting_num: false,
    Conference_list: [],
    user_token: '',
    username:'',
    Request_date:'',
    Paramstring:'',
    Meetingstring:'',
    time_line:[]
  },
  onLoad: function (option) {
    this.setData({
      username : option.username,
      time_line : app.globalData.time_line
    });
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
    // console.log('父组件onshow');

    // let myView = this.selectComponent('#myChildren')    //选择组件
    // console.log(myView.data.dateCurrentStr);
    // console.log('myView' , myView);
    // myView.setData({
    //   dateCurrentStr: this.data.Request_date        //改变值
    // })
    // console.log(myView.data.dateCurrentStr);
    this.onRequest();
  },
  //获取token
  onRequest:function(){
    let nowdate = util.formatTime(new Date()) ;
    let nowdate_deal = nowdate.substr(0,10).replace(new RegExp("/","gm"),"-")
    let secstring = this.data.username + nowdate_deal ;
    const secstr = md5.hexMD5(secstring);
    //参数准备
    const param1 = {
      login: this.data.username,
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
        // console.log("获取到的token" + res.data.token);
        _that.setData({
          user_token : res.data.token
        })
        _that.onGetConfList();
      },
      fail (res) {
        console.log("获取token失败");
        // console.log(res)
      }
    })
  },
  //获取会议室信息列表
  onGetConfList: function() {
    //获取会议室信息
    //参数准备
    const param2 = {
      token: this.data.user_token,
      startdate: this.data.Request_date,
      enddate: this.data.Request_date 
    }
    const meetingstring = JSON.stringify(param2) ;
    this.setData({
      Meetingstring : meetingstring
    })
    //发请求
    let _that = this;
    wx.request({
        url: 'http://118.31.73.43:9389/wuchan/weixin/meeting.jsp'+ '?'+'meeting=' + _that.data.Meetingstring,
        method: "post",
        data: {
          "meeting" : _that.data.Meetingstring
        },
        header: {
          'content-type': 'text/plain'
        },
        success (res) {
          // console.log("获取会议室信息成功");
          _that.setData({
            Conference_list : res.data.data
          })
          
          _that.onListDeal();
        },
        fail (res) {
          console.log("获取会议室信息失败");
          // console.log(res.data);
        }
    })
  },
  //会议室数据处理
  onListDeal:function() {
      if( this.data.Conference_list.length == 0){
        this.setData({
          meeting_num : true 
        })
      }
      else {
        this.setData({
          meeting_num : false 
        }) 
      }
      for ( var i = 0 ; i < this.data.Conference_list.length ; i++) {
        var new_s_time = this.data.Conference_list[i].start_time.substr(11,15)
        var new_s_time_hour = new_s_time.substr(0,2);
        var new_s_time_min = new_s_time.substr(3,4);
        new_s_time_hour *= 1 ;
        new_s_time_min *= 1 ;
        var new_e_time = this.data.Conference_list[i].end_time.substr(11,15)
        var new_e_time_hour = new_e_time.substr(0,2);
        var new_e_time_min = new_e_time.substr(3,4);
        new_e_time_hour *= 1 ;
        new_e_time_min *= 1 ;
        const s_hm = "Conference_list["+ i +"].s_time"
        const e_hm = "Conference_list["+ i +"].e_time"
        this.setData({
          [s_hm] : new_s_time,
          [e_hm] : new_e_time,
        })
        var length_num =  ((new_e_time_hour * 60 + new_e_time_min ) - (new_s_time_hour * 60 + new_s_time_min ) ) * 2;
        var m_top_num =  ((new_s_time_hour * 60 + new_s_time_min ) - 510 ) * 1.9815;
        var titlem_top_num = length_num * 0.25;
        var length_string = length_num.toString()+"px";
        var m_top_string = m_top_num.toString() + "px";
        var titlem_top_string = titlem_top_num.toString() + "px";
        var bgc = app.globalData.colorList[ i % 11 ] ;
        const state1 = "Conference_list["+ i +"].length"
        const state2 = "Conference_list["+ i +"].m_top"
        const state3 = "Conference_list["+ i +"].titlem_top"
        const state4 = "Conference_list["+ i +"].bg_color"
        const state5 = "Conference_list["+ i +"].time_length"
        this.setData({
          [state2]: m_top_string,
          [state1]: length_string,
          [state3]: titlem_top_string,
          [state4]: bgc,
          [state5]: length_num
        });
      }
    // console.log(this.data.Conference_list);
  },
  //查看会议详情
  Tapiteminfo: function(e){
    var iteminfo_object = this.data.Conference_list.find(item => item.id == e.currentTarget.dataset.id)
    var str= JSON.stringify(iteminfo_object);
    wx.navigateTo({
        url: '../info/info?str='+ str ,
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