// components/appointment/appointment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    selectTime: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    radioChange(e) {
      console.log(e.detail.value);
      this.setData({
        selectTime: e.detail.value
      })
    }
  }
})
