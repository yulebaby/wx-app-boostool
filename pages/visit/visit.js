const app = getApp();
const Http = require('./../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
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
    if (that.data.currentTab == 0) {
      wx.showLoading({ title: '加载中...' });
      Http.post('/returnVisit/clueVisit', {
        storeId: app.globalData.storeId
      }).then(res => {
        let clue = (res.result.doneClueNum / res.result.cluesNum).toFixed(2);
        console.log(res.result.doneTodayTaskList.length);
      
        for (let i = 0; i < res.result.doneTodayTaskList.length; i++){
          let str = res.result.doneTodayTaskList[i].mobilePhone;
          str = str.split('');
          str.splice(3, 4, '****');
          str = str.join('');
          res.result.doneTodayTaskList[i].mobilePhone = str;
        }
        for (let i = 0; i < res.result.todayTaskList.length; i++) {
          let str = res.result.todayTaskList[i].mobilePhone;
          str = str.split('');
          str.splice(3, 4, '****');
          str = str.join('');
          res.result.todayTaskList[i].mobilePhone = str;
        }
        that.setData({
          tab1: res.result,
        })
        wx.hideLoading();
      }, _ => {
        wx.hideLoading();
      });
    } else if (that.data.currentTab == 1) {
      wx.showLoading({ title: '加载中...' });
      Http.post('/returnVisit/experienceVisit', {
        storeId: app.globalData.storeId
      }).then(res => {
        for (let i = 0; i < res.result.doneTodayTaskList.length; i++) {
          let str = res.result.doneTodayTaskList[i].mobilePhone;
          str = str.split('');
          str.splice(3, 4, '****');
          str = str.join('');
          res.result.doneTodayTaskList[i].mobilePhone = str;
        }
        for (let i = 0; i < res.result.todayTaskList.length; i++) {
          let str = res.result.todayTaskList[i].mobilePhone;
          str = str.split('');
          str.splice(3, 4, '****');
          str = str.join('');
          res.result.todayTaskList[i].mobilePhone = str;
        }
        that.setData({
          tab2: res.result,
        })
        wx.hideLoading();
      }, _ => {
        wx.hideLoading();
      });
    } else if (that.data.currentTab == 2) {
      wx.showLoading({ title: '加载中...' });
      Http.post('/returnVisit/memberVisit', {
        storeId: app.globalData.storeId
      }).then(res => {
        that.setData({
          tab3: res.result,
        })
        wx.hideLoading();
      }, _ => {
        wx.hideLoading();
      });
    }
  },
  switchChange(e) {
    this.setData({ currentTab: e.detail.current });
    this.getData();
  }
})