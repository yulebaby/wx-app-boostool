const app = getApp();
const Http = require('./../../utils/request.js');
let ctx = wx.createCanvasContext('canvasArcCir');
let WXwidth = wx.getSystemInfoSync().windowWidth;
let cxtWidth = 350 / 750 * WXwidth;
Page({
  data: {

  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    this.drawCircle();
    let cxt_arc = wx.createCanvasContext('canvasCircle');
    cxt_arc.setLineWidth(15);
    cxt_arc.setStrokeStyle('#eaeaea');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2-15, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.draw();
  },
  drawCircle: function () {
    function drawArc(s, e) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, cxtWidth, cxtWidth);
      ctx.draw();
      var x = cxtWidth / 2, y = cxtWidth / 2, radius = cxtWidth / 2-15;
      ctx.setLineWidth(15);
      //渐变失效
      // let grd = ctx.createCircularGradient(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2)
      // grd.addColorStop(0, '#5EA3FE')
      // grd.addColorStop(1, '#B8D0FF')
      ctx.setStrokeStyle('#5EA3FE');
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
  /* ------------ 获取列表数据 ------------ */
  getStoreItems(param) {
    var paramJson;

    wx.showLoading({ title: '加载中...' });
    Http.post('/shop/listShop', { paramJson }).then(res => {
      wx.hideLoading();
    }, _ => {
      wx.hideLoading();
    });
  }
})