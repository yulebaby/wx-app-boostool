
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
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      checkedPrice: e.detail.value
    });
  }
})