// pages/index/IndexChange/IndexChange.js
const app = getApp();
const Http = require('../../../utils/request.js');
let ctx = wx.createCanvasContext('canvasArcCir');
let ctx1 = wx.createCanvasContext('canvasArcCir1');
let ctx2 = wx.createCanvasContext('canvasArcCir2');
let WXwidth = wx.getSystemInfoSync().windowWidth;
let cxtWidth = 144 / 750 * WXwidth;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    tab1:{},
    tab2:{},
    tab3:{},
    clue:'',
    experience:'',
    personalCenter:'',
    lastX: 0,          //滑动开始x轴位置
    btns:'',
    meanMonsy:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentTab: options.status
    });
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.storeId) {
      this.getData();
    } else {
      wx.showToast({
        title: '请登陆',
        icon: 'none'
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '../../login/login',
        })
      }, 1500)

    }
    let cxt_arc = wx.createCanvasContext('canvasCircle');
    cxt_arc.setLineWidth(5);
    cxt_arc.setStrokeStyle('#6eacfe');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2 - 5, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.draw();

    let cxt_arc1 = wx.createCanvasContext('canvasCircle1');
    cxt_arc1.setLineWidth(5);
    cxt_arc1.setStrokeStyle('#6eacfe');
    cxt_arc1.setLineCap('round');
    cxt_arc1.beginPath();
    cxt_arc1.arc(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2 - 5, 0, 2 * Math.PI, false);
    cxt_arc1.stroke();
    cxt_arc1.draw();

    let cxt_arc2 = wx.createCanvasContext('canvasCircle2');
    cxt_arc2.setLineWidth(5);
    cxt_arc2.setStrokeStyle('#6eacfe');
    cxt_arc2.setLineCap('round');
    cxt_arc2.beginPath();
    cxt_arc2.arc(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2 - 5, 0, 2 * Math.PI, false);
    cxt_arc2.stroke();
    cxt_arc2.draw();
  },
  switchTab(e){
    this.setData({ currentTab: e.currentTarget.dataset.current})
    this.getData();
  },
  drawCircle: function (clue) {
    function drawArc(s, e) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, cxtWidth, cxtWidth);
      ctx.draw();
      var x = cxtWidth / 2, y = cxtWidth / 2, radius = cxtWidth / 2 - 5;
      ctx.setLineWidth(5);
      ctx.setStrokeStyle('#fff');
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, radius, s, e, false);
      ctx.stroke()
      ctx.draw()
    }
    let step = clue, startAngle = 1.5 * Math.PI, endAngle = 0;
    let n = 100;
    endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
    drawArc(startAngle, endAngle);
  },
  drawCircle1: function (num) {
    function drawArc(s, e) {
      ctx1.setFillStyle('white');
      ctx1.clearRect(0, 0, cxtWidth, cxtWidth);
      ctx1.draw();
      var x = cxtWidth / 2, y = cxtWidth / 2, radius = cxtWidth / 2 - 5;
      ctx1.setLineWidth(5);
      ctx1.setStrokeStyle('#fff');
      ctx1.setLineCap('round');
      ctx1.beginPath();
      ctx1.arc(x, y, radius, s, e, false);
      ctx1.stroke()
      ctx1.draw()
    }
    let step = num, startAngle = 1.5 * Math.PI, endAngle = 0;
    let n = 100;
    endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
    drawArc(startAngle, endAngle);
  }, 
  drawCircle2: function (num) {
    function drawArc(s, e) {
      ctx2.setFillStyle('white');
      ctx2.clearRect(0, 0, cxtWidth, cxtWidth);
      ctx2.draw();
      var x = cxtWidth / 2, y = cxtWidth / 2, radius = cxtWidth / 2 - 5;
      ctx2.setLineWidth(5);
      ctx2.setStrokeStyle('#fff');
      ctx2.setLineCap('round');
      ctx2.beginPath();
      ctx2.arc(x, y, radius, s, e, false);
      ctx2.stroke()
      ctx2.draw()
    }
    let step = num, startAngle = 1.5 * Math.PI, endAngle = 0;
    let n = 100;
    endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
    drawArc(startAngle, endAngle);
  },
  getData(){
    let that = this;
    if (that.data.currentTab==0){
      wx.showLoading({ title: '加载中...' });
      Http.post('/analysis/clue', {
        storeId: app.globalData.storeId
      }).then(res => {
        let clue =  ((res.result.doneClueNum / res.result.cluesNum)*100).toFixed(2);
        that.setData({
          tab1: res.result,
          clue:clue
        })
          that.drawCircle(clue);
        wx.hideLoading();
      }, _ => {
        wx.hideLoading();
      });
    } else if (that.data.currentTab == 1){
        wx.showLoading({ title: '加载中...' });
        Http.post('/analysis/experience', {
          storeId: app.globalData.storeId
        }).then(res => {
          let num = ((res.result.doneExperienceNum / res.result.experienceNum)*100).toFixed(2);
          that.setData({
            tab2: res.result,
            experience: num
          })
          that.drawCircle1(num);
          wx.hideLoading();
        }, _ => {
          wx.hideLoading();
        });
    }else if(that.data.currentTab==2){
        wx.showLoading({ title: '加载中...' });
        Http.post('/analysis/doCart', {
          storeId: app.globalData.storeId
        }).then(res => {
          let num = ((res.result.doneDoCardNum / res.result.doCardNum)*100).toFixed(2);
          let meanMonsy = parseInt(res.result.doCartList[res.result.doCartList.length - 1].total / res.result.doCartList[res.result.doCartList.length - 1].cnt);
          meanMonsy = meanMonsy ? meanMonsy : 0;
          that.setData({
            tab3: res.result,
            personalCenter: num,
            meanMonsy: meanMonsy
          })
          that.drawCircle2(num);
          wx.hideLoading();
        }, _ => {
          wx.hideLoading();
        });
    }
  },
  switchChange(e) {
    this.setData({ currentTab: e.detail.current });
    this.getData();
  },
  handletouchtart: function (event) {
       this.data.lastX = event.touches[0].pageX;
    this.setData({
      btns: '',
    })
  },
  handletouchmove(event){
      let currentX = event.touches[0].pageX;
      let tx = currentX - this.data.lastX;
    if (tx>25){
      this.setData({
        btns: 'left',
      })
    }
    if (tx < -25) {
      this.setData({
        btns:  'right',
      })
    }
    this.setData({
      lastX: currentX
    })
  },
  handletouchend(){
    if(this.data.btns=='left'){
      
      if(this.data.currentTab > 0){
        this.getData();
          this.setData({
            currentTab: this.data.currentTab - 1,
          })
      }
    } else if (this.data.btns == 'right'){
     
        if (this.data.currentTab < 2) {
          this.getData();
          this.setData({
            currentTab: parseInt(this.data.currentTab) + 1,
          })
        }
    }
    
  }
})