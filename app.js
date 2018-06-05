App({

  onLaunch() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
            }
          })
        }
      }
    })
  },
  
  /* ------------- ------------- 全局数据存储 -------------------------- */
  globalData: {
    userOpenid: null,
    userLocation: null,
    userAddress: null,
    opentest: null
  }

})