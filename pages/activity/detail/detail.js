const getUserInfo = require('./../../../utils/getUserInfo.js');
const getAddress = require('./../../../utils/getAddress.js');
const Http = require('./../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: null,
    receiveItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ type: options.text || null, shopId: options.shopId });
    wx.removeStorageSync('userPhone');
    getUserInfo().then(userInfo => {
      this.setData({ userInfo });
      Http.post('/coupon/listMySendCoupon', { onlyId: userInfo.openid }).then( res => {
        if (res.code == 1000) {
          res.result.map(item => { item.receivePhone = item.receivePhone.replace(item.receivePhone.substring(3, 9), ' **** **'); })
          this.setData({ receiveItems: res.result });
        }
      })
    });
    getAddress( res => {
        wx.showLoading({ title: '加载中...' });
        Http.post('/shop/getShopDetail', {
          paramJson: JSON.stringify({
            id: options.shopId,
            lon: res.location.lng,
            lat: res.location.lat
          })
        }).then(res => {
          wx.hideLoading();
          this.setData({ shopInfo: res.code == 1000 ? res.result : {} });
        });
    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '首次游泳体验超值代金券快去领，请叫我雷锋~',
      path: `/pages/activity/activity?phone=${this.data.userInfo.userPhone}`
    }
  }
})