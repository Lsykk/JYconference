var util = require("../../utils/util");
var utils = require("../../utils/time-utils")

Page({
  data: {
    selectWeek:0,
    timeBean:{},
    datastring:'',
    Conference_list: [],
    thirty_b:[],
    thirty_s:[],
    thirty_eight_b:[],
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
    ]
  },
  onLoad: function (options) {
    //默认先获取当天的会议列表
    //页面跳转传值 接收token
    //this.setData({ }) 

    this.onRequest();
  },
  onRequest:function(){
    //获取数据 赋值
    var nowdate = util.formatTime(new Date()) ; //当前日期
    //格式处理成 2020-01-20 格式
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
        m_top:''
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
        m_top:''
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
        m_top:''
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
        m_top:''
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
        m_top:''
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
        m_top:''
      }
    ];
    // console.log(datas)
    this.setData({
      Conference_list : datas
    })
    // console.log( this.data.Conference_list.length)
    //修改Conference_list的length和m_top属性
    for ( var i = 0 ; i < this.data.Conference_list.length ; i++) {
      var chuo_s = new Date(this.data.Conference_list[i].s_time.replace(/-/g,"/")).getTime()
      var chuo_e = new Date(this.data.Conference_list[i].e_time.replace(/-/g,"/")).getTime()
      var length_num = (chuo_e - chuo_s) / 30000 ;
      // console.log(chuo_s);
      // console.log(chuo_e - chuo_s);
      // console.log((chuo_s - 1611189000000 )/ 324000);
      var length_num = (chuo_e - chuo_s) / 30000 ;
      var m_top_num = (chuo_s - 1611189000000 )/ 324000 * 2.6 ;
      var length_string = length_num.toString()+"px";
      var m_top_string = m_top_num.toString() + "%";
      const state1 = "Conference_list["+ i +"].length"
      const state2 = "Conference_list["+ i +"].m_top"
      this.setData({
        [state2]: m_top_string,
        [state1]: length_string
      });
    }
    //分组 根据会议室不同将Conference_list分成四个数组
    for ( var i = 0 ; i < this.data.Conference_list.length ; i++) {
      if ( this.data.Conference_list[i].room == '30#大')
        this.data.thirty_b.push(this.data.Conference_list[i]);
      else if ( this.data.Conference_list[i].room == '30#小' ) 
        this.data.thirty_s.push(this.data.Conference_list[i]);
      else if ( this.data.Conference_list[i].room == '38#大' )
        this.data.thirty_eight_b.push(this.data.Conference_list[i]);
      else
        this.data.shanghai_b.push(this.data.Conference_list[i]);
    }
    // console.log(this.data.thirty_b);
    this.setData({
      thirty_b : datas,
      thirty_s : datas,
      thirty_eight_b : datas,
      shanghai_b : datas
    });
  },
  onReady: function () {
    this.setData({
      timeBean: utils.getWeekDayList(this.data.selectWeek)
    })
  },
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
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
    //或者后端给一个接口 传入id 显示会议详情

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
    })
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
    console.log(this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[this.data.timeBean.selectDay].day)
  },



})