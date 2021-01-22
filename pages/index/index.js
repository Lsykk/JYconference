
// import CryptoJS from '../../CryptoJS-master/rollups/tripledes'
let DES3 = require("../../utils/DES3.js");
let BASE64 = require("../../utils/Base64.js");
var util = require("../../utils/util");
import md5 from "../../utils/MD5";
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

Page({
  data: {
    username:'',
    password:''
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  // encryptByDESModeEBC: function(message){
  //   var key = 'BOTWAVEE';
  //   var keyHex = CryptoJS.enc.Utf8.parse(key);
  //   var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
  //   mode: CryptoJS.mode.ECB,
  //   padding: CryptoJS.pad.Pkcs7
  //   });
  //   return encrypted.ciphertext.toString();
  // },
  Login: function(){
    // console.log(this.data.username,this.data.password)
    // console.log(this.encryptByDESModeEBC('1111',"rrettre","234234234"))
    if ( this.data.username == '' || this.data.password == ''){
      Notify({ type: 'danger', message: '用户名或密码不能为空!' });
      return false;
    }
    else {
      wx.navigateTo({
        url: '../main/main'
      })
      // 接口1 token获取
      // 参数：login:”yzh”, nowdate:”当前日期”, secstr:”加密串”
      // 说明secstr  为  tzh|nowdate 拼接串的  des 加密值
      // 返回参数：成功 {ret:0,token:}  失败 {ret:1,msg:} 
      var nowdate = util.formatTime(new Date()) ; //当前日期
      var key = 'BOTWAVEE'; //密钥
      var secstring = this.data.username + '|' + nowdate ; //拼接串
      var secstr = BASE64.encoder(DES3.encrypt(key, secstring));//加密串
      Notify({ type: 'primary', message: '用户名:'+ this.data.username + '密码:' + this.data.password + 'DES加密之后：'+ secstr + '密钥:' + key});
      // console.log(nowdate);
      // console.log(secstring);
      // console.log(secstr);
      
      //接口函数 this.data.username nowdate secstr
      //http://118.31.73.43:9389/wuchan/wexin/getToken
      //得到token
      

      // 登录接口
      //参数 login:this.data.username ,userpassword: ”MD5加密”, token:
      //MD5加密 
      var darkpassword = md5.hexMD5(this.data.password);
      console.log(darkpassword);
      Notify({ type: 'primary', message: '用户名:'+ this.data.username + '密码:' + this.data.password + 'MD5加密之后：'+ darkpassword });
      //接口函数 this.data.username darkpassword token
      //http://118.31.73.43:9389/wuchan/wexin/verification

      //成功则跳转
      // wx.navigateTo({
      //   url: '../main/main'
      // })
      //传token过去 会议详情接口要用

    }
  }
})