const getUserInfo = require('./../../../utils/getUserInfo.js');
const Http = require('./../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponItems: [],
    showAlert: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getUserInfo().then(userInfo => {
      wx.showLoading({ title: '加载中...' });
      Http.post('/coupon/listMyReceiveCoupon', { onlyId: userInfo.openid }).then(res => {
        this.setData({ couponItems: res.code == 1000 ? res.result : [] });
      })
    })
  },
  useCoupon(e) {
    this.setData({ showAlert: true, useStatus: e.target.dataset.status });
  },
  closeAlert() { this.setData({ showAlert: false }); }
})