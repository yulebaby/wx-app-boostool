const getAddress = require('../../../utils/getAddress.js');
const getUserInfo = require('../../../utils/getUserInfo.js');
const Http = require('../../../utils/request.js');
const app = getApp();
Page({
  data: {
    
  },
  onLoad: function (options) {
    this.setData({ shopId: options.shopId });
  
    getAddress(address => {
      this.setData({
        lat: address.location.lat,
        lon: address.location.lng,
      });
      this.getStoreItems(options.shopId, address.location.lat, address.location.lng);
    });
  },


  /* --------------- 获取门店详细信息 --------------- */
  getStoreItems(shopId, lat, lon) {
    wx.showLoading({ title: '加载中...' });
    Http.post('/shop/getShopDetail', {
      paramJson: JSON.stringify({
        id: shopId,
        lon: lon,
        lat: lat,
      })
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        let shopInfo = res.result;

        /* --------------- 处理距离门店距离 --------------- */
        shopInfo.distance = shopInfo.distance > 1000 ? 
          `${(shopInfo.distance / 1000).toFixed(1)}km` : 
          `${shopInfo.distance}m`;

        /* --------------- 判断门店有哪些设施 --------------- */
        let facilitie = shopInfo.facilitie || '';
        shopInfo.hasFacilitie = false;
        shopInfo.facilitie = [];
        for (let i = 0; i < 4; i++) {
          shopInfo.facilitie[i] = facilitie.indexOf(i + 1) > -1;
          if (shopInfo.facilitie[i]) { shopInfo.hasFacilitie = true; }
        }
        /* --------------- 判断门店是否有轮播图 --------------- */
        shopInfo.shopInfoImag = shopInfo.shopInfoImag ? shopInfo.shopInfoImag.split(',') : [];
        this.setData({ shopInfo });
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  /* ------------------ 导航功能 ------------------ */
  mapclick () {
    const _this = this.data.shopInfo;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude;
        wx.openLocation({
          latitude: Number(_this.lat),
          longitude: Number(_this.lng),
          name: _this.shopName,
          address: _this.address,
          scale: 28
        })
      }
    })
  },
  /* --------------- 门店内点击预约检测 --------------- */
  booking() {
    getUserInfo().then(userInfo => {
      console.log(userInfo)

      if (userInfo.tongMember == 0) {
        if (userInfo.memberId != 0) {
          if (this.data.shopId != userInfo.storeId) {
            wx.showModal({
              title: '提示',
              content: '您的卡不支持跨店预约'
            })
          } else {
            this.bookings(userInfo);
          }
        } else {
          this.bookings(userInfo);
        }
      } else {
        if (this.data.shopInfo.countryCardStatus == 1) {
          this.bookings(userInfo);
        } else {
          wx.showModal({
            title: '提示',
            content: '当前门店不是通卡店'
          })
        }
      }
    })

  },


  /************门店内点击预约*************/
  bookings(userInfo) {
    let _this = this;
    let shopId = this.data.shopId;

    if (userInfo.isMember == 0) {    //监测用户是否是会员 //用户不是会员
      if (userInfo.status == 0) { //用户没有绑定手机
        wx.navigateTo({
          url: '../../user/bind-phone/bind-phone?shopId=' + shopId + '&page=1', //跳转到绑定手机页面
        })
      } else if (userInfo.baseInfo == 0 || !userInfo.baseInfo) { //是否填写过信息
        wx.navigateTo({
          url: '../../user/bind-info/bind-info?shopId=' + shopId + '&page=1',//跳转到绑定信息页面
        })
      } else {
        //非会员预约
        wx.showLoading({
          title: '加载中...',
        });

        Http.post('/user/getUserInfo', {
          onlyId: userInfo.openid,
        }).then(res => {
          let userphone = res.result.userPhone;

          Http.post('/user/getBabyInfoByPhone', {
            userPhone: userphone,
          }).then(res => {

            let birthday = res.result.birthday;
            //客多多推送 
            Http.post('https://sale.beibeiyue.com/kb/customerDetail/weChatWithNoVerifyNum', {
              phone: userphone,
              birthday: birthday,
              shopId: _this.data.shopId,
              spreadId: '18',
            }).then(res => {
              wx.hideLoading();

              if (res.code == 1000) {
                wx.showModal({
                  title: '温馨提示',
                  content: '请保持手机通畅，稍后门店会联系您',
                })
              } else if (res.code == 1022) {
                wx.showModal({
                  title: '温馨提示',
                  content: '每天只能预约一次哦~',
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '系统错误',
                })
              }
            }, _ => {
              wx.hideLoading();
            });
          }, _ => {
            wx.hideLoading();
          });
        });
      }
    } else {
      wx.navigateTo({
        url: './appointment/appointment?shopId=' + shopId + '&page=1',
      })
    } 
  },


  /* ------------- 拨打电话功能 ------------- */
  makePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.num
    })
  }
})