const app = getApp();
const User = require('../../utils/userInfo.js');
const Http = require('../../utils/request.js');
const userInfo = require('./../../utils/userInfo.js');
Page({
  data: {
    userHeadImage: null,
    userphone: '加载中...'
  },
  onLoad: function (options) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
     
    });
  },
  onReady: function () {
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'tongMember',
      success: function (res) {
        if (res.data == 0) {
          that.setData({
            tongMember: ""
          })
        } else {
          that.setData({
            tongMember: 1
          })
        }
      },
      fail: function () {
        wx.showToast({
          icon: "none",
          title: '登陆超时',
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../../index',
          })
        }, 1000);
      }
    });
    wx.getStorage({
      key: 'memberId',
      success: function (res) {
        that.setData({
          memberId: res.data
        })

        if (that.data.memberId != 0) {
          that.getCardDetail();
        }
      },
      fail: function () {
      }
    })

    wx.getStorage({
      key: 'status',
      success: function (res) {
        if (res.data == 0) {
          setTimeout(function () {
            wx.navigateTo({
              url: '../user/bind-phone/bind-phone?page=2',
            })
          }, 1000);
          return false;
        } else {
          wx.getStorage({
            key: 'baseInfo',
            success: function (res) {
              if (res.data == 0 || !res.data) {
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../user/bind-info/bind-info?page=2',
                  })
                }, 1000)
                return false;
              }

            },

          });
        }
      },

    });
    wx.getStorage({
      key: 'userphone',
      success: function (res) {
        that.setData({
          userphone: res.data,
        })
      },
      fail: function () {
        //that.userphone();
      }
    });
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        });
        that.userphone();
      },
      fail: function () {
        wx.showToast({
          icon: "none",
          title: '登陆超时',
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          })
        }, 1000);
      }
    });
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  makePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.num
    })
  },
  myserve() {
    app.globalData.opentest = 1;
    wx.switchTab({
      url: '../serve/serve',
    })
  },
  userphone() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/user/getUserInfo', {
      onlyId: that.data.openid,
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
 
        var userphone = res.result.userPhone;
        var phonenum ="";
        
         phonenum = userphone.substring(3, 7);
         userphone = userphone.replace(phonenum, '****');
      
      
        
        that.setData({
          userphone: userphone
        });
        wx.setStorage({
          key: 'userphone',
          data: userphone,
        });
      } else {
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  getCardDetail() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/reserve/getCardDetail', {
      memberId: that.data.memberId
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        that.setData({
          tongMember: 1,
          totalTimes: res.result.totalTimes,
          remainTimes: res.result.remainTimes,
          remainTong: res.result.remainTong
        })
      } else {
      }
    }, _ => {
      wx.hideLoading();
    });
  }

  




})