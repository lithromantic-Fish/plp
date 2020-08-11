const app = getApp()
import GLOBAL from '../util/index.js'
import URL from '../util/host.js'
Page({
  data: {
    userId: null,
    form: {
      title: '',  //标题
      content: ''  //内容
    },
    commentValue: '',//评论
    bottle: {}

  },
  onLoad: function () {

    this.getLoginCode()
      .then(res => {
        return this.getUserId(res);
      })
      .then((res1) => {

        return this.getUserInfo(res1);
      })
      .then((res2) => {
        console.log('22', res2)
        let id = res2[0].data.data.res
        this.data.userId = id
        this.getBottleList()

        return this.dopagetoutiaoUpdateNickname(id, res2[1]);
      }).then(res3 => {
        console.log('res3', res3)
        console.log('this', this);
        // 获取打捞列表
      })


  },


  /**
   * 获取code
   */
  getLoginCode: function () {
    return new Promise((resolve, reject) => {
      tt.login({
        success (res) {
          console.log(`login调用成功${res.code} ${res.anonymousCode}`);
          console.log('resss', res)
          resolve(res)
        },
        fail (err) {
          reject(err)

        },
      });
    })



  },

  /**
   * 获取用户id
   */
  getUserId (res) {
    return new Promise((resolve, reject) => {
      console.log('ces', res);
      tt.request({
        url: `${URL.hostUrl}/api/Wxapps/dopagetoutiaologin`,
        data: {
          uniacid: GLOBAL.uniacid,
          code: res.code,
          anonymous_code: res.anonymousCode
        },
        header: {
          "content-type": "application/json",
        },
        success (res1) {
          console.log('res111111111111', res1.data.data.res);
          console.log('res1', res1.data.data);
          console.log(`request调用成功11111111111 ${JSON.stringify(res1)}`);
          resolve(res1);

        },
        fail (err) {
          console.log(`request调用失败`);
          reject(err)

        },
      })


    })
  },

  /**
   * 通过userId拉起授权窗口
   */
  getUserInfo: function (res1) {
    return new Promise((resolve, reject) => {
      tt.getUserInfo({
        success: function (res2) {
          // var data = {
          //   nickname: res2.userInfo.nickName,
          //   id: res1.data.data.id,
          //   avator: res2.userInfo.avatarUrl
          // }
          console.log('res1', res1)
          console.log('res2', res2)
          resolve([res1, res2]);
        },
        fail: function (err) {
          reject(err);
        }
      })
    })

  },

  /**
   *  更改用户昵称
   * @param {*用户userid} id
   * @param {*用户信息} userData
   */
  dopagetoutiaoUpdateNickname: function (id, userData) {
    return new Promise((resolve, reject) => {
      console.log('userData', userData)
      tt.request({
        url: `${URL.hostUrl}/api/Wxapps/dopagetoutiaoUpdateNickname`, // 目标服务器url
        data: {
          nickname: userData.userInfo.nickName,
          id: id,
          uniacid: GLOBAL.uniacid,
          avator: userData.userInfo.avatarUrl
        },
        success: (res3) => {
          console.log('res3', res3);
          resolve(res3)
        },
        fail: (err) => {
          reject(err)
        }
      });
    })
  },

  /**
   * 发布
   *  title: 标题
      contents : 内容
      user_id:用户ID
      uniacid:小程序后台ID
   */
  publishTap () {
    console.log('tjis', this.data);
    tt.request({
      url: `${URL.hostUrl}/api/Floating/addPlpDynamic`,
      method: 'POST',
      data: {
        title: this.data.form.title,
        contents: this.data.form.content,
        user_id: this.data.userId,
        uniacid: GLOBAL.uniacid
      },
      success: (res) => {
        if (res.data.code == 0) {
          console.log('发布成功');
        }
      },
      fail: (err) => {
        reject(err)
      }
    });
  },

  /**
   * 发布标题
   */
  bindTitle (e) {
    console.log('e', e.detail.value);
    this.data.form.title = e.detail.value
  },
  /**
   *
   * 发布内容
   */
  bindContent (e) {
    console.log('e', e.detail.value);
    this.data.form.content = e.detail.value
  },
  /**
   * 评论打捞的漂流瓶内容
   */

  bindComment () {
    this.data.commentValue = e.detail.value
  },

  // 打捞漂流瓶
  getBottle () {
    tt.request({
      url: `${URL.hostUrl}/api/Floating/salvagePlpDynamic`,
      method: 'POST',
      data: {
        user_id: this.data.userId,
        uniacid: GLOBAL.uniacid
      },
      success: (res) => {
        if (res.data.code == 0) {
          console.log('res', res);
          this.setData({
            bottle: res.data.data
          })
        }
      },
      fail: (err) => {
        reject(err)
      }
    });
  },

  // 评论打捞的漂流瓶
  commentBottle () {
    tt.request({
      url: `${URL.hostUrl}/api/Floating/plpComment`,
      method: 'POST',
      data: {
        comment_user_id: this.data.bottle.user_id,
        uniacid: GLOBAL.uniacid,
        orgin_id: this.data.bottle.id
      },
      success: (res) => {
        if (res.data.code == 0) {
          console.log('res', res);
        }
      },
      fail: (err) => {
        reject(err)
      }
    });
  },

  // 获取打捞列表
  getBottleList () {
    tt.request({
      url: `${URL.hostUrl}/api/Floating/getMyPlpSalvageList`,
      method: 'POST',
      data: {
        user_id: this.data.userId,
        uniacid: GLOBAL.uniacid
      },
      success: (res) => {
        if (res.data.code == 0) {
          console.log('res', res);
        }
      },
      fail: (err) => {
        reject(err)
      }
    });
  }
})
