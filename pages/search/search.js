// pages/search/search.js
const app = getApp();
var WxSearch = require('../../wxSearchView/wxSearchView.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: app.serverUrl,
    //背景色、标题、字体颜色
    back: "#fff",
    title: "知际星",
    color: "#000",
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: that.data.serverUrl + '/hot/getHotword/',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (result.code != 200) {
          wx.showToast({
            icon: 'none',
            title: '数据读取失败',
          })
          return;
        }
        var hotwords = result.data;
        // 2 搜索栏初始化
        WxSearch.init(
          that,  // 本页面一个引用
          hotwords, // 热点搜索推荐，[]表示不使用
          hotwords,// 搜索匹配，[]表示不使用
          that.mySearchFunction, // 提供一个搜索回调函数
          that.myGobackFunction //提供一个返回回调函数
        );
      }
    })
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
  // 3 转发函数，固定部分，直接拷贝即可
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 4 搜索回调函数  
  mySearchFunction: function (value) {
    // 示例：跳转
    wx.navigateTo({
      url: '/pages/book/book?color=#000&isSave=1&search=' + value + '&goback=true'
    })
  },

  // 5 返回回调函数
  myGobackFunction: function () {
    // 示例：返回
    wx.switchTab({
      url: '/pages/home/home'
    })
  }
})