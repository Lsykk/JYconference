var util = require("../../utils/util");
var utils = require("../../utils/time-utils");
let BASE64 = require("../../utils/Base64.js");
let DES3 = require("../../utils/DES3.js");

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
    Request_date:''
  },
  onLoad: function (option) {
    // console.log(option);
    this.setData({
      username: option.username
    });
    this.onRequest();
  },
  onRequest:function(){
    let _that = this;
    const key = 'A1B2C3D4E5F60708';
    const nowdate = util.formatTime(new Date()) ;
    const nowdate_deal = nowdate.substr(0,10).replace(new RegExp("/","gm"),"-")
    console.log(nowdate_deal);
    this.setData({
      Request_date: nowdate_deal
    })
    const secstring = _that.data.username + '|' + nowdate ;
    const secstr = BASE64.encoder(DES3.encrypt(key, secstring));
    //发请求 获取token
    wx.request({
        url: 'http://118.31.73.43:9389/wuchan/weixin/getToken.jsp',
        method: "post",
        data: {
            login: _that.data.username,
            nowdate: nowdate,
            secstr: secstr 
        },
        header: {
          'content-type': 'application/json'
        },
        success (res) {
          console.log("获取token成功")
          console.log(res.data)
          var newtoken = 'newtoken';
          _that.setData({
            user_token: newtoken
          });
          _that.onGetConfList();
        },
        fail (res) {
          console.log("获取token失败");
          console.log(res.data)
          // _that.onGetConfList();
        }
    })
  },
  onGetConfList: function() {
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
        }, {
          id:'002',
          room: "30#大",
          title: "综合部",
          name: "综合部年度总结会议",
          people: "赟总",
          s_time:"2021-01-21 13:30:00",
          e_time:"2021-01-21 16:30:00",
          attendee:['AAA','AAA','AAA','AAA','AAA','AAA'],
          length:"",
          m_top:'',
          titlem_top:''
        }, 
        {
          id:'003',
          room: "30#小",
          title: "信息部",
          name: "信息部年度总结会议",
          people: "赟总",
          s_time:"2021-01-21 08:45:00",
          e_time:"2021-01-21 09:30:00",
          attendee:['CCC','CCC','CCC','CCC','CCC','CCC'],
          length:"",
          m_top:'',
          titlem_top:''
        },{
          id:'004',
          room: "38#大",
          title: "财务部",
          name: "财务部年度总结会议",
          people: "赟总",
          s_time:"2021-01-21 10:45:00",
          e_time:"2021-01-21 11:30:00",
          attendee:['DDD','DDD','DDD','DDD','DDD','DDD'],
          length:"",
          m_top:'',
          titlem_top:''
        }, {
          id:'005',
          room: "上海#大",
          title: "综合部",
          name: "综合部年度总结会议",
          people: "赟总",
          s_time:"2021-01-21 13:30:00",
          e_time:"2021-01-21 16:30:00",
          attendee:['EEE','EEE','EEE','EEE','EEE','EEE'],
          length:"",
          m_top:'',
          titlem_top:''
        }, {
          id:'006',
          room: "38#大",
          title: "全体",
          name: "全体年度总结会议",
          people: "赟总",
          s_time:"2021-01-21 17:00:00",
          e_time:"2021-01-21 17:30:00",
          attendee:['FFF','FFF','FFF','FFF','FFF','FFF'],
          length:"",
          m_top:'',
          titlem_top:''
        }
      ];
    //获取会议室信息
    let _that = this;
    wx.request({
        url: 'http://118.31.73.43:9389/wuchan/weixin/meeting.jsp',
        // url: 'http://118.31.73.43:9389',
        method: "post",
        data: {
          token: _that.data.user_token,
          startdate: _that.data.Request_date,
          enddate: _that.data.Request_date
        },
        header: {
          'content-type': 'application/json'
        },
        success (res) {
          console.log("获取token成功");
          console.log(res.data)
          _that.setData({
            Conference_list : datas
          });
          _that.onListDeal();
        },
        fail (res) {
          console.log("获取token失败");
          console.log(res.data)
          // _that.setData({
          //   Conference_list : datas
          // });
          // _that.onListDeal();
        }
    })
  },
  onListDeal:function() {
      for ( var i = 0 ; i < this.data.Conference_list.length ; i++) {
        var chuo_s = new Date(this.data.Conference_list[i].s_time.replace(/-/g,"/")).getTime()
        var chuo_e = new Date(this.data.Conference_list[i].e_time.replace(/-/g,"/")).getTime()
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
        const state1 = "Conference_list["+ i +"].length"
        const state2 = "Conference_list["+ i +"].m_top"
        const state3 = "Conference_list["+ i +"].titlem_top"
        this.setData({
          [state2]: m_top_string,
          [state1]: length_string,
          [state3]: titlem_top_string
        });
      }
      for ( var i = 0 ; i < this.data.Conference_list.length ; i++) {
        if ( this.data.Conference_list[i].room == '30#大')
          this.data.thirty_b.push(this.data.Conference_list[i]);
        else if ( this.data.Conference_list[i].room == '30#小' ) 
          this.data.thirty_s.push(this.data.Conference_list[i]);
        else if ( this.data.Conference_list[i].room == '38#大' )
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