const app = getApp()
import global from '../util/index.js'
Page({
  data: {
    code: null
  },
  onLoad: function () {

    this.getLoginCode()
    .then(res=>{
      return this.getCode(res);
    })
    .then((res1,aa)=>{
      console.log('ress',res1)
      console.log('other',aa)
      return this.getUserInfo(res1);
    })
    .then((res2)=>{
      // return this.dopagetoutiaoUpdateNickname(res,res1);
    })
  },


  getLoginCode: function () {
    return new Promise((resolve, reject) => {
      tt.login({
        success(res) {
          console.log(`login调用成功${res.code} ${res.anonymousCode}`);
          console.log('resss', res)
          resolve(res)
        },
        fail(err) {
          reject(err)

        },
      });
    })



  },

  getCode(res) {
    return new Promise((resolve, reject) => {
      console.log('ces',res);
      tt.request({
        url: "https://mall.hongchenggyun.com/api/Wxapps/dopagetoutiaologin",
        data: {
          uniacid: global.uniacid,
          code: res.code,
          anonymous_code: res.anonymousCode
        },
        header: {
          "content-type": "application/json",
        },
        success(res1) {
          let aa = 20
          resolve(res1,aa);
          console.log(`request调用成功11111111111 ${JSON.stringify(res1)}`);

        },
        fail(err) {
          console.log(`request调用失败`);
          reject(err)

        },
      })


    })
  },


  getUserInfo: function (res1) {

    return new Promise((resolve, reject) => {
      tt.getUserInfo({
        success: function (res2) {
          var data = {
            nickname: res2.userInfo.nickName,
            id: res1.data.data.id,
            avator: res2.userInfo.avatarUrl
          }
          resolve(res2);
        },
        fail: function (err) {
          reject(err);
        }
      })
    })

  },

  dopagetoutiaoUpdateNickname: function (res1, res2) {
    console.log('res1',res1)
    console.log('res2',res2)
    // return new Promise((resolve, reject) => {
    //   tt.request({
    //     url: 'https://mall.hongchenggyun.com/api/Wxapps/dopagetoutiaoUpdateNickname', // 目标服务器url
    //     data: {
    //       nickname: res2.userInfo.nickName,
    //       id: res1.data.data.id,
    //       uniacid: global.uniacid,
    //       avator: res2.userInfo.avatarUrl
    //     },
    //     success: (res3) => {
    //       console.log('res3', res3);
    //     },
    //     fail:(err)=>{
    //       reject(err)
    //     }
    //   });
    // })
  }


  


})
