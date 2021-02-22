App({
  globalData: {
    login: "",
    uid:"",
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
    ]
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
 
  },
  

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
