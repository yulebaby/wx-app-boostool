
const format = require('./../..//utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate : null,                     // 记录当前年月日
    birthday: null,                     // 宝宝生日
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nowDate: format.formatTime(new Date())
    });
  },
  /* ---------------- 宝宝生日改变事件 ---------------- */
  birthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  formSubmit(e) {
    console.log(e)
  }
})