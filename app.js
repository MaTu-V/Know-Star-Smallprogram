App({
  //地址信息用户信息
  serverUrl: "http://localhost:8887",
  userInfo: null,
  //计算高度
  onLaunch: function () {
    var app = this;
    // wx.getSystemInfo({
    //   success: function(e) {
    //     app.globalData.statusBarHeight = e.statusBarHeight;
    //     let headerH = wx.getMenuButtonBoundingClientRect();
    //     app.globalData.headerH = headerH;
    //     app.globalData.titleBarHeight = headerH.bottom + headerH.top - (e.statusBarHeight * 2 );
    //     app.globalData.containerTop = headerH.bottom + headerH.top - (e.statusBarHeight );
    //   }
    // })
  },
  //用户本地数据缓存
  setGlobalUserInfo(user){
    wx.setStorageSync("userInfo", user)
  },
  getGlobalUserInfo(){
    return wx.getStorageSync("userInfo")
  },
 //保存当前顶部导航的信息 
  globalData:{
  },
  /**
   * 公共请求数据方法
   */
  sendData: function (url, method, data, header){
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: method || "GET",
        data: data || "",
        header: header || { 'content-type': 'application/json' },
        success: function (res) {
          resolve(res);
        },
        error: function (res) {
          reject(res);
        }
      })
    })
  }
})