const app = getApp();
const Http = require('./../../utils/request.js');
let ctx = wx.createCanvasContext('canvasArcCir');
let ctxpos = wx.createCanvasContext('canvasArcpos');
let WXwidth = wx.getSystemInfoSync().windowWidth;
let cxtWidth = 350 / 750 * WXwidth;
Page({
  data: {
    clue:0,
    sup:0,
    card:0,
    form:{},
    percent:'',
    forms:{},
    experience:{}
  },
  onLoad: function (options) {
    let date = new Date();
    let year = date.getFullYear();
    let month  = date.getMonth()+1;
    let day = date.getDate();
    console.log(day);
    let dates = year + '年' + month + '月' + day+'日';
    let days = getCountDays() - day ;
    this.setData({
      dates:dates,
      days: days
    })

    function getCountDays() {
      var curDate = new Date();
      /* 获取当前月份 */
      var curMonth = curDate.getMonth();
      /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
      curDate.setMonth(curMonth + 1);
      /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
      curDate.setDate(0);
      /* 返回当月的天数 */
      return curDate.getDate();
    }

    

  },
  onReady: function () {
    if (app.globalData.storeId){
      this.getData();
    }else{
      wx.showToast({
        title: '请登陆',
        icon: 'none'
      }) 
     setTimeout(function(){
       wx.redirectTo({
         url: '../login/login',
       })
     },1500) 

    }
    let cxt_arc = wx.createCanvasContext('canvasCircle');
    cxt_arc.setLineWidth(18);
    cxt_arc.setStrokeStyle('#eaeaea');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(cxtWidth / 2, cxtWidth / 2, cxtWidth / 2-16, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.draw();
  },

  //canvas
  drawCircle: function (data) {
    function drawArc(s, e) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, cxtWidth, cxtWidth);
      ctx.draw();
      var x = cxtWidth / 2, y = cxtWidth / 2, radius = cxtWidth / 2-16;
      ctx.setLineWidth(12);
      ctx.setStrokeStyle('#5EA3FE');
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, radius, s, e, false);
      ctx.stroke()
      ctx.draw()
    }
    function drawArcs(s, e) {
      ctxpos.setFillStyle('white');
      ctxpos.clearRect(0, 0, cxtWidth, cxtWidth);
      ctxpos.draw();
      var x = cxtWidth / 2, y = cxtWidth / 2, radius = cxtWidth / 2 - 16;
      ctxpos.setLineWidth(13);
      ctxpos.setStrokeStyle('#FFDF3B');
      ctxpos.setLineCap('round');
      ctxpos.beginPath();
      ctxpos.arc(x, y, radius, s, e, false);
      ctxpos.stroke()
      ctxpos.draw()
    }    
    let step = data, startAngle = 1.5 * Math.PI, endAngle = 0;
    let n = 100;
        endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
        drawArc(startAngle, endAngle);
    if(step>100){
      let steps = step-100, startAngle = 1.5 * Math.PI, endAngle = 0;
      let n = 100;
      endAngle = steps * 2 * Math.PI / n + 1.5 * Math.PI;
      drawArcs(startAngle, endAngle);
    }    
  },
  /* ------------ 获取数据 ------------ */
  getData() {
    let that= this;
    wx.showLoading({ title: '加载中...' });
    /* 查询完成百分比 */    
    Http.post('/analysis/indexPage', { 
      storeId: app.globalData.storeId 
     }).then(res => {
       if(res.code==1000){
         let percent = ((res.result.doneTarget / res.result.target) * 100).toFixed(2);
 
       console.log(percent);
        that.setData({
          form:res.result,
          percent: percent
        })
        that.drawCircle(percent);
       }else{
         wx.showModal({
           title: '网络错误',
           content: '请检查网络',
           showCancel: false
         })
       }
      wx.hideLoading();
    }, _ => {
      wx.hideLoading();
    });
    /* 查询线索百分比 */
    Http.post('/analysis/monthPlan', {
      storeId: app.globalData.storeId
    }).then(res => {
      if (res.code == 1000) {
          let cluenum =((res.result.doneClueNum / res.result.cluesNum) * 100).toFixed(2);
        let supnum = ((res.result.doneExperienceNum / res.result.experienceNum) * 100).toFixed(2);
        let cardnum = ((res.result.doneDoCardNum / res.result.doCardNum) * 100).toFixed(2);        
          that.setData({
            forms:res.result,
            clue : cluenum,
            sup: supnum,
            card: cardnum
          })
      } else {
        wx.showModal({
          title: '网络错误',
          content: '请检查网络',
          showCancel: false
        })
      }
      wx.hideLoading();
    }, _ => {
      wx.showModal({
        title: '网络错误',
        content: '请检查网络',
        showCancel: false
      })
      wx.hideLoading();
    });

  },
  qk(){
    wx.navigateTo({
      url: './indexChange/indexChange',
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getData();
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
})