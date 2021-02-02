var util = require("../../utils/util");
var utils = require("../../utils/time-utils");
import md5 from "../../utils/MD5";
Page({
  data: {
    colorList:[
      "#FFECA5",
      "#FFCFBE",
      "#CBF8DB",
      "#D2CEF7",
      "#99DBFE",
      "#F4D5F4",
      "#FFDB5C",
      "#9FE6B8",
      "#FFA5BB",
      "#E7BCF3",
      "#D8DBDA"
    ],
    selectWeek:0,
    timeBean:{},
    datastring:'',
    Conference_list: [],
    thirty_b:[],
    thirty_s:[],
    thirty_eight_s:[],
    shanghai_b:[],
    thirty_eight_b:[],
    date: '',
    show: false,
    time_line:[
      {
        time: '08:30'
      },
      {
        time: '09:30'
      },
      {
        time: '10:30'
      },
      {
        time: '11:30'
      },
      {
        time: '12:30'
      },
      {
        time: '13:30'
      },
      {
        time: '14:30'
      },
      {
        time: '15:30'
      },
      {
        time: '16:30'
      },
      {
        time: '17:30'
      },
      {
        time: '18:30'
      },
      {
        time: '19:30'
      }
    ],
    user_token: '',
    username:'',
    Request_date:'',
    Paramstring:'',
    Meetingstring:'',
    setInter:'',
    num: 0
  },
  onLoad: function (option) {
    this.setData({
      username: option.username
    });
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
        console.log(res)
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
          // console.log("获取会议室信息失败");
          console.log(res.data);
        }
    })
  },
  //会议室数据处理
  onListDeal:function() {
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
        var idd = i.toString();
        var bgc = this.data.colorList[ i % 11 ] ;
        const state1 = "Conference_list["+ i +"].length"
        const state2 = "Conference_list["+ i +"].m_top"
        const state3 = "Conference_list["+ i +"].titlem_top"
        const state4 = "Conference_list["+ i +"].id"
        const state5 = "Conference_list["+ i +"].bg_color"
        const state6 = "Conference_list["+ i +"].time_length"
        this.setData({
          [state2]: m_top_string,
          [state1]: length_string,
          [state3]: titlem_top_string,
          [state4]: idd,
          [state5]: bgc,
          [state6]: length_num
        });
      }
      //触发订阅函数
      // for ( var i = 0 ; i < this.data.Conference_list.length ; i++) {
      // const name = this.data.Conference_list[i].title;
      // const time = this.data.Conference_list[i].start_time;
      // const location = this.data.Conference_list[i].room;
      // const other = this.data.Conference_list[i].other;
      // let _that = this;
      // wx.request({
      //   url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=ACCESS_TOKEN',
      //   method: "post",
      //   data: {
      //     "touser": "OPENID",
      //     "template_id": "COmZQC5X2dQkMd7qDV_pm2PzniWxTp_cGLtdIrkpSbM",
      //     "page": "index",
      //     "miniprogram_state":"developer",
      //     "lang":"zh_CN",
      //     "data": {
      //         "thing1": {
      //             "value": "嘉悦物产集团"
      //         },
      //         "thing2": {
      //             "value": name
      //         },
      //         "date3": {
      //             "value": time
      //         } ,
      //         "thing4": {
      //             "value": location
      //         },
      //         "thing5": {
      //           "value": other
      //       }
      //     }
      //   },
      //   method: 'post', 
      //   success(res){
      //     console.log(res); 
      //   }
      // })
    // }
    // console.log(this.data.Conference_list);




      //会议室分组 根据地点
      for ( var i = 0 ; i < this.data.Conference_list.length ; i++) {
        if ( this.data.Conference_list[i].room == '30楼大会议室')
          this.data.thirty_b.push(this.data.Conference_list[i]);
        else if ( this.data.Conference_list[i].room == '30楼小会议室' ) 
          this.data.thirty_s.push(this.data.Conference_list[i]);
        else if ( this.data.Conference_list[i].room == '3805小会议室' )
          this.data.thirty_eight_s.push(this.data.Conference_list[i]);
        else if ( this.data.Conference_list[i].room == '3801大会议室' )
          this.data.thirty_eight_b.push(this.data.Conference_list[i]);
        else
          this.data.shanghai_b.push(this.data.Conference_list[i]);
      }
      this.setData({
        thirty_b : this.data.Conference_list,
        thirty_s : this.data.Conference_list,
        thirty_eight_s : this.data.Conference_list,
        shanghai_b : this.data.Conference_list,
        thirty_eight_b : this.data.Conference_list
      });
      // console.log("this.data.thirty_b");
      // console.log(this.data.thirty_b);
      // console.log("this.data.thirty_s");
      // console.log(this.data.thirty_s);
      // console.log("this.data.thirty_eight_s");
      // console.log(this.data.thirty_eight_s);
      // console.log("this.data.shanghai_b");
      // console.log(this.data.shanghai_b);
      // console.log("this.data.thirty_eight_b");
      // console.log(this.data.thirty_eight_b);
  },
  onReady: function () {
    this.setData({
      timeBean: utils.getWeekDayList(this.data.selectWeek)
    })
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  //查看会议详情
  Tapiteminfo: function(e){
    var iteminfo_object = this.data.Conference_list.find(item => item.id == e.currentTarget.dataset.id)
    var str= JSON.stringify(iteminfo_object);
    wx.navigateTo({
        url: '../info/info?str='+ str ,
      })
  },
  //点击上一周
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
  //点击下一周
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
  }
})