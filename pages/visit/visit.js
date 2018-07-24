const app = getApp();
const Http = require('./../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    tab1:{},
    tab2: {},
    tab3: {}        
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
    this.getData();
  },
  switchTab(e) {
    this.setData({ currentTab: e.currentTarget.dataset.current });
    this.getData();    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  getData() {
    let that = this;
    if (that.data.currentTab == 1) {
      wx.showLoading({ title: '加载中...' });
      Http.post('/returnVisit/clueVisit', {
        storeId: app.globalData.storeId
      }).then(res => {
        let clue = (res.result.doneClueNum / res.result.cluesNum).toFixed(2);
        that.setData({
          tab1: res.result,
        })
        wx.hideLoading();
      }, _ => {
        wx.hideLoading();
      });
    } else if (that.data.currentTab == 2) {
      wx.showLoading({ title: '加载中...' });
      Http.post('/analysis/experience', {
        storeId: app.globalData.storeId
      }).then(res => {
        let num = (res.result.doneExperienceNum / res.result.experienceNum).toFixed(2);
        that.setData({
          tab2: res.result,
          experience: num
        })
        wx.hideLoading();
      }, _ => {
        wx.hideLoading();
      });
    } else if (that.data.currentTab == 3) {
      wx.showLoading({ title: '加载中...' });
      Http.post('/analysis/doCart', {
        storeId: app.globalData.storeId
      }).then(res => {
        let num = (res.result.doneDoCardNum / res.result.doCardNum).toFixed(2);
        that.setData({
          tab3: res.result,
          personalCenter: num
        })
        wx.hideLoading();
      }, _ => {
        wx.hideLoading();
      });
    }
  }
})