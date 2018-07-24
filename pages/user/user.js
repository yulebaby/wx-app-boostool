const app = getApp();
const Http = require('./../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{},
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
    if (app.globalData.storeId) {
      this.getData();
    } else {
      wx.showToast({
        title: '登陆失效,请重新登陆',
        icon: 'none'
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '../login/login',
        })
      }, 1500)

    }
    this.setData({
      shopName: app.globalData.userName
    })


  },
  getData() {
    let that = this;
    wx.showLoading({ title: '加载中...' });
    /* 查询完成百分比 */
    Http.post('/user/personalCenter', {
      storeId: app.globalData.storeId
    }).then(res => {
      that.setData({
        forms: res.result
      })
      wx.hideLoading();
    }, _ => {
      wx.hideLoading();
    });
  }
})