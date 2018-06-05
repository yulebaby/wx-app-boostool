const App = getApp();
const Http = require('./../../../utils/request.js');
Page({
  data: {
    userHeadImg: null,
    relationshipIndex: null,
    relationshipArray: ['爸爸', '妈妈', '爷爷', '奶奶', '外公', '外婆', '其他'],
    birthday: '',
    babyname: ''
  },
  onLoad: function (options) {
    let that = this;
    App.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    });
    that.branchpost();
    //设置门店id和来源
    if (options.shopId) {
      this.setData({
        shopId: options.shopId,
        page: options.page,
      })
    } else {
      this.setData({
        page: options.page
      })
    }
    // User.getUserInfo(res => {
    //   if (res.rawData) {
    //     let info = JSON.parse(res.rawData);
    //     if (info.avatarUrl) {
    //       this.setData({
    //         userHeadImg: info.avatarUrl
    //       })
    //     }
    //   }
    // });
    wx.getStorage({
      key: 'baseInfo',
      success: function (res) {
        that.setData({
          baseInfo: res.data
        })
      },
      fail: function () {
        wx.showToast({
          icon: "none",
          title: '登陆超时',
          duration: 2000
        });
        setTimeout(function () {
          wx.switchTab({
            url: '../../index/index',
          })
        }, 1000);
      }
    });

    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
      }
    });

    wx.getStorage({
      key: 'isMember',
      success: function (res) {
        that.setData({
          isMember: res.data
        })
      },
      fail: function () {
        wx.showToast({
          icon: "none",
          title: '登陆超时',
          duration: 2000
        });
        setTimeout(function () {
          wx.switchTab({
            url: '../../index/index',
          })
        }, 1000);
      }
    });


  },
  relationshipChange(e) {
    this.setData({
      relationshipIndex: Number(e.detail.value)
    })
  },
  birthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
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
  /**********验证宝宝姓名生日关系----提交*************/
  setuser() {
    var that = this;
    if (this.data.babyname == "") {
      wx.showToast({
        icon: "none",
        title: '请输入宝宝的名字',
        duration: 2000
      })
      return false;
    }

    if (this.data.birthday == "") {
      wx.showToast({
        icon: "none",
        title: '请选择宝宝的生日',
        duration: 2000
      })
      return false;
    }
 
    let babybirthday = this.data.birthday.replace(/[^0-9]/ig, "");
    let now = new Date();
    let year = now.getFullYear(); //得到年份
    let month = now.getMonth();//得到月份
    let date = now.getDate();//得到日期
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    let times = year+month+date;
    if (times <= babybirthday) {
      wx.showToast({
        icon: "none",
        title: '请选择正确的宝宝生日',
        duration: 2000
      })
      return false;
    }


    if (this.data.birthday == "") {
      wx.showToast({
        icon: "none",
        title: '请选择宝宝的生日',
        duration: 2000
      })
      return false;
    }

    if (!this.data.relationshipIndex && this.data.relationshipIndex != 0) {
      wx.showToast({
        icon: "none",
        title: '请选择您与宝宝的关系',
        duration: 2000
      })
      return false;
    }
    wx.showLoading({
      title: '加载中...',
    })
    if (that.data.baseInfo!=0){
      wx.showToast({
        icon: "none",
        title: '您不能重复绑定信息',
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../../index/index',
        })
      }, 2000);
      
      return false;
    }
    


    var relationship = this.data.relationshipArray[this.data.relationshipIndex];
    var birthday = this.data.birthday;
    that.branchpost(); //往客多多推送信息
    //erp接口 
    Http.post('/user/saveUserBaseInfo', {
      paramJson: JSON.stringify({
        onlyId: this.data.openid,
        nickName: this.data.babyname,
        relationship: relationship,
        birthday: birthday
      })
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        wx.setStorage({
          key: 'baseInfo',
          data: 1,
        });

      that.setData({
        baseInfo:1
      })
        if (that.data.shopId && that.data.page == "1") {
         
            wx.navigateTo({
            url: '../../index/detail/detail?shopId=' + that.data.shopId ,
          })
      
        } else if (that.data.page == "2") {
          wx.switchTab({
            url: '../../serve/serve',
          })
        } else if (that.data.page == "3") {
          wx.switchTab({
            url: '../user',
          })
        } else if (that.data.page == "4"){
          wx.navigateTo({
            url: '../../index/detail/activity/activity?shopId=' + this.data.shopId+'&order=1',
          })
        }
      } else {
      }
    }, _ => {
      wx.hideLoading();
    });
  
  },
  babyname(e) {
    this.setData({
      babyname: e.detail.value
    })
  },
  //非会员录入信息
  branchpost() {
    let that = this;
    Http.post('/user/getUserInfo', {
      onlyId: that.data.openid,
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        var userphone = res.result.userPhone + '';
        Http.post('/user/judgeUserPhone', {
          userPhone: userphone,
        }).then(res => {
          let birthday = that.data.birthday + '';
          that.setData({
            succ: res.result.potentialMember
          })
          Http.post('https://sale.beibeiyue.com/kb/manager/register', {
              typeStyle: 1,
              phone: 15911038093,
              spreadId: '10000002',
              birthday: birthday,
              babyName: that.data.babyname,
            }).then(res => {

            }, _ => {

            });
         
        }, _ => {
        });
      } else {
      }
    }, _ => {
      wx.hideLoading();
    });
  },
})