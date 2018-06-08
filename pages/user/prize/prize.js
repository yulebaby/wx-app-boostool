// pages/user/prize/prize.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShareAppMessage() {
    return {
      title: '首次游泳体验超值代金券快去领，请叫我雷锋~',
      path: '/page/user?id=123'
    }
  }
})
