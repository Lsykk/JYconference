
// import CryptoJS from '../../CryptoJS-master/rollups/tripledes'
let DES3 = require("../../utils/DES3.js");
let BASE64 = require("../../utils/Base64.js");
var util = require("../../utils/util");
import md5 from "../../utils/MD5";
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
var app = getApp();

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
      // this.requestTask();
      wx.navigateTo({
        url: '../main/main'
      })
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
      // url: 'http://118.31.73.43:9389/wuchan/wexin/getToken/findAppletActivityInfoDetails.do?id='+id,

    
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
          console.log(res.data)
        }
      })
      // this.$http.get(
      //   'http://118.31.73.43:9389/wuchan/wexin/getToken',
      //   {
      //       params: {
      //         login: login,  //这里是发送给服务器的参数（参数名：参数值）  
      //         nowdate: nowdate,
      //         secstr: secstr 
      //       },
      //   }).then((res)=>{
      //       console.log(res)
      //   });

    //   var that = this //创建一个名为that的变量来保存this当前的值  
    //   wx.request({  
    //      url: 'http://118.31.73.43:9389/wuchan/wexin/getToken',  //接口
    //      method: 'post',  
    //      data: {  
    //       login: login,  //这里是发送给服务器的参数（参数名：参数值）  
    //       nowdate: nowdate,
    //       secstr: secstr 
    //      },  
    //      header: {  
    //        'content-type': 'application/x-www-form-urlencoded'  //这里注意POST请求content-type是小写，大写会报错  
    //      },  
    //      success: function (res) {  
    //       //  that.setData({ //这里是修改data的值  
    //       //    test: res.data //test等于服务器返回来的数据  
    //       //  });  
    //        console.log(res)  
    //      }  
    //  });
      // app.apiGet({
      //   url: '接口/findAppletActivityInfoDetails.do?id='+id,
      //   data: {
      //     id,
      //     login,
      //     nowdate,
      //     secstr
          
      //   }
      // }).then((res)=>{
      //   console.log(res);
      //   wx.navigateTo({
      //     url: '../main/main'
      //   })
      // })
      // wx.request( {
      //   url: "http://118.31.73.43:9389/wuchan/wexin/getToken/findAppletActivityInfoDetails.do?login=+id?key=我的appkey&from=CNY&to="+code,
      //   success: function( res ) {
      //     that.setData( {
      //       currencyF_Name: res.data.result[0].currencyF_Name,
      //       currencyT_Name: res.data.result[0].currencyT_Name,
      //       currencyF: res.data.result[0].currencyF,
      //       currencyT: res.data.result[0].currencyT,
      //       currencyFD: res.data.result[0].currencyFD,
      //       exchange: res.data.result[0].exchange,
      //       result: res.data.result[0].result,
      //       updateTime: res.data.result[0].updateTime,
      //     })
      //   }
      // })

      
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
  },
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