App({
  globalData: {
    login: "",
    uid:""
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // wx.requestSubscribeMessage({
    //   tmplIds: ["COmZQC5X2dQkMd7qDV_pm2PzniWxTp_cGLtdIrkpSbM"],
    //   success: function (res) {
    //     if (res.COmZQC5X2dQkMd7qDV_pm2PzniWxTp_cGLtdIrkpSbM === 'accept'){
    //       wx.showToast({
    //         title: '订阅OK！',
    //       })
    //     }
    //     console.log(res)
    //     //成功
    //   },
    //   fail(err) {
    //     //失败
    //     console.error(err);
    //   }
    // })
    
 
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
