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
    this.Synchronize()
  },


  /**
   * 获取code
   */
  getLoginCode: function () {
    return new Promise((resolve, reject) => {
      tt.login({
        success (res) {
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
  getUserInfo: function () {
    return new Promise((resolve, reject) => {
      tt.getUserInfo({
        success: function (res2) {
          resolve(res2)
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
      tt.request({
        url: `${URL.hostUrl}/api/Wxapps/dopagetoutiaoUpdateNickname`, // 目标服务器url
        data: {
          nickname: userData.userInfo.nickName,
          id: id,
          uniacid: GLOBAL.uniacid,
          avator: userData.userInfo.avatarUrl
        },
        success: (res3) => {
          resolve(res3)
        },
        fail: (err) => {
          reject(err)
        }
      });
    })
  },

  // 异步请求同步执行
  async Synchronize () {
    const _getLoginCode = await this.getLoginCode()
    const _getUserId = await this.getUserId(_getLoginCode)
    const _getUserInfo = await this.getUserInfo()
    await this.dopagetoutiaoUpdateNickname(_getUserId.data.data.res, _getUserInfo)
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
    this.data.form.title = e.detail.value
  },
  /**
   *
   * 发布内容
   */
  bindContent (e) {
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
          // console.log('res', res);
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
          // console.log('res', res);
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
          // console.log('res', res);
        }
      },
      fail: (err) => {
        reject(err)
      }
    });
  }
})
