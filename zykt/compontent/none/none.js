const app = getApp();
Component({
  properties: {
    title:{
      type: String,
      value:"未找到书籍信息"
    },
    flag: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tohome:function(){
      wx.switchTab({
         url: '/pages/home/home'
      })
    }
  }
})