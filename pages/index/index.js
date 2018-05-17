const app = getApp();
const User = require('./../../utils/userInfo.js');
const Http = require('./../../utils/request.js');
const cityAddress = require('./../../data/cityAddress.js');
var addresslist = cityAddress.postList;
Page({
  data: {
    swiperArray: [
      '../../assets/images/banner1.jpg',
      '../../assets/images/banner2.jpg',
      '../../assets/images/banner3.jpg',
    ],
    pageNo: 1,
    pageSize: 10,
    storeItems: [],
    address: ['', '定位中', ''],
    openweb:false,
  },
  onLoad: function () {

    this.getaddress();
    var timestamp = Date.parse(new Date());
    wx.setStorage({
      key: 'shoplistdata',
      data: timestamp,
    })


  },
  onShow: function () {
    var that = this;

    that.getcode();
    wx.getStorage({
      key: 'shoplistdata',
      success: function (res) {
        var timestamp = Date.parse(new Date());
        /*******************设置时间戳，十分钟更新一次列表************************ */
        if (timestamp - res.data > (1000 * 60 * 10)) {
          wx.setStorage({
            key: 'shoplistdata',
            data: timestamp,
          });
          that.getaddress();
        }
      },
    })



  },
  /*******************下拉触底事件************************ */
  onReachBottom: function () {
    this.getStoreItems();
  },
  /*******************获取当前城市************************ */
  getaddress() {
    User.getAddress(address => {
      this.setData({
        location: address.location,
        address: [address.address_component.province, address.address_component.city],
        lat: address.location.lat,
        lon: address.location.lng,
        province: address.address_component.province,
        city: address.address_component.city,
        area: null,
        pageNo: 1,
        storeItems: [],
        district: null,
      });
      this.getStoreItems();
  
    })
  },

  /*******************选择城市列表************************ */
  bindRegionChange: function (e) {
    this.setData({
      address: e.detail.value
    });
    var province = this.data.address[0];
    var city = this.data.address[1];
    var district = this.data.address[2];
    var provincecode = '';
    var citycode = '';
    var districtcode = '';
    for (var i = 0; i < addresslist.length; i++) {
      if (addresslist[i].label == province) {
        provincecode = addresslist[i].value;
        for (var r = 0; r < addresslist[i].children.length; r++) {
          if (city == addresslist[i].children[r].label) {
            citycode = addresslist[i].children[r].value;
            for (var j = 0; j < addresslist[i].children[r].children.length; j++) {
              if (district == addresslist[i].children[r].children[j].label) {
                districtcode = addresslist[i].children[r].children[j].value;
              }
            }
          }
        }
      }
    }
    this.setData({
      province: provincecode,
      city: citycode,
      district: districtcode,
      pageNo: 1,
      storeItems: []
    });
    this.getStoreItems();
  },
  /*******************向后台发送数据获取门店列表************************ */
  getStoreItems(param) {

    var paramJson;
    if (this.data.district) {
      paramJson = JSON.stringify({
        province: this.data.province,
        city: this.data.city,
        area: this.data.district,
        lon: this.data.location.lng,
        lat: this.data.location.lat,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      });
    } else {

      var province = this.data.province;
      var city = this.data.city;
      var district = this.data.district;
      var provincecode = '';
      var citycode = '';
      var districtcode = '';
      for (var i = 0; i < addresslist.length; i++) {
        if (addresslist[i].label == province) {
          provincecode = addresslist[i].value;
          for (var r = 0; r < addresslist[i].children.length; r++) {
            if (city == addresslist[i].children[r].label) {
              citycode = addresslist[i].children[r].value;
              for (var j = 0; j < addresslist[i].children[r].children.length; j++) {
                if (district == addresslist[i].children[r].children[j].label) {
                  districtcode = addresslist[i].children[r].children[j].value;
                }
              }
            }
          }
        }
      }
      paramJson = JSON.stringify({
        province: provincecode,
        city: citycode,
        lon: this.data.location.lng,
        lat: this.data.location.lat,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      });
    }
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/shop/listShop', {
      paramJson: paramJson
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000 && res.result.shopList) {
        let storeItem = res.result.shopList;
        for (let i = 0; i < storeItem.length; i++) {
          if (storeItem[i].distance > 1000) {
            storeItem[i].distance = (storeItem[i].distance / 1000).toFixed(1) + 'km';
          } else {
            storeItem[i].distance = storeItem[i].distance + 'm';
          }
        }
        if (storeItem) {
          this.setData({
            storeItems: this.data.storeItems.concat(storeItem),
            pageNo: this.data.pageNo + 1
          })

        }
      } else {
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  /*******************获取用户状态************************ */
  getcode() {
    let that = this;
    wx.login({
      success(res) {
        that.getuserstatus(res.code);
      }
    });
  },
  getuserstatus(code) {
    Http.post('/user/judgeUserStatus', {
      code: code
    }).then(res => {

      if (res.code == 1000) {
        let openid = res.result.openid;

        var openid;
        if (res.result.openid) {
          openid = res.result.openid;
        } else {
          openid = 0;
        }
        wx.setStorage({
          key: 'openid',
          data: openid,
        });

        var status;
        if (res.result.status) {
          status = res.result.status;
        } else {
          status = 0;
        }
        wx.setStorage({
          key: 'status',
          data: status
        });

        var potentialMember;
        if (res.result.potentialMember) {
          potentialMember = res.result.potentialMember;
        } else {
          potentialMember = 0;
        }
        wx.setStorage({
          key: 'potentialMember',
          data: potentialMember,
        });

        var isMember;
        if (res.result.isMember) {
          isMember = res.result.isMember;
        } else {
          isMember = 0;
        }
        wx.setStorage({
          key: 'isMember',
          data: isMember,
        });


        var tongMember;
        if (res.result.tongMember) {
          tongMember = res.result.tongMember;
        } else {
          tongMember = 0;
        }
        wx.setStorage({
          key: 'tongMember',
          data: tongMember,
        });

        var memberId;
        if (res.result.memberId) {
          memberId = res.result.memberId;
        } else {
          memberId = 0;
        }
        wx.setStorage({
          key: 'memberId',
          data: memberId,
        });

        if (res.result.memberId) {
          wx.setStorage({
            key: 'baseInfo',
            data: 1,
          });
        } else {
          var baseInfo;
          if (res.result.baseInfo) {
            baseInfo = res.result.baseInfo;
          } else {
            baseInfo = 0;
          }
          wx.setStorage({
            key: 'baseInfo',
            data: baseInfo,
          });
        }
        var storeId;
        if (res.result.storeId) {
          storeId = res.result.storeId;
        } else {
          storeId = 0;
        }
        wx.setStorage({
          key: 'storeId',
          data: storeId,
        });

      }
    }, _ => {
      wx.hideLoading();
    });
  },
  dz(e){
    let data = e.currentTarget.dataset.dz;
    this.setData({
      openweb: false,
    });

    if (data == "北京市") {
      this.setData({
        openweb: true,
        weburl: 'http://wx.beibeiyue.com/activeThreebj/index.html?activityId=1'
      })
    };
    if (data == "太原市") {
      this.setData({
        openweb: true,
        weburl: 'http://wx.beibeiyue.com/activeThreety/index.html?activityId=4'
      })
    };
    if (data == "天津市") {
      this.setData({
        openweb: true,
        weburl: 'http://wx.beibeiyue.com/activeThreetj/index.html?activityId=5'
      })
    };
    if (data == "郑州市") {
      this.setData({
        openweb: true,
        weburl: 'http://wx.beibeiyue.com/activeThreezz/index.html?activityId=3'
      })
    };
    if (data == "沈阳市") {
      this.setData({
        openweb: true,
        weburl: 'http://wx.beibeiyue.com/activeThreesy/index.html?activityId=2'
      })
    };


  }
})