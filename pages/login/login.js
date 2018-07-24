const app = getApp();
const Http = require('./../../utils/request.js');
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    passWord:''
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
  
  },
login(){
  let that = this;
  wx.showLoading({ title: '加载中...' });
  Http.post('/user/login', { 
    userName: that.data.userName,
    password:that.data.passWord
   }).then(res => {
      if(res.code==1000){
        app.globalData.userName = res.result.userName;
        app.globalData.storeName = res.result.storeName; 
        app.globalData.storeId = res.result.storeId;
        wx.switchTab({
          url: '../index/index'
        })    
      }else{
        wx.showModal({
          title: '登陆失败',
          content: res.info,
          showCancel:false
        })
      }

    wx.hideLoading();
  }, _ => {
    wx.hideLoading();
  });
},
  
  userName(e){
    this.setData({
      userName:e.detail.value
    })
  },
  passWord(e){
    this.setData({
      passWord: e.detail.value
    })
  }
})