const User = require('../../../utils/userInfo.js');
const Http = require('../../../utils/request.js');
const app = getApp();
Page({
  data: {
    lats: "39.94973",
    lngs: "116.29598",
    shopName: "加载中...",
    address: "加载中...",
    books_yy:true

  },
  onLoad: function (options) {
    var that = this;
    var ids = options.shopId; 
   
 
    that.getactivity(ids);
   /******获取缓存*****/
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        });


        wx.getStorage({
          key: 'memberId',
          success: function (res) {
            that.setData({
              memberId: res.data
            });
          }
        })
        wx.getStorage({
          key: 'storeId',
          success: function (res) {
            that.setData({
              storeId: res.data
            });
          }
        })
        wx.getStorage({
          key: 'tongMember',
          success: function (res) {
            that.setData({
              tongMember: res.data
            });
          }
        });



      },
      fail: function () {
        that.getcode();
      }
    });



   

    User.getAddress(address => {
      this.setData({
        lat: address.location.lat,
        lon: address.location.lng,
      });

      this.getStoreItems(ids);
    });

  },
  onUnload: function () {
   
  },
/***************判断是否有门店活动************************/
  getactivity(storeId){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/shop/getShopPrice', {
     
        storeId: storeId,
        activityId:5
     
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
          that.setData({
            discountPrice: res.result.discountPrice,//活动价格
            inActivity: res.result.inActivity, //门店是否有活动
            price: res.result.price, //活动原价
            activityId: res.result.activityId, //活动id
          });
          wx.getStorage({  //判断是不是会员
            key: 'isMember',
            success: function (res) {
              if(res.data!=1){
                wx.getStorage({  //判断绑没绑定手机
                  key: 'status',
                  success: function (res) {
                      if(res.data==1){
                        that.setData({
                          books_yy: false
                        })
                      }
                  }
                })
              }
            }
            })

      }
    }, _ => {
      wx.hideLoading();
    });
  },


 /************获取门店详细内容*************/
  getStoreItems(param) {
    
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/shop/getShopDetail', {
      paramJson: JSON.stringify({
        id: param,
        lon: this.data.lon,
        lat: this.data.lat,
      })
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        let storeItem = res.result;
        if (storeItem) {
          let distance = storeItem.distance / 1000;
          var facilitie = "";
          var facilitie1 = "";
          var facilitie2 = "";
          var facilitie3 = "";
          var facilitie4 = "";
          var trafficInformation = "";
          var parkingInformation = "";
          if (storeItem.facilitie) {
            facilitie = storeItem.facilitie;
            var facilitie = facilitie.split(",");

            for (let i = 0; i < facilitie.length; i++) {
              if (facilitie[i] == 1) {
                facilitie1 = 1;
              }
            }
            for (let i = 0; i < facilitie.length; i++) {
              if (facilitie[i] == 2) {
                facilitie2 = 1;
              }
            }
            for (let i = 0; i < facilitie.length; i++) {
              if (facilitie[i] == 3) {
                facilitie3 = 1;
              }
            }
            for (let i = 0; i < facilitie.length; i++) {
              if (facilitie[i] == 4) {
                facilitie4 = 1;
              }
            }
          };

          if (storeItem.trafficInformation) {
            trafficInformation = storeItem.trafficInformation;
          }
          if (storeItem.parkingInformation) {
            parkingInformation = storeItem.parkingInformation;
          }
          var shopImg = "http://image.beibeiyue.com/micro/shop/xiaochengxu.jpg";
          if (!storeItem.shopInfoImag) {
            if (storeItem.coverImag) {
              shopImg = storeItem.coverImag;
            } else {
              if (storeItem.shopImg) {
                shopImg = storeItem.shopImg;
              }
            }
          } else {
            var swiperArray = [];
            var swiperArrays = [];
            swiperArray = storeItem.shopInfoImag.split(",");
            for (let i = 0; i < swiperArray.length; i++) {
              if (swiperArray[i] != '') {
                swiperArrays.push(swiperArray[i]);
              }
            }
            this.setData({
              swiperArray: swiperArrays
            })
          }
          let warmPrompt = storeItem.warmPrompt ? storeItem.warmPrompt : '';
          let healthSafe = storeItem.healthSafe ? storeItem.healthSafe : '';
          let businessTime = storeItem.businessTime ? storeItem.businessTime : '';
          let countryCardStatus = storeItem.countryCardStatus ? storeItem.countryCardStatus : '';
          if (storeItem.distance > 1000) {
            storeItem.distance = (storeItem.distance / 1000).toFixed(1) + 'km';
          } else {
            storeItem.distance = storeItem.distance + 'm';
          }
          this.setData({
            shopImg: shopImg,
            shopName: storeItem.shopName,
            address: storeItem.address,
            coverImag: "",
            businessTime: businessTime,
            trafficInformation: trafficInformation,
            parkingInformation: parkingInformation,
            facilitie: facilitie,
            facilitie1: facilitie1,
            facilitie2: facilitie2,
            facilitie3: facilitie3,
            facilitie4: facilitie4,
            lats: storeItem.lat,
            lngs: storeItem.lng,
            countryCardStatus: countryCardStatus,
            shopId: storeItem.id,
            shopTel: storeItem.shopTel,
            warmPrompt: warmPrompt,
            healthSafe: healthSafe,
            distance: storeItem.distance
          })
        }
      } else {
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  /************导航功能*************/
  mapclick () {
    const _this = this.data;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude;
        wx.openLocation({
          latitude: Number(_this.lats),
          longitude: Number(_this.lngs),
          name: _this.shopName,
          address: _this.address,
          scale: 28
        })
      }
    })
  },
   /************门店内点击预约检测*************/
  booking (){
    var that = this;
    if (that.data.tongMember==0){ 
    if (that.data.memberId != 0) {
      if (that.data.shopId != that.data.storeId){ 
        wx.showModal({
          title: '提示',
          content: '您的卡不支持跨店预约',
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index',
              })
            } else if (res.cancel) {
            }
          }
        })
      }else{
        that.bookings();
      }
    }else{          
      that.bookings();
    }
    }else{
      if (that.data.countryCardStatus){
        that.bookings();
      }else{
        wx.showModal({
          title: '提示',
          content: '当前门店不是通卡店',
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index',
              })
            } else if (res.cancel) {
            }
          }
        })
      }


    }

  },


   /************门店内点击预约*************/
  bookings :function(){
    let shopId = this.data.shopId;
    let that = this;
    wx.setStorage({
      key: 'countryCardStatus',
      data: that.data.countryCardStatus,
    });
    wx.getStorage({
      key: 'countryCardStatus',
      success: function (res) {
        that.setData({
          countryCardStatus: res.data,
        });    
        
      }
    })
    
    wx.getStorage({
      key: 'isMember',
      success: function (res) {
        if(res.data==0){    //监测用户是否是会员 //用户不是会员
          wx.getStorage({  //判断用户是否绑定手机
            key: 'status',
            success: function (res) {
                if(res.data==0){ //用户没有绑定手机
                
                  wx.navigateTo({
                    url: '../../user/bind-phone/bind-phone?shopId=' + shopId + '&page=1', //跳转到绑定手机页面
                  })     
                }else{  //用户绑定手机
                  wx.getStorage({             
                    key: 'baseInfo',
                    success: function (res) {
                      if (res.data == 0||!res.data) { //是否填写过信息
                          wx.navigateTo({
                            url: '../../user/bind-info/bind-info?shopId=' + shopId + '&page=1',//跳转到绑定信息页面
                          })
                        }else{
                            //非会员预约

                        wx.showLoading({
                          title: '加载中...',
                        });

                        Http.post('/user/getUserInfo', {
                          onlyId: that.data.openid,
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
                                shopId:that.data.shopId,
                                spreadId:'18',
                              }).then(res => {
                                wx.hideLoading();
                              
                                if(res.code==1000){
                                  wx.showModal({
                                    title: '温馨提示',
                                    content: '请保持手机通畅，稍后门店会联系您',
                                  })
                                }else if(res.code==1022){
                                  wx.showModal({
                                    title: '温馨提示',
                                    content: '每天只能预约一次哦~',
                                  })
                                }else{
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
                        }, _ => {
                        });
                        }
                    },
                    fail: function () {
                      that.getcode();
                      
                    }
                  })

                
               }
           
            }
          })
        } else {  
              wx.navigateTo({
                url: './appointment/appointment?shopId=' + shopId + '&page=1',
              })
        } 
      }
    })
  },

  /************点击门店活动*************/
  activity_yry : function () {
    let shopId = this.data.shopId;
    let that = this;
    wx.navigateTo({
      url: './activity/activity?shopId=' + shopId,//跳转活动详情页面
    })
  },


/*********保存用户电话接口*************/
  cellme(){
    wx.makePhoneCall({
      phoneNumber : this.data.shopTel
    });
    //保存用户点击电话
    var that = this;
    Http.post('/user/saveUserClick', {
      onlyId: that.data.openid,
    }).then(res => {
      if (res.code == 1000) {
      } else {
      }
    }, _ => {
    });



  },
  /*********拨打电话功能*************/
  makePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.num
    })
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


        
            this.setData({
              memberId: memberId,
              storeId: storeId,
              tongMember: tongMember,
              openid:openid,
            });


      }
    }, _ => {
      wx.hideLoading();
    });
  },
  backindex(){
    wx.switchTab({
      url: '../index',
    })
  }
})