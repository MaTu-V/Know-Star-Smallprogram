// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //地址
    serverUrl:app.serverUrl,
    //用户信息
    userInfo:"",
    // 签到状态
    qianFlag:true,
    //加载动画状态
    loadingFlag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 加载用户个人信息
    if (app.getGlobalUserInfo().id == undefined || app.getGlobalUserInfo().id == ''){
      // 卸载当前页面
      wx.redirectTo({
        url: '/pages/index/index',
      })
      return;
    }
      // 回调
     that.sendInfo().then(res => {
        // 分别对应用户信息 / 网站信息
        var userData = res.data;
        if (userData.code != 200) {
          wx.showToast({
            icon: 'none',
            title: '用户数据加载失败,刷新试试',
          })
          return;
        }
        //更新本地缓存的用户信息
        app.setGlobalUserInfo(userData.data);
        //设置对应数据
        that.setData({
          userInfo: app.getGlobalUserInfo(),
          loadingFlag:false
        })
      }, rej => {
        wx.showToast({
          icon: 'none',
          title: '用户数据加载失败,刷新试试',
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
  },
  /**
   * 获取用户信息
   */
  sendInfo: function () {
    var that = this;
    var userInfo = app.getGlobalUserInfo();
    // 用户id不存在则需要重新登录
    if (userInfo.id == undefined){
      wx.redirectTo({
        url: '/pages/index/index',
      })
      return;
    }
    // 根据用户id获取数据
    return app.sendData(
      that.data.serverUrl + '/user/getUserInfo?id=' + userInfo.id,
      "POST",null,{
        'content-type': 'application/json',
        'user-id': userInfo.id,
        'user-token': userInfo.uniqueToken
      });
  },
  /**
   * 获取用户收藏
   */
  toCollection:function(){
    var that = this;
    // 用户id不存在则需要重新登录
    if (that.data.userInfo.id == undefined) {
      wx.redirectTo({
        url: '/pages/index/index',
      })
      return;
    }
    // 根据用户id获取收藏书籍
    wx.navigateTo({
      url: '/pages/book/book?color=#000&userColId=' + that.data.userInfo.id
    })
  },
  /**
   * 跳转我的发布
   */
  toPublish:function(){
    wx.navigateTo({
      url: '/pages/about/blank/blank',
    })
  },
  /**
   * 清除用户信息
   */
  clearMessage:function(){
    app.setGlobalUserInfo(null);
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  /**
   * 复制github连接
   */
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
          }
        })
      }
    })
  }
})