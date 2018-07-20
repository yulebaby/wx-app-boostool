// pages/index/IndexChange/IndexChange.js
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
    currentTab:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentTab: options.status
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawCircle();
    this.drawCircle1();
    this.drawCircle2(); 
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
  },
  drawCircle: function () {
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
    let step = 50, startAngle = 1.5 * Math.PI, endAngle = 0;
    let n = 100;
    endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
    drawArc(startAngle, endAngle);
  },
  drawCircle1: function () {
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
    let step = 50, startAngle = 1.5 * Math.PI, endAngle = 0;
    let n = 100;
    endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
    drawArc(startAngle, endAngle);
  }, 
  drawCircle2: function () {
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
    let step = 50, startAngle = 1.5 * Math.PI, endAngle = 0;
    let n = 100;
    endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
    drawArc(startAngle, endAngle);
  } 
})