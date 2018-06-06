const app = getApp();
const Http = require('../../utils/request.js');

const getUserInfo = require('./../../utils/getUserInfo.js');

Page({
  data: {
    currentTab: 0,
    arrays: []
  },
  onLoad: function (options) {
    getUserInfo().then(userInfo => {
      console.log(userInfo);
      this.setData({ userInfo });
      this.switchChange(this.currentTab);
    })
  },
  /* --------------- 切换表单 --------------- */
  switchTab(e) {
    let index = e.target.dataset.current;
    if (index !== this.data.currentTab) {
      this.setData({
        currentTab: e.target.dataset.current
      });
      this.switchChange(index);
    }
  },
  switchChange(index) {
    wx.showLoading({ title: '加载中...' });
    let requestPath = index == 0 ? '/reserve/reserveListFei' : '/reserve/reserveListFei';
    let params = {
      onlyId: this.data.userInfo.openid,
      reserveStatus: index == 0 ? 0 : 2,
      pageNo: 1,
      pageSize: 99
    };
    Http.post(requestPath, { paramJson: JSON.stringify(params) }).then( res => {
      wx.hideLoading();
      this.setData({ serveItems: res.code == 1000 ? res.result.list : [] });
    })
  },
  /**********待服务**********/
  postlistallfei1() {
    var that = this;

    if (!that.data.memberId) {
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('/reserve/reserveListFei', {
        paramJson: JSON.stringify()
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1000) {
          let arrays = res.result.list;

          for (var i = 0; i < arrays.length; i++) {
            let arrayss = arrays[i].rHour + ':' + arrays[i].rMinute;
            arrays[i].reserveDate = arrays[i].reserveDate.replace('00:00:00', arrayss);
          }
          that.setData({
            arrays1: arrays
          })


        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('/reserve/reserveListForService', {
        paramJson: JSON.stringify({
          memberId: that.data.memberId,

        })
      }).then(res => {
        wx.hideLoading();

        if (res.code == 1000) {
          let arrays = res.result.list;

          for (var i = 0; i < arrays.length; i++) {
            let arrayss = arrays[i].rHour + ':' + arrays[i].rMinute;
            arrays[i].reserveDate = arrays[i].reserveDate.replace('00:00:00', arrayss);
          }
          that.setData({
            arrays1: arrays
          })

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    }
  },
  /**********已完成**********/
  postlistallfei2() {
    var that = this;
    if (!that.data.memberId) {
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('/reserve/reserveListFei', {
        paramJson: JSON.stringify({
          onlyId: that.data.openid,
          reserveStatus: 2,
          pageNo: 1,
          pageSize: 99
        })
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1000) {
          let arrays = res.result.list;


          for (var i = 0; i < arrays.length; i++) {
            let arrayss = arrays[i].rHour + ':' + arrays[i].rMinute;
            arrays[i].reserveDate = arrays[i].reserveDate.replace('00:00:00', arrayss);
          }
          that.setData({
            arrays2: arrays
          })

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('/reserve/reserveListComplete', {
        paramJson: JSON.stringify({
          memberId: that.data.memberId,

        })
      }).then(res => {
        wx.hideLoading();

        if (res.code == 1000) {

          let arrays = res.result.list;

          for (let i = 0; i < arrays.length; i++) {
            arrays[i].reserveDate = arrays[i].time;
            if (arrays[i].reserveStatus != 0 && arrays[i].reserveStatus != 1) {
              arrays[i].reserveStatus = 2;
            }
          }
          that.setData({
            arrays2: arrays
          })

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    }
  },
  /**********非会员取消预约**********/
  reserveCancelFei(reserveId) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/reserve/reserveCancelFei', {
      reserveId: reserveId,
      onlyId: this.data.openid,
      formId: this.data.formId
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        setTimeout(function () {
          if (that.data.currentTab == 0) {
            that.postlistallfei();
          } else if (that.data.currentTab == 1) {
            that.postlistallfei1();
          } else if (that.data.currentTab == 2) {
            that.postlistallfei2();
          }
        }, 1500);
        var info = res.info;
        wx.showToast({
          title: info,
          icon: 'none',
          duration: 2000

        })
      } else {
        var info = res.info;
        setTimeout(function () {
          if (that.data.currentTab == 0) {
            that.postlistallfei();
          } else if (that.data.currentTab == 1) {
            that.postlistallfei1();
          } else if (that.data.currentTab == 2) {
            that.postlistallfei2();
          }
        }, 1500);
        wx.showModal({
          title: '提示',
          content: info,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
      }
    }, _ => {
      wx.hideLoading();
    });

  },
  /**********会员取消预约**********/
  reserveCancel(reserveId, memberId) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/reserve/reserveCancel', {
      reserveId: reserveId,
      memberId: memberId,
      onlyId: this.data.openid,
      formId:this.data.formId
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        setTimeout(function () {
          if (that.data.currentTab == 0) {
            that.postlistallfei();
          } else if (that.data.currentTab == 1) {
            that.postlistallfei1();
          } else if (that.data.currentTab == 2) {
            that.postlistallfei2();
          }
        }, 1500);
        var info = res.info;
        wx.showToast({
          title: info,
          icon: 'none',
          duration: 2000
        })
      } else {
        var info = res.info;
        setTimeout(function () {
          if (that.data.currentTab == 0) {
            that.postlistallfei();
          } else if (that.data.currentTab == 1) {
            that.postlistallfei1();
          } else if (that.data.currentTab == 2) {
            that.postlistallfei2();
          }
        }, 1500);
        wx.showModal({
          title: '提示',
          content: info,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
      }
    }, _ => {
      wx.hideLoading();
    });

  },
  /*--------点击取消按钮-----------*/
  cancel(e) {
    let that = this;
    let reserveId = e.currentTarget.dataset.id;
    let formId = e.detail.formId;


    that.setData({
      formId:formId
    })
    if (that.data.memberId) {
      wx.showModal({
        title: '尊敬的会员',
        content: '您确定要取消预约吗?',
        success: function (res) {
          if (res.confirm) {
            that.reserveCancel(reserveId, that.data.memberId);
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您确定要取消预约吗?',
        success: function (res) {
          if (res.confirm) {
            that.reserveCancelFei(reserveId);
          }
        }
      })

    }
  }
})