const app = getApp();
Component({
  properties: {
    name: {
      type: String,
      value: '知际星'
    },
    back:{
      type: String,
      value:"#fff"
    },
    color:{
      type: String,
      value: "#000"
    },
    // true表示不显示首页icon
    indexFlag: {
      type: Boolean,
      value: true
    },
    // 左侧按钮显示
    flag:{
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 计算导航条高度
    statusBarHeight: app.globalData.statusBarHeight,
    titleBarHeight: app.globalData.titleBarHeight,
    headerH: app.globalData.headerH,
    containerTop: app.globalData.containerTop,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //返回上页
    ToBack() {
      wx.navigateBack({
        delta: 1
      });
    },
    ToSearch(){
      wx.navigateTo({
        url: '/pages/search/search',
      })
    },
    ToHome(){
      wx.switchTab({
        url: '/pages/home/home',
      })
    }
  }
})