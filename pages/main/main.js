var util = require("../../utils/util");
var utils = require("../../utils/time-utils");
let BASE64 = require("../../utils/Base64.js");
let DES3 = require("../../utils/DES3.js");
import md5 from "../../utils/MD5";

Page({
  data: {
    selectWeek:0,
    timeBean:{},
    datastring:'',
    Conference_list: [],
    thirty_b:[],
    thirty_s:[],
    thirty_eight_s:[],
    shanghai_b:[],
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
      }
    ],
    user_token: '',
    username:'',
    Request_date:'',
    Paramstring:'',
    meetingstring:''
  },
  onLoad: function (option) {
    // console.log(option);
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
  onRequest:function(){
    let nowdate = util.formatTime(new Date()) ;
    let nowdate_deal = nowdate.substr(0,10).replace(new RegExp("/","gm"),"-")
    let secstring = this.data.username + nowdate_deal ;
    const secstr = md5.hexMD5(secstring);
    const param = {
      login: this.data.username,
      nowdate: nowdate_deal,
      secstr: secstr 
    }
    console.log(param);
    const paramstring = JSON.stringify(param) ;
    // console.log(paramstring);
    this.setData({
      Paramstring : paramstring
    })
    console.log("string"+this.data.Paramstring)
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
        console.log("获取token成功");
        console.log("获取到的token" + res.data.token);
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
  onGetConfList: function() {
    console.log("开始获取会议室列表")
    let datas = [
      {
          id:'001',
          room: "30#大",
          title: "财务部",
          name: "财务部年度总结会议",
          people: "赟总",
          s_time:"2021-01-21 10:00:00",
          e_time:"2021-01-21 11:30:00",
          attendee:['BBB','BBB','BBB','BBB','BBB','BBB'],
          length:"",
          m_top:'',
          titlem_top:''
        },
        {
          id:'001',
          room: "30#大",
          title: "财务部",
          name: "财务部年度总结会议",
          people: "赟总",
          s_time:"2021-01-21 10:00:00",
          e_time:"2021-01-21 11:30:00",
          attendee:['BBB','BBB','BBB','BBB','BBB','BBB'],
          length:"",
          m_top:'',
          titlem_top:''
        },
        {
          id:'001',
          room: "30#大",
          title: "财务部",
          name: "财务部年度总结会议",
          people: "赟总",
          s_time:"2021-01-21 10:00:00",
          e_time:"2021-01-21 11:30:00",
          attendee:['BBB','BBB','BBB','BBB','BBB','BBB'],
          length:"",
          m_top:'',
          titlem_top:''
        }
      ];
      console.log("datas:")
      console.log(datas);
    //获取会议室信息
    const param = {
      token: this.data.user_token,
      startdate: this.data.Request_date,
      enddate: this.data.Request_date 
    }
    console.log(param);
    const meetingstring = JSON.stringify(param) ;
    // console.log(paramstring);
    this.setData({
      meetingstring : meetingstring
    })
    let _that = this;
    wx.request({
        url: 'http://118.31.73.43:9389/wuchan/weixin/meeting.jsp'+ '?'+'meeting=' + _that.data.meetingstring,
        method: "post",
        data: {
          "meeting" : _that.data.meetingstring
        },
        header: {
          'content-type': 'text/plain'
        },
        success (res) {
          console.log("获取会议室信息成功");
          console.log(res.data.data)
          _that.setData({
            Conference_list : res.data.data
          })
          // for ( var i = 0 ; i < res.data.data.length ; i++ ) {
          //   const state1 = "Conference_list["+ i +"].title"
          //   const state2 = "Conference_list["+ i +"].name"
          //   const state3 = "Conference_list["+ i +"].start_time"
          //   const state4 = "Conference_list["+ i +"].end_time"
          //   const state5 = "Conference_list["+ i +"].people"
          //   const state6 = "Conference_list["+ i +"].attendee"
          //   const state7 = "Conference_list["+ i +"].room"
          //   const state8 = "Conference_list["+ i +"].other"
          //   this.setData({
          //     [state1]: m_top_string,
          //     [state2]: length_string,
          //     [state3]: titlem_top_string
          //   });
          // }
          _that.onListDeal();
        },
        fail (res) {
          console.log("获取会议室信息失败");
          console.log(res.data);
        }
    })
  },
  onListDeal:function() {
      
      for ( var i = 0 ; i < this.data.Conference_list.length ; i++) {
        var new_s_time = this.data.Conference_list[i].start_time + ":00"
        var new_e_time = this.data.Conference_list[i].end_time + ":00"
        const s = "Conference_list["+ i +"].start_time"
        const e = "Conference_list["+ i +"].end_time"
        this.setData({
          [s] : new_s_time,
          [e] : new_e_time
        })
        console.log(this.data.Conference_list[i])
        var chuo_s = new Date(this.data.Conference_list[i].start_time.replace(/-/g,"/")).getTime()
        var chuo_e = new Date(this.data.Conference_list[i].end_time.replace(/-/g,"/")).getTime()
        var length_num = (chuo_e - chuo_s) / 30000 ;
        var length_num = (chuo_e - chuo_s) / 30000 ;
        var m_top_num = (chuo_s - 1611189000000 )/ 324000 * 2.6 ;
        var titlem_top_num = length_num * 0.4;
        if ( length_num <= 100) {
          titlem_top_num =  length_num * 0.2;
        }
        if ( length_num <= 60) {
          titlem_top_num =  length_num * 0.1;
        }
        var length_string = length_num.toString()+"px";
        var m_top_string = m_top_num.toString() + "%";
        var titlem_top_string = titlem_top_num.toString() + "px";
        var idd = i.toString();
        const state1 = "Conference_list["+ i +"].length"
        const state2 = "Conference_list["+ i +"].m_top"
        const state3 = "Conference_list["+ i +"].titlem_top"
        const state4 = "Conference_list["+ i +"].id"
        this.setData({
          [state2]: m_top_string,
          [state1]: length_string,
          [state3]: titlem_top_string,
          [state4]: idd
        });
      }
      // for ( var i = 0 ; i < this.data.Conference_list.length ; i++) {
      //   var chuo_s = new Date(this.data.Conference_list[i].start_time.replace(/-/g,"/")).getTime()
      //   var chuo_e = new Date(this.data.Conference_list[i].end_time.replace(/-/g,"/")).getTime()
      //   var length_num = (chuo_e - chuo_s) / 30000 ;
      //   var length_num = (chuo_e - chuo_s) / 30000 ;
      //   console.log( "一天的长度：") ;
      //   console.log( chuo_e - chuo_s ) ;
      //   var m_top_num = (chuo_s / ( chuo_e - chuo_s )/ 10000 * 5.5 );
      //   console.log(m_top_num);
      //   var titlem_top_num = length_num * 0.4;
      //   if ( length_num <= 100) {
      //     titlem_top_num =  length_num * 0.2;
      //   }
      //   if ( length_num <= 60) {
      //     titlem_top_num =  length_num * 0.1;
      //   }
      //   var length_string = length_num.toString()+"px";
      //   var m_top_string = m_top_num.toString() + "%";
      //   var titlem_top_string = titlem_top_num.toString() + "px";
      //   var idd = i.toString();
      //   const state1 = "Conference_list["+ i +"].length"
      //   const state2 = "Conference_list["+ i +"].m_top"
      //   const state3 = "Conference_list["+ i +"].titlem_top"
      //   const state4 = "Conference_list["+ i +"].id"
      //   this.setData({
      //     [state2]: m_top_string,
      //     [state1]: length_string,
      //     [state3]: titlem_top_string,
      //     [state4]: idd
      //   });
      // }
      console.log("Conference_list:");
      console.log(this.data.Conference_list);
      for ( var i = 0 ; i < this.data.Conference_list.length ; i++) {
        if ( this.data.Conference_list[i].room == '30楼大会议室')
          this.data.thirty_b.push(this.data.Conference_list[i]);
        else if ( this.data.Conference_list[i].room == '30楼小会议室' ) 
          this.data.thirty_s.push(this.data.Conference_list[i]);
        else if ( this.data.Conference_list[i].room == '38楼小会议室' )
          this.data.thirty_eight_s.push(this.data.Conference_list[i]);
        else
          this.data.shanghai_b.push(this.data.Conference_list[i]);
      }
      this.setData({
        thirty_b : this.data.Conference_list,
        thirty_s : this.data.Conference_list,
        thirty_eight_s : this.data.Conference_list,
        shanghai_b : this.data.Conference_list
      });
      console.log(this.data.thirty_b);
      // console.log(this.data.thirty_s);
      // console.log(this.data.thirty_eight_s);
      // console.log(this.data.shanghai_b);
  },
  onReady: function () {
    this.setData({
      timeBean: utils.getWeekDayList(this.data.selectWeek)
    })
  },
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    console.log(event)
    let yy = new Date(event.detail).getFullYear();
    let mm = new Date(event.detail).getMonth()+1;
    let dd = new Date(event.detail).getDate();
    console.log(yy,mm,dd);
    let datestring = yy + "年" + mm + "月" + dd + "日" ;
    console.log(datestring);
    this.setData({
      show: false,
      date: datestring,
    });
  },
  //查看会议详情
  Tapiteminfo: function(e){
    console.log(e.currentTarget.dataset.id)
    var iteminfo_object = this.data.Conference_list.find(item => item.id == e.currentTarget.dataset.id)
    console.log(iteminfo_object)
    var str= JSON.stringify(iteminfo_object);
    wx.navigateTo({
        url: '../info/info?str='+ str ,
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
    // console.log(this.data.timeBean);
    // console.log(this.data.selectWeek);
    this.setData({
      Request_date: this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day
    })
    console.log(this.data.Request_date);
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
    this.setData({
      Request_date: this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day
    })
    console.log(this.data.Request_date);
    this.onRequest();
  },
  //切换日期
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

  }
})