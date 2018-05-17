// pages/serve/serve-details/serve-details.js
const User = require('../../../utils/userInfo.js');
const Http = require('../../../utils/request.js');
Page({

  data: {
      lists:[],
  },

  onLoad: function (options) {
    var that = this;
    var severid = options.severid;
    var status = options.status;
    that.setData({
      severid: severid,
      status:status
    });
    that.severmain();
  },

  onReady: function () {
  
  },

  onShow: function () {
  
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
  severmain (){
    var that =this;
            wx.showLoading({
              title: '加载中...',
            })
            Http.post('/reserve/recordDetail', {
             
                recordId: that.data.severid,
            }).then(res => {
              wx.hideLoading();
              
              if (res.code == 1000) {
                let lists = res.result;
                let listtime = lists.rHour + ':' + lists.rMinute;
                lists.reserveDate = lists.reserveDate.replace('00:00:00', listtime);

                that.setData({
                  lists: lists
                })

              } else {

              }
            }, _ => {
            });
  },
  makePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.num
    })
  },
  mapclick() {
    const _this = this.data;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {

        var latitude = res.latitude
        var longitude = res.longitude;
        wx.openLocation({
          latitude: Number(_this.lists.lat),
          longitude: Number(_this.lists.lon),
          name: _this.lists.shopName,
          address: _this.lists.shopAddress,
          scale: 28
        })

      }
    })
  },
  //非会员取消预约
  reserveCancelFei(reserveId) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/reserve/reserveCancelFei', {
      reserveId: reserveId,
    }).then(res => {
      wx.hideLoading();
      console.log(res);
      if (res.code == 1000) {
        wx.showToast({
          title: '操作成功',
          icon: 'none'
        })
        wx.switchTab({
          url: '../serve'
        })
      } else {
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    }, _ => {
      wx.hideLoading();
    });

  },


  //会员取消预约
  reserveCancel(reserveId, memberId) {
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/reserve/reserveCancel', {
      paramJson: JSON.stringify({
        reserveId: reserveId,
        memberId: memberId
      })
    }).then(res => {
      wx.hideLoading();
      //console.log(res);
      if (res.code == 1000) {
        wx.showToast({
          title: '操作成功',
          icon: 'none'
        })
        wx.switchTab({
          url: '../serve'
        })
      } else {

        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    }, _ => {
      wx.hideLoading();
    });

  },

  cancel(e) {
    let that = this;
    let reserveId = that.data.severid;
    if (that.data.isMember) {    //判断是不是会员,

      wx.showModal({
        title: '尊敬的会员',
        content: '您确定要取消预约吗?',
        success: function (res) {
          if (res.confirm) {//用户点击确定
            that.reserveCancel(reserveId, that.data.isMember);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    } else {


      wx.showModal({
        title: '提示',
        content: '您确定要取消预约吗?',
        success: function (res) {
          if (res.confirm) {//用户点击确定
            that.reserveCancelFei(reserveId);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },

})