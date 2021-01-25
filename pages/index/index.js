
// import CryptoJS from '../../CryptoJS-master/rollups/tripledes'
let DES3 = require("../../utils/DES3.js");
let BASE64 = require("../../utils/Base64.js");
var util = require("../../utils/util");
import md5 from "../../utils/MD5";
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var app = getApp();

Page({
  data: {
    username:'',
    password:'',
    token:'undefined_token'
  },
  Login_first: function(){
    // console.log(this.data.username,this.data.password)
    if ( this.data.username == '' || this.data.password == ''){
      Notify({ type: 'danger', message: '用户名或密码不能为空!' });
      return false;
    }
    else {
      // this.requestTask();
      // wx.navigateTo({
      //   url: '../main/main'
      // })
      // 接口1 token获取
      // 参数：login:”yzh”, nowdate:”当前日期”, secstr:”加密串”
      // 说明secstr  为  tzh|nowdate 拼接串的  des 加密值
      // 返回参数：成功 {ret:0,token:}  失败 {ret:1,msg:} 
      
      //接口函数 this.data.username nowdate secstr
      //http://118.31.73.43:9389/wuchan/wexin/getToken
      //得到token
      const key = 'A1B2C3D4E5F60708'; //密钥
      const login = this.data.username; //账号
      const nowdate = util.formatTime(new Date()) ; //当前日期
      const secstring = this.data.username + '|' + nowdate ; //拼接串
      const secstr = BASE64.encoder(DES3.encrypt(key, secstring));//加密串
      // console.log(nowdate);
      // console.log(secstring);
      // console.log(secstr);
      Notify({ type: 'primary', message: '用户名:'+ this.data.username + '密码:' + this.data.password + 'DES加密之后：'+ secstr + '密钥:' + key});

      //请求token
      let _that = this;
      wx.request({
        url: 'https://118.31.73.43:9389/wuchan/wexin/getToken',
        method: "post",
        data: {
            login: login,
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
          //更新全局token
          _that.setData({
            token : newtoken
          })
          _that.Login_second();
        },
        fail (res) {
          console.log("获取token失败");
          _that.Login_second(); //最后要注释掉
        }
      })
    }
  },
  Login_second() {
    console.log("进入Login_second函数");
    // 登录接口
    //参数 login:this.data.username ,userpassword: ”MD5加密”, token:
    //MD5加密 
    //接口函数 this.data.username darkpassword token
    //http://118.31.73.43:9389/wuchan/wexin/verification
    const darkpassword = md5.hexMD5(this.data.password);
    console.log(darkpassword);
    Notify({ type: 'primary', message: '用户名:'+ this.data.username + '密码:' + this.data.password + 'MD5加密之后：'+ darkpassword });

    let _that = this;
    wx.request({
      url: 'https://118.31.73.43:9389/wuchan/wexin/verification',
      method: "post",
      data: {
          login: _that.data.username,
          userpassword: darkpassword,
          token: _that.data.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log("登录成功")
        console.log(res.data)
        Toast.success('登录成功!');
        //跳转页面
        var username= _that.data.username;
        wx.navigateTo({
          url: '../main/main?username='+ username ,
        })
      },
      fail (res) {
        console.log("登录失败");
        console.log(res.data)
        //最后要注释掉
        var username= _that.data.username;
        wx.navigateTo({
          url: '../main/main?username='+ username ,
        })
      }
    })
  }
  /* 获取数据
* @param api: 请求路由
* @param params: 查找数据
* @param headers: 请求头
* @param http_method: 请求方法
*/
//  requestTask(api, params, headers, httpMethod) {
//   // console.log(api, params, headers, httpMethod);
//   const key = 'A1B2C3D4E5F60708'; //密钥
//   const login = this.data.username; //账号
//   const nowdate = util.formatTime(new Date()) ; //当前日期
//   const secstring = this.data.username + '|' + nowdate ; //拼接串
//   const secstr = BASE64.encoder(DES3.encrypt(key, secstring));//加密串
//   return new Promise((resolve, reject) => {
//      wx.request({
//          url: 'https://118.31.73.43:9389/wuchan/wexin/getTokenss',
//          data: {  
//           login: login,  //这里是发送给服务器的参数（参数名：参数值）  
//           nowdate: nowdate,
//           secstr: secstr 
//          },  
//         header: {
//           'content-type': 'application/json' // 默认值
//         },
//          method: "post",
//             success: res => {
//                 resolve(res);
//             },
//             fail: res => {
//                 resolve(res);
//          },
//     });
//  });
// }
})