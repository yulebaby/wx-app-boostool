const User = require('../../../../utils/userInfo.js');
const Http = require('../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showx:false,
    textshow1:'',
    textshow2:'',
    inActivity:'3',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that= this;
    let shopId = 0;
 
    if (options.shopId) {
      this.setData({
        shopId: options.shopId
      })
      shopId = options.shopId;
      if (options.order == "1") {
        wx.getStorage({
          key: 'memberId',
          success: function (res) {
            that.setData({
              memberId: res.data
            });
            setTimeout(function(){
              that.reservation();
            },1000);
            
          }
        })
      };
    } else {
      var scene = decodeURIComponent(options.scene);
      this.setData({
        shopId: scene
      })
      shopId = scene;
      if (options.order == "1") {
        wx.getStorage({
          key: 'memberId',
          success: function (res) {
            that.setData({
              memberId: res.data
            });
            setTimeout(function () {
              that.reservation();
            }, 1000);

          }
        })
      
      };
    };


    //查看门店活动
    that.getactivity(shopId);
    /******获取缓存*****/
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        });
        wx.getStorage({
          key: 'status',
          success: function (res) {
            that.setData({
              status: res.data
            });
          }
        })
        wx.getStorage({
          key: 'baseInfo',
          success: function (res) {
            that.setData({
              baseInfo: res.data
            });
          }
        })
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

      this.shopcontent();
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
 
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */

  reservation:function(){
    let that = this;
   
            if(that.data.status==0){
              wx.navigateTo({
                url: '../../../user/bind-phone/bind-phone?shopId=' + that.data.shopId + '&page=4', //跳转到绑定手机页面
              })    
            return false;
            }

            if (that.data.baseInfo == 0) {
              wx.navigateTo({
                url: '../../../user/bind-info/bind-info?shopId=' + that.data.shopId + '&page=4', //跳转到绑定手机页面
              })
              return false;
            }
           

    //判断是不是会员
    if (that.data.memberId==0){
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
                     //推送到客多多
          //http://101.200.177.83:7988/kb/customerDetail/weChatWithNoVerifyNum           
          //http://sale.beibeiyue.com/kb/customerDetail/weChatWithNoVerifyNum
          Http.post('https://sale.beibeiyue.com/kb/customerDetail/weChatWithNoVerifyNum', {
                    phone: userphone,
                    birthday: birthday,
                    shopId: that.data.shopId,
                    activityId:'5',
                    spreadId: '17',
                  }).then(res => {
                        wx.hideLoading();
                     //判断参没参加过   
                          if(res.code==1000){
                            //预约成功
                                  that.setData({
                                  showx: true,
                                  showtit:'报名成功！',
                                  textshow1: '请保持手机通畅，稍后门店会联系您',
                                  textshow2: '您可以将活动分享给朋友，好东西给好朋友',
                                });
                          }else if(res.code==1020){

                            that.setData({
                              showx: true,
                              showtit: '温馨提示',
                              textshow1: '您已经参加过“5.1欢乐游”的活动咯~',
                              textshow2: '您可以将活动分享给朋友，好东西给好朋友',
                            });

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

 

      })
    }else{
      that.setData({
        showx:true,
        showtit: '温馨提示',
        textshow1: '该活动仅针对首次体验非会员用户',
        textshow2: '您可以将活动分享给朋友，好东西给好朋友',
      });
    };
  },
  hidefx(){
    let that =this;
    that.setData({
      showx: false,
    });
  },
  onclick(){
    this.setData({
      showx: false,
    });
  },
  onShareAppMessage: function (res) {
    let imageUrl = "https://ylbb-wxapp.oss-cn-beijing.aliyuncs.com/store/51activity_fx.jpg";
    let shopId = this.data.shopId;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      title:'百城千店庆五一，超值游泳体验卡，限时特惠啦~',
      path: '/pages/index/detail/activity/activity?shopId=' + shopId,
      imageUrl: imageUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getactivity(storeId) {
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
        let agio = ((res.result.discountPrice / res.result.price) * 10).toFixed(1);
        that.setData({
          discountPrice: res.result.discountPrice,//活动价格
          inActivity: res.result.inActivity, //门店是否有活动
          price: res.result.price, //活动原价
          activityId: res.result.activityId, //活动id
          agio: agio
        });
      
      }else{
        that.setData({
          inActivity: 0, //门店是否有活动
        });
      }
    }, _ => {
      wx.hideLoading();
    });
  },
shopcontent(){
  wx.showLoading({
    title: '加载中...',
  })
  Http.post('/shop/getShopDetail', {
    paramJson: JSON.stringify({
      id: this.data.shopId,
      lon: this.data.lon,
      lat: this.data.lat,
    })
  }).then(res => {
    wx.hideLoading();
    if (res.code == 1000) {
      let storeItem = res.result;
      if (storeItem.distance > 1000) {
        storeItem.distance = (storeItem.distance / 1000).toFixed(1) + 'km';
      } else {
        storeItem.distance = storeItem.distance + 'm';
      }
      this.setData({
        storeItem: storeItem,
        lats: storeItem.lat,
        lons:storeItem.lng
      });
    } else {
    }
  }, _ => {
    wx.hideLoading();
  });
},
/************导航功能*************/
mapclick() {
  const _this = this.data;
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude;
      wx.openLocation({
        latitude: Number(_this.lats),
        longitude: Number(_this.lons),
        name: _this.shopName,
        address: _this.address,
        scale: 28
      })
    }
  })
  return false;
},
details () {
  wx.navigateTo({
    url: '../detail?shopId='+this.data.shopId,
  })
  },

/*******************回到首页*************************/
  backindex:function(){
    wx.switchTab({
      url: '../../index',
    })
  },

/*******************获取用户状态*************************/
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
        var baseInfo;
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
          openid: openid,
          baseInfo: baseInfo,
          status:status 
        });
      

      }
    }, _ => {
      wx.hideLoading();
    });
  }, 


})