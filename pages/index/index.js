//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    serverUrl:app.serverUrl,
    // false 表示显示首页icon
    indexFlag: false,
    imageUrl:""
  },
  onLoad:function(){
    //页面加载时访问获取到openid
    this.getOpenid()
  },
  // 获取用户openid
  getOpenid: function () {
    var that = this;
    wx.login({
      success: function (res) {
        //发送请求
        return app.sendData(
          that.data.serverUrl + '/login/getOpenid',
           "GET",
           { code: res.code,type:1 }
          )
          .then(res=>{
            var result = res.data;
            if (result.code != 200) {
              wx.showToast({
                icon:'none',
                title: '远程响应失败',
              })
              return;
            }
            //放置到globalData中
            app.globalData.openid = result.data.openid;
          },rej=>{
            wx.showToast({
              icon: 'none',
              title: '网络加载出现问题',
            })
          });
      }
    })
  },
  login:function(e){
    var that = this;
    //收集个人信息
    var userInfo = e.detail.userInfo;
    //如果拒绝用户信息授权
    if (userInfo == undefined){
      wx.showModal({
        title: '微信授权',
        content: '您已拒绝访问授权,如需访问请先授权'
      })
      return;
    }
    var data = {
      "openId": app.globalData.openid,
      "nickName":userInfo.nickName,
      "gender": userInfo.gender,
      "avatarUrl": userInfo.avatarUrl
    }
    // 登录
    return app.sendData(
      that.data.serverUrl + '/login/register',
      "POST",
      JSON.stringify(data)
    )
      .then(res => {
        var result = res.data;
        if (result.code != 200) {
          wx.showToast({
            icon: 'none',
            title: '登录失败,远程网络连接失败',
          })
          return;
        }
        // 登录成功时收集个人信息
        // app.globalData.userInfo = result.data
        // 使用本地缓存
        app.setGlobalUserInfo(result.data);
        // 返回上页
        wx.switchTab({
          url: '/pages/home/home',
        })
      }, rej => {
        wx.showToast({
          icon: 'none',
          title: '网络加载出现问题'
        })
      });
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '搜索你要的大学课后答案 -- 知际星',
      path: '/pages/home/home'
    }
  }
})