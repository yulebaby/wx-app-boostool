
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedPrice: 2.2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  checkboxChange (e) {
    this.setData({
      checkedPrice: e.detail.value
    });
  }
})