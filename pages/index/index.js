
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
    loginstring:''
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
    const darkpassword = md5.hexMD5(this.data.password);
    app.globalData.login = this.data.username ;

    //登录验证参数准备
    const param = {
      login: this.data.username,
      userpassword: darkpassword,
      token: this.data.token 
    }
    const paramstring = JSON.stringify(param) ;
    this.setData({
      loginstring : paramstring
    })
    //发请求 登录验证
    let _that = this;
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
          console.log("登录成功")
          Toast.success('登录成功!');
          wx.reLaunch({
            url:'../main/main?username='+_that.data.username
          })
        }
        else {
          console.log("登录失败");
          Notify({ type: 'danger', message: '用户名或密码输入错误，请重新输入！' });
        }        
      },
      fail (res) {
        console.log(res.data)
      }
    })
  }
})