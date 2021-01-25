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
  //接收username
  onLoad: function (option) {
    //默认先获取当天的会议列表
    //页面跳转传值 接收username
    console.log(option);
    //更新全局username值
    this.setData({
      username: option.username
    });
    //请求当天会议信息
    this.onRequest();
  },
  //获取token
  onRequest:function(){
    //获取数据 赋值
    // const nowdate = util.formatTime(new Date()) ; //当前日期
    // const nowdate_deal = nowdate.substr(0,10).replace(new RegExp("/","gm"),"-")
    // console.log(nowdate_deal);
    // 获取token
    let _that = this;
    const key = 'A1B2C3D4E5F60708'; //密钥
    const nowdate = util.formatTime(new Date()) ; //当前日期
    const nowdate_deal = nowdate.substr(0,10).replace(new RegExp("/","gm"),"-")
    console.log(nowdate_deal);
    this.setData({
      Request_date: nowdate_deal
    })
    const secstring = _that.data.username + '|' + nowdate ; //拼接串
    const secstr = BASE64.encoder(DES3.encrypt(key, secstring));//加密串
    //请求token
    wx.request({
        url: 'https://118.31.73.43:9389/wuchan/wexin/getToken',
        method: "post",
        data: {
            login: _that.data.username,
            nowdate: nowdate,
            secstr: secstr 
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log("获取token成功")
          console.log(res.data)
          var newtoken = 'newtoken';
          //更新全局token值
          _that.setData({
            user_token: newtoken
          });
          _that.onGetConfList();
        },
        fail (res) {
          console.log("获取token失败");
          //最后要注释掉
          _that.onGetConfList();
        }
    })

  },
  //获取会议室列表
  onGetConfList: function() {
    //接口函数
    //接口地址：http://118.31.73.43:9389/wuchan/wexin/meeting
    //参数值：{token:,startdate:”2020-01-20”,enddate:”2020-01-25”}
    //会议列表赋值给Conference_list
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

    let _that = this;
    wx.request({
        url: 'https://118.31.73.43:9389/wuchan/wexin/meeting',
        method: "post",
        data: {
          token: _that.data.user_token,
          startdate: _that.data.Request_date,
          enddate: _that.data.Request_date
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log("获取token成功");
          _that.setData({
            Conference_list : datas
          });
          _that.onListDeal();
        },
        fail (res) {
          console.log("获取token失败");
          //最后要注释掉
          _that.setData({
            Conference_list : datas
          });
          _that.onListDeal();
        }
    })
  },
  onListDeal:function() {
    //修改Conference_list的length和m_top属性和titlem_top属性
      for ( var i = 0 ; i < this.data.Conference_list.length ; i++) {
        var chuo_s = new Date(this.data.Conference_list[i].s_time.replace(/-/g,"/")).getTime()
        var chuo_e = new Date(this.data.Conference_list[i].e_time.replace(/-/g,"/")).getTime()
        var length_num = (chuo_e - chuo_s) / 30000 ;
        // console.log(chuo_s);
        // console.log(chuo_e - chuo_s);
        // console.log((chuo_s - 1611189000000 )/ 324000);
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
          [state3]: titlem_top_string,
        });
      }
      //分组 根据会议室不同将Conference_list分成四个数组
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
      //更新四个会议室数组
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

    //datestring 格式处理成 2020-01-20 格式
    //接口函数
    //接口地址：http://118.31.73.43:9389/wuchan/wexin/meeting
    //参数值：{token:,startdate:”2020-01-20”,enddate:”2020-01-25”}



    //会议列表赋值给Conference_list
    //刷新页面


  },
  Tapiteminfo: function(e){
    //根据id 筛选出会议 显示会议详情
    // console.log("点击查看详情")
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