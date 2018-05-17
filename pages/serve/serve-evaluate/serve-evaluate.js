// pages/serve/serve-evaluate/serve-evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreNum: 0,
    // scoreCheck: []
    checkItems: [
    { name: '专人配送', value: '0', checked: true },
    { name: '精品品牌', value: '1', checked: false },
    { name: '超值优惠', value: '2', checked: false },
    { name: '门店自提', value: '3', checked: false },
    { name: '最快三小时', value: '4', checked: false },  
   ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  radioChange: function (e) {
    this.setData({
      scoreNum: e.detail.value
    })
  },
  checkboxChange (e) {
    var checkItems = this.data.checkItems;
    var checkArr = e.detail.value;
    for (var i = 0; i < checkItems.length; i++) {
      if (checkArr.indexOf(i + "") != -1) {
        checkItems[i].checked = true;
      } else {
        checkItems[i].checked = false;
      }
    }
    this.setData({
      checkItems: checkItems
    }) 
  }
})