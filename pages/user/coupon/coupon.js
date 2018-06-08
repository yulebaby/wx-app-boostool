const getUserInfo = require('./../../../utils/getUserInfo.js');
const Http = require('./../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})