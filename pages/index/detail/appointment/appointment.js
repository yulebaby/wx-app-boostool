const User = require('../../../../utils/userInfo.js');
const Http = require('../../../../utils/request.js');
Page({
  data: {
    selectTeachId: null,
    selectTime: null,
    weeks: 1,
    weekItem: [],
    weekItemm: [],
    weeknum: 0,
    rq: "--",
    timess: '',
    xhours: '--',
    xminutes: '--',
    leftbtn: 0,
    listtimes: 2,
    foottext: false
  },
  onLoad: function (options) {
    var that = this;
    var shopId = options.shopId;
    let activityType = "0";
    let discountPrice = 0;
    let price = 0;
    let activityId = 0;
    let ym = 0;
    if (options.ym) {
      ym = 1;
    }
    if (options.discountPrice){
      discountPrice = options.discountPrice;
       price = options.price;
       activityId = options.activityId;
    }
  
 
    if (options.activityType){
      activityType="1";
    }
    that.setData({
      discountPrice: discountPrice,//活动价格
      price: price,//原价
      activityId: activityId,//活动id
      shopId: shopId,//活动id
      activityType: activityType,
      ym: ym
    })
    that.setData({
      shopId: shopId
    });
    /*********获取微信缓存*************/
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
          duration: 2000,
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../../index',
          })
        }, 2000);
      }
    });
    wx.getStorage({
      key: 'memberId',
      success: function (res) {
        that.setData({
          memberId:res.data+""
        })
        that.getweeks(shopId, res.data);
        if (that.data.memberId != 0) {
          that.getCardDetail(that.data.memberId);
          that.setData({
            tongMember: 1
          })
        }
      },
      fail: function () {
      }
    })
    this.aboutbtn();
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
      },
      fail: function () {
        wx.showToast({
          icon: "none",
          title: '登陆超时',
          duration: 2000,
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../../index',
          })
        }, 2000);
      }
    });
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
/*********点击时段*************/
  radioChanges(e) {
    let radiolist = e.currentTarget.dataset.value;
    let radioindex = e.currentTarget.dataset.index;
    let flag = e.currentTarget.dataset.flag;
    if (flag) {
      let selectTime = radioindex;
      let hours = radiolist.slice(0, 2);
      let minutes = radiolist.slice(2, 4);
      this.setData({
        selectTime: selectTime,
        xhours: hours,
        xminutes: minutes,
        selectTeachId: "",
        foottext: true
      });
      this.Teachers();
      this.aboutbtn();
    } else {
      wx.showToast({
        icon: "none",
        title: '该时段预约已满',
        duration: 2000
      })
    }
  },
  teachertap(e) {
    let tid = e.currentTarget.dataset.tid;
    let selectTeachId = e.currentTarget.dataset.selectteachid;
    this.setData({
      selectTeachId: selectTeachId,
      tid: tid
    })
    this.aboutbtn();

  },
  /*********获取日期*************/
  getweeks(shopId, memberId) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/reserve/getStoreHoursConfig', {
      storeId: shopId
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        let weekItem = res.result;
        that.setData({
          weekItems: res.result
        });
        for (var i = 0; i < weekItem.length; i++) {
          weekItem[i].date = weekItem[i].date.substring(5, 10);
        }
        var weekItemm = [];
        for (var i = 0; i < weekItem.length; i++) {
          weekItem[i].sid = i;
          weekItemm.push(weekItem[i]);
        }
        var weekss = [];
        for (var i = that.data.weeknum; i < that.data.weeknum + 4; i++) {
          weekss.push(weekItemm[i]);
        }
        var hours = that.data.weekItems[0].date;
        that.getlisthouseinit(hours, memberId);
        that.setData({
          weekItem: weekItem,
          weekItemm: weekItemm,
          weekss: weekss,
          rq: weekss[0].date,
          selectTeachId: '',
        });
      } else {
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  /*********获取时段*************/
  getlisthouse(e) {
    var that = this;
    var hours = e.currentTarget.dataset.listhours;
    this.setData({
      weeks: e.currentTarget.dataset.value,
      hours: hours,
      foottext: false
    })
    var rq = e.currentTarget.dataset.rq;
    var onlyId = that.data.openid;
    var paramJson;
    if (that.data.memberId == 0 ) {
      paramJson = JSON.stringify({
        storeId: that.data.shopId,
        onlyId: onlyId,
        date: hours
      })
    } else {
      paramJson = JSON.stringify({
        memberId: that.data.memberId,
        storeId: that.data.shopId,
        onlyId: onlyId,
        date: hours
      })
    }
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/reserve/listHours', {
      paramJson: paramJson
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        res.result.list.map(item => item.flag = item.flag === 'true');
        var listhours = res.result.list;
        let listtime = 0;
        for (let i = 0; i < listhours.length; i++) {
          if (listhours[i].flag == true) {
            listtime = 1;
          }
        }
        that.setData({
          listhours: listhours,
          selectTime: null,
          xhours: '--',
          xminutes: '--',
          rq: rq,
          dates: hours,
          selectTeachId: '',
          teachers: '',
          listtimes: listtime
        })

        this.aboutbtn();

      } else {
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  /*********初始化获取时段*************/
  getlisthouseinit(hours, memberId) {
    var that = this;
    var hours = hours;
    that.setData({
      hours: hours,
      dates: hours
    });
    var onlyId = that.data.openid;
    var paramJson;
    if (that.data.memberId == 0) {
      paramJson = JSON.stringify({
        storeId: that.data.shopId,
        onlyId: onlyId,
        date: hours
      })
    } else {
      paramJson = JSON.stringify({
        memberId: memberId,
        storeId: that.data.shopId,
        onlyId: onlyId,
        date: hours
      })
    }
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/reserve/listHours', {
      paramJson: paramJson,
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        res.result.list.map(item => item.flag = item.flag === 'true');
        var listhours = res.result.list;
        let listtime = 0;
        for (let i = 0; i < listhours.length; i++) {
          if (listhours[i].flag == true) {
            listtime = 1;
          }
        }
        that.setData({
          listhours: listhours,
          selectTime: null,
          listtimes: listtime
        })
      } else {
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  /*********获取老师列表*************/
  Teachers() {
    var that = this;
    let hour = Math.abs(that.data.xhours);
    wx.showLoading({
      title: '加载中...',
    })

    Http.post('/reserve/listTeachers', {
      paramJson: JSON.stringify({
        storeId: that.data.shopId,
        hour: hour,
        date: that.data.dates,
        minute: that.data.xminutes,
        babyType: "0"
      })
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        var teachers = res.result.list;
        that.setData({
          teachers: teachers
        });

      } else {
        wx.showModal({
          title: '提示',
          content: res.info,
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
  /*********点击右边按钮*************/
  tapright() {
    var that = this;
    var weeknum = this.data.weeknum;
    var weekItemm = this.data.weekItemm;
    that.setData({
      leftbtn: 1
    })
    if (weeknum < weekItemm.length - 4) {
      weeknum++;
      var weekss = [];
      for (var i = weeknum; i < weeknum + 4; i++) {
        weekss.push(weekItemm[i]);
      };
      that.setData({
        weeknum: weeknum,
        weekss: weekss,
        rightbtn: 1
      })

    } else {
      that.setData({
        rightbtn: 0
      })
    }
  },
    /*********点击左边按钮*************/
  tapleft() {
    var that = this;
    var weeknum = this.data.weeknum;
    var weekItemm = this.data.weekItemm;
    that.setData({
      rightbtn: 1
    })
    if (weeknum > 0) {
      weeknum--;
      var weekss = [];
      for (var i = weeknum; i < weeknum + 4; i++) {
        weekss.push(weekItemm[i]);
      };
      that.setData({
        weeknum: weeknum,
        weekss: weekss,
        leftbtn: 1
      })

    } else {
      that.setData({
        leftbtn: 0
      })
    }
  },
    /*********校检确定预约按钮*************/
  aboutbtn() {
    if (this.data.xhours != '--') {
      if (this.data.xminutes != '--') {
        if (this.data.selectTeachId) {
          this.setData({
            aboutbtn: 1
          })
        } else {
          this.setData({
            aboutbtn: 0,
            abouttit: '请选择老师'
          })
        }
      }

    } else {
      this.setData({
        aboutbtn: 0,
        abouttit: '请选择时间'
      })
    }
  },
  /*********预约*************/
  yabout(e) {
    var formId = e.detail.formId;
    var that = this;
    var yyurl = "";
    var showwar = "";
    var paramJson;
    if (that.data.aboutbtn == 0) {
      wx.showToast({
        icon: "none",
        title: that.data.abouttit,
        duration: 2000,
      })
    } else {
      if (that.data.memberId == 0) { //非会员预约
        yyurl = "/reserve/doReserveFei";
        paramJson = JSON.stringify({
          date: that.data.hours,
          hour: that.data.xhours,
          formId: formId,
          minute: that.data.xminutes,
          onlyId: that.data.openid,
          storeId: that.data.shopId,
          teacher: that.data.tid,
          activityId: that.data.activityId,
          activityType: that.data.activityType
        })
      } else {//会员预约
        yyurl = "/reserve/doReserve";
        paramJson = JSON.stringify({
          date: that.data.hours,
          hour: that.data.xhours,
          minute: that.data.xminutes,
          onlyId: that.data.openid,
          storeId: that.data.shopId,
          teacher: that.data.tid,
          formId: formId,
          memberId: that.data.memberId,
        })
      }
      wx.showLoading({
        title: '加载中...',
      })
      Http.post(yyurl, {
        paramJson: paramJson
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1000) {
          showwar = "预约成功"
          wx.showToast({
            icon: "none",
            title: showwar,
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../../../serve/serve',
            })
          }, 2000)
        } else {
          showwar = res.info;
          wx.showToast({
            icon: "none",
            title: showwar,
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../../../serve/serve',
            })
          }, 2000)
        }
      }, _ => {
        wx.hideLoading();
      });
    }
  },
   /*********获取会员卡信息*************/
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