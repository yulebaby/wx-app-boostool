const getAddress = require('../../../utils/getAddress.js');
const getUserInfo = require('../../../utils/getUserInfo.js');
const Http = require('../../../utils/request.js');
const app = getApp();
Page({
  data: {},
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
  /* --------------- 点击预约 --------------- */
  makeAppointment() {
    getUserInfo().then(userInfo => {
      if (userInfo.isMember == 0) {
        /* --------- 非会员 获取到用户信息推送到客多多 --------- */
        wx.showLoading({ title: '加载中...' });
        Http.post('/user/getUserInfo', { onlyId: userInfo.openid }).then(res => {
          let userphone = res.result.userPhone;
          Http.post('/user/getBabyInfoByPhone', {
            userPhone: userphone,
          }).then(res => {
            let birthday = res.result.birthday;
            Http.post('https://sale.beibeiyue.com/kb/customerDetail/weChatWithNoVerifyNum', {
              phone: userphone,
              birthday: birthday,
              shopId: this.data.shopId,
              spreadId: '18',
            }).then(res => {
              wx.hideLoading();
              wx.showModal({
                title: '温馨提示',
                showCancel: false,
                content: res.code == 1000 ? '请保持手机通畅，稍后门店会联系您' : res.code == 1022 ? '每天只能预约一次哦~' : '系统错误，请刷新重试',
              })
            });
          });
        });
      } else if (userInfo.storeId == this.data.shopId) {
        /* ---------- 是会员 归属门店与当前门店一致 ---------- */
        wx.navigateTo({
          url: './appointment/appointment?shopId=' + this.data.shopId,
        });
      } else if (userInfo.tongMember == 0) {
        /* ---------- 不是通卡会员 ---------- */
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '您的卡不支持跨店预约'
        })
      } else if (this.shopInfo.countryCardStatus == 1) {
        /* ----------- 是通卡店 ----------- */
        wx.navigateTo({
          url: './appointment/appointment?shopId=' + this.data.shopId,
        });
      } else {
        /* ---------- 不是通卡店 ---------- */
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '当前门店不是通卡店'
        })
      }
    })
  },

  /* ------------- 拨打电话功能 ------------- */
  makePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.num
    })
  }
})