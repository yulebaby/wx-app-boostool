const App = getApp();
const Http = require('./../../../utils/request.js');
const getUserInfo = require('./../../../utils/getUserInfo.js');
Page({
  data: {
    userHeadImg: null,
    relationshipIndex: null,
    relationshipArray: ['爸爸', '妈妈', '爷爷', '奶奶', '外公', '外婆', '其他'],
    birthday: '',
    babyname: ''
  },
  onLoad: function (options) {
    getUserInfo(false).then( userInfo => this.setData({ userInfo }));
  },
  /**********验证宝宝姓名生日关系----提交*************/
  submit() {
    if (!this.data.babyname) {
      wx.showToast({
        icon: "none",
        title: '请输入宝宝的名字',
        duration: 2000
      })
      return false;
    }

    if (!this.data.birthday) {
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
    

    //erp接口 
    Http.post('/user/saveUserBaseInfo', {
      paramJson: JSON.stringify({
        onlyId: this.data.userInfo.openid,
        nickName: this.data.babyname,
        relationship: this.data.relationshipIndex,
        birthday: this.data.birthday
      })
    }).then(res => {
      wx.hideLoading();
      getUserInfo(false, true).then(userInfo => {
        wx.navigateBack();
        this.branchpost(); //往客多多推送信息
      })
    });
  
  },
  //非会员录入信息
  branchpost() {
    Http.post('/user/getUserInfo', {
      onlyId: this.data.userInfo.openid,
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        var userphone = res.result.userPhone + '';
        // Http.post('https://sale.beibeiyue.com/kb/manager/register', {
        //   typeStyle: 1,
        //   phone: userphone,
        //   spreadId: '10000002',
        //   birthday: birthday,
        //   babyName: _this.data.babyname,
        // })
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
  babyname(e) {
    this.setData({
      babyname: e.detail.value
    })
  },
})