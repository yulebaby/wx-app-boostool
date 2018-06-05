const app = getApp();
const Http = require('../../utils/request.js');

const getUserInfo = require('./../../utils/getUserInfo.js');

Page({
  data: {
    userphone: '加载中...'
  },
  onLoad: function (options) {
    /* ----------------- 获取用户信息 ----------------- */
    getUserInfo().then(userInfo => {
      this.setData({ userInfo });
      console.log(userInfo)

      /* --------- 如果会员ID存在 请求会员卡信息 --------- */
      if (userInfo.memberId) {
        this.getCardDetail(userInfo.memberId);
      }

      /* --------- 判断是否绑定过信息 未绑定则跳转到绑定信息页 --------- */
      if (userInfo.status == 0) {
        wx.navigateTo({
          url: '../user/bind-phone/bind-phone?page=2',
        })
      } else if (userInfo.baseInfo == 0) {
        wx.navigateTo({
          url: '../user/bind-info/bind-info?page=2',
        });
      }

      /* --------- 根据openid 获取用户绑定手机号 --------- */
      this.getUserphone(userInfo.openid);
    })
  },
  getUserphone(openid) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/user/getUserInfo', { onlyId: openid }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        let userphone = res.result.userPhone;
        let phoneSubstring = userphone.substring(3, 7);
        userphone = userphone.replace(phoneSubstring, '****');
        _this.setData({ userphone });
      }
    }, err => {
      wx.hideLoading();
    });
  },
  getCardDetail(memberId) {
    wx.showLoading({ title: '加载中...' });
    Http.post('/reserve/getCardDetail', { memberId }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        this.setData({
          totalTimes: res.result.totalTimes,
          remainTimes: res.result.remainTimes,
          remainTong: res.result.remainTong
        })
      }
    }, err => {
      wx.hideLoading();
    });
  },
  makePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.num
    })
  },
})