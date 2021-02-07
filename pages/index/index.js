
var util = require("../../utils/util");
import md5 from "../../utils/MD5";
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var app = getApp();
Page({
  data: {
    username:'',
    password:'',
    token:'',
    Paramstring:'',
    loginstring:'',
    code: null,
    access_token:''
  },
  //获取token
  Login_first: function(){
    if ( this.data.username == '' || this.data.password == ''){
      Notify({ type: 'danger', message: '用户名或密码不能为空!' });
      return false;
    }
    else {
      //获取token
      let login = this.data.username;
      let nowdate = util.formatTime(new Date()) ;
      let nowdate_deal = nowdate.substr(0,10).replace(new RegExp("/","gm"),"-")
      let secstring = this.data.username + nowdate_deal ;
      const secstr = md5.hexMD5(secstring);

      //获取token参数准备
      const param = {
        login: login,
        nowdate: nowdate_deal,
        secstr: secstr 
      }
      const paramstring = JSON.stringify(param) ;
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
            token : res.data.token
          })
          _that.Login_second();
        },
        fail (res) {
          console.log("获取token失败");
          console.log(res)
        }
      })
    }
  },
  //登录验证
  Login_second() {
    let _that = this;
    //获取小程序全局唯一后台接口调用凭据（access_token）
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET',
      method: "get",
      data : {
        "grant_type" : 'client_credential',
        "appid" : 'wxa942667c17cd73e0',
        "secret" : '03a55d9bb6296f5f0f2eb87c94610fed'
      },
      header: {
        'content-type': 'text/plain'
      },
      success (res) {  
        // console.log(res)
        _that.setData({
          access_token : res.data.access_token
        })
        // console.log("拿到的access_token: "+_that.data.access_token);
        //获取code+登录验证接口
        wx.login({
          success (res) {
            // console.log(res);
            if (res.code) {
              // console.log('获取code成功')
              _that.setData({
                code : res.code
              })
              // console.log("拿到的code: "+_that.data.code)
              const darkpassword = md5.hexMD5(_that.data.password);
              app.globalData.login = _that.data.username ;
              //登录验证参数准备
              const param = {
                login: _that.data.username,
                userpassword: darkpassword,
                token: _that.data.token,
                code: _that.data.code,
                access_token: _that.data.access_token
              }
              const paramstring = JSON.stringify(param) ;
              _that.setData({
                loginstring : paramstring
              })
              // console.log("登录验证接口的请求参数:"+_that.data.loginstring);
              //发请求 登录验证
              wx.request({
                url: 'http://118.31.73.43:9389/wuchan/weixin/verification.jsp'+'?'+'login='+ _that.data.loginstring,
                method: "post",
                data: {
                    "login" : _that.data.loginstring
                },
                header: {
                  'content-type': 'text/plain'
                },
                success (res) {
                  app.globalData.uid = res.data.msg ;
                  if ( ! res.data.ret ) {
                    // console.log("登录成功")
                    Toast.success('登录成功!');
                    wx.showModal({
                          title: '温馨提示',
                          content: '为更好的管理您的日程安排，服务号需要在会议开始前向您发送提示消息',
                          confirmText:"同意",
                          cancelText:"拒绝",
                          success: function (res) {
                              if (res.confirm) {
                                  //调用订阅消息
                                  // console.log('用户点击确定');
                                  //调用订阅
                                  _that.requestSubscribe();
                              } else if (res.cancel) {
                                  // console.log('用户点击取消');
                                  ///显示第二个弹说明一下
                                  wx.showModal({
                                    title: '温馨提示',
                                    content: '拒绝后您将无法收到会议提示信息!',
                                    confirmText:"知道了",
                                    showCancel:false,
                                    success: function (res) {
                                        wx.reLaunch({
                                          url:'../main/main?username='+_that.data.username
                                      })
                                    }
                                });
                              }
                          }
                      });
                  }
                  else {
                    // console.log("登录失败");
                    Notify({ type: 'danger', message: '用户名或密码输入错误，请重新输入！' });
                  }        
                },
                fail (res) {
                  console.log(res.data)
                }
              })
            } else {
              console.log('获取code失败！' + res.errMsg)
            }
          }
        })
      },
      fail (res) {
        console.log(res)
      }
    })
  },
  ///发起消息订阅
  requestSubscribe: function(){
    let that = this ;
    wx.requestSubscribeMessage({
          tmplIds: ['COmZQC5X2dQkMd7qDV_pm2PzniWxTp_cGLtdIrkpSbM','qQPg60Y6DVo8U7yrWqeRYYru5s4qBz1RIyw4jEBMYkM'],
          success(res){
              // 模板id1的处理逻辑
              if (res['COmZQC5X2dQkMd7qDV_pm2PzniWxTp_cGLtdIrkpSbM'] === 'accept') {
                  // console.log("用户订阅了会议通知");
              } else if (res['COmZQC5X2dQkMd7qDV_pm2PzniWxTp_cGLtdIrkpSbM'] === 'reject') {
                  // console.log("用户取消订阅会议通知");
                  wx.showModal({
                    title: '提示',
                    content: '你取消订阅会议通知',
                    showCancel: false
                  })
              }else {
                wx.showToast({
                  title: '授权会议通知订阅消息有误',
                  icon: 'none'
                })
              }
              // 模板id2的处理逻辑
              if (res['qQPg60Y6DVo8U7yrWqeRYYru5s4qBz1RIyw4jEBMYkM'] === 'accept') {
                // console.log("用户订阅了日程通知");
              } else if (res['qQPg60Y6DVo8U7yrWqeRYYru5s4qBz1RIyw4jEBMYkM'] === 'reject') {
                // console.log("用户取消订阅行程通知");
                wx.showModal({
                  title: '提示',
                  content: '你取消订阅日程通知',
                  showCancel: false
                })
              }else {
                wx.showToast({
                  title: '授权日程通知订阅消息有误',
                  icon: 'none'
                })
              }
          },
          fail :(errCode,errMessage) =>{ 
            console.log("订阅消息 失败 "+errCode+" message "+errMessage);
          },
          complete:(errMsg)=>{
            console.log("订阅消息 完成 ");
            // console.log(errMsg);
            //跳转至 会议中心
            wx.reLaunch({
                url:'../main/main?username='+that.data.username
            })
          }
    });
  }
})