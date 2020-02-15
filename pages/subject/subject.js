// pages/category/category.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl:app.serverUrl,
    // 加载动画
    loadingFlag:true,
    //数据内容
    categories: [],
    classifies: [],
    // 选中
    idx:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    // 通过id获取对应的数据
    Promise.all([that.sendCategory()]).then(res => {
      var categoryData = res[0].data;
      if (categoryData.code != 200) {
        wx.showToast({
          icon: 'none',
          title: '数据加载失败',
        })
        return;
      }
      // 当异步请求后数据全部接收到 则将加载动画关闭
      that.setData({
        // TODO:单词写错
        categories: categoryData.data,
        loadingFlag: false
      })
      // 获取对应分类数据
      that.sendClassify(null);
    }, rej => {
      wx.showToast({
        icon: 'none',
        title: '网络加载出现问题',
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
   * 加载该课程系列分类
   */
  sendCategory: function (){
    var that =  this;
    //通过传递的id获取对应的数据
    return app.sendData(that.data.serverUrl + '/category/getCategoryAll/', "GET");
  },
  /**
   * 用户点击请求类别科目
   */
  sendClassify: function (e) {
    var that = this;
    //得到当前点击的分类id(默认加载当前分类标签的第一个)
    var id = e != null ? e.currentTarget.dataset.id : that.data.categories[0].id;
    // 点击分类标签
    var index = e != null ? e.currentTarget.dataset.index : 0;
    //点击分类样式的修改 / 并且 因为此时会向服务器获取数据 将显示加载状态
    that.setData({
      idx: index,
      loadingFlag: true
    })
    // 获取分类数据 ( 并且直接渲染 )
    return app.sendData(that.data.serverUrl + '/classify/getClassify/' + id,"GET").then(
      res=>{
        var classifyData = res.data;
        if (classifyData.code != 200){
          wx.showToast({
            icon: 'none',
            title: '读取分类信息失败',
          })
          return;
        }
        // 渲染分类数据
        that.setData({
          classifies: classifyData.data,
          loadingFlag: false
        })
      },rej=>{
        wx.showToast({
          icon: 'none',
          title: '网络加载出现问题',
        })
      }
    );
  },
  /**
   * 点击跳转书籍页面
   */
  toBook: function(e){
    var that = this;
    // 获取当前swiper的index和title
    var id = e.currentTarget.dataset.item.id;
    var title = e.currentTarget.dataset.item.name;
    var back = e.currentTarget.dataset.item.iconBack;
    //页面跳转
    wx.navigateTo({
      url: '/pages/book/book?classifyId=' + id + '&title=' + title + '&back=' + back
    })
  }
})