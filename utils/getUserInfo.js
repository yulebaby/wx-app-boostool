const app = getApp();

/**
 *
 * @module 获取用户信息
 * ---------------------------------------------------------------
 * @description 
 * 
 *      判断App.js 是否存储用户信息（是否为第一次调用）
 *        
 *          第一次调用：
 *              监测用户登录状态是否过期：
 *                    未过期 => 获取本地存储用户信息并返回成功
 *                    已过期 => 调用登录方法，获取用户信息存储至本地并返回
 *          不是第一次：
 *              获取App.userInfo 并返回
 *
 * ---------------------------------------------------------------
 * @author phuhoang
 * @time 2018-06-05
 * ---------------------------------------------------------------
 */
const Login = () => {
  return new Promise( (resolve, reject) => {
    wx.login({
      success(res) {
        wx.request({
          url: `${app.domain}/user/judgeUserStatus`,
          method: "POST",
          data: `code=${res.code}`,
          dataType: 'json',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            if (res.data.code == 1000) {
              resolve(res.data.result);
              app.userInfo = res.data.result;
              wx.setStorageSync('userInfo', JSON.stringify(res.data.result));
            } else {
              reject(null);
            }
          },
          fail(err) {
            reject(err);
          }
        })
      }
    })
  })
}
const GetUserInfo = () => {
  return new Promise( (resolve, reject) => {
    if (app.userInfo.openid) { resolve(app.userInfo); }
    wx.checkSession({
      success(res) {
        try {
          let userInfo = wx.getStorageSync('userInfo');
          app.userInfo = JSON.parse(userInfo);
          resolve(app.userInfo);
        } catch (e) {
          Login().then(res => {
            resolve(res)
          }).catch(err => { 
            reject(null)
          })
        }
      },
      fail() {
        Login().then(res => {
          resolve(res)
        }).catch(err => {
          reject(null)
        })
      }
    });

  })
}


module.exports = GetUserInfo;