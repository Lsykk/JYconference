
let DES3 = require("../../utils/DES3.js");
let BASE64 = require("../../utils/Base64.js");
var util = require("../../utils/util");
var CryptoJS = require('../../utils/tripledes')
var keyHex = CryptoJS.enc.Utf8.parse("A1B2C3D4E5F60708");
import md5 from "../../utils/MD5";
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var app = getApp();

Page({
  data: {
    username:'',
    password:'',
    token:'undefined_token',
    Paramstring:'',
    Param_json:''
  },
  Login_first: function(){
    if ( this.data.username == '' || this.data.password == ''){
      Notify({ type: 'danger', message: '用户名或密码不能为空!' });
      return false;
    }
    else {
      //获取token
      const key = 'A1B2C3D4E5F60708';
      let login = this.data.username;
      let nowdate = util.formatTime(new Date()) ;
      let nowdate_deal = nowdate.substr(0,10).replace(new RegExp("/","gm"),"-")
      let secstring = this.data.username + nowdate_deal ;
      login = "ttt"
      nowdate_deal = "2021-01-25"
      secstring = "ttt2021-01-25" ;
      console.log(secstring);
      //des3加密
      // const secstr = BASE64.encoder(DES3.encrypt(key, secstring));
      //des（ecb模式）加密
      var secstr_desecb = CryptoJS.DES.encrypt( "ttt2021-01-25","A1B2C3D4E5F60708",{
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
      });
      //测试 加密之后
      const secstr = secstr_desecb.toString();
      console.log("加密之后"+ secstr );
      const param = {
        login: login,
        nowdate: nowdate_deal,
        secstr: secstr 
      }
      console.log(param);
      const paramstring = JSON.stringify(param) ;
      // console.log(paramstring);
      this.setData({
        Param_json : param,
        Paramstring : paramstring
      })
      console.log(this.data.Param_json)
      console.log("string"+this.data.Paramstring)
      //发请求 获取token
      let _that = this;
      wx.request({
        url: 'http://118.31.73.43:9389/wuchan/weixin/getToken.jsp?tokenParam='+ _that.data.Paramstring,
        method: "post",
        data : {
          "tokenParam" : _that.data.Paramstring
        },
        header: {
          'content-type': 'text/plain'
        },
        success (res) {
          console.log("获取token成功");
          console.log(res);
          // this.Login_second();
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
    console.log(darkpassword);
    let _that = this;
    wx.request({
      url: 'http://118.31.73.43:9389/wuchan/weixin/verification.jsp',
      method: "post",
      data: {
          login: _that.data.username,
          userpassword: darkpassword,
          token: _that.data.token
      },
      header: {
        'content-type': 'application/json'
      },
      success (res) {
        console.log("登录成功")
        // console.log(res.data)
        Toast.success('登录成功!');
        // var username= _that.data.username;
        // wx.navigateTo({
        //   url: '../main/main?username='+ username ,
        // })
        wx.reLaunch({
          url:'../main/main?username='+_that.data.username
        })
      },
      fail (res) {
        console.log("登录失败");
        console.log(res.data)
      }
    })
  }
})