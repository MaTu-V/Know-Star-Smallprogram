// pages/home/home.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //地址
    serverUrl: app.serverUrl,
    //请求swiper课程系列数据
    series:[],
    //加载动画状态
    loadingFlag: true,
    //最新数据
    newest:[],
    //推荐数据
    recommend:[],
    noneFlag:false,
    //分页总数
    records: '',
    // 当前页数
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 两者均完成后(解决多个异步ajax请求) (获取滚动条数据) (获取书籍信息)
    Promise.all([that.sendSwiper(),that.sendClassifyUse()]).then(res=>{
      // 分别对应swiper滚动条数据 / 图书信息数据
      var swiperData = res[0].data;
      var newestData = res[1].data;
      if (swiperData.code != 200 || newestData.code !=200){
        wx.showToast({
          icon: 'none',
          title: '数据加载失败',
        })
        return;
      }
      //当异步请求后数据全部接收到 则将加载动画关闭
      that.setData({
        series: swiperData.data,
        newest:newestData.data.rows
      })
      that.sendBook(that.data.page);
    },rej=>{
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    //获取总页数
    var records = Math.floor(that.data.records /4);
    //获取当前页
    var currentPage = that.data.page;
    if(currentPage == records){
      wx.showToast({
        icon:'none',
        title:'童鞋,推荐到底啦！'
      })
      // 无更多数据
      that.setData({
        noneFlag: true
      })
      return;
    }
    var page = currentPage + 1;
    //传入当前page
    that.sendBook(page);
  },
  /**
   * 获取滚动swiper数据
   */
  sendSwiper:function(){
    var that = this;
    //获取数据
    return app.sendData(that.data.serverUrl + '/series/getSeries/', "GET");
  },
  
  /**
   * 获取页面书籍信息
   */
  sendBook:function(page){
    var that = this;
    //获取推荐书籍
    that.data.loadingFlag = true;
    var recommend = true;
    //获取数据
    return app.sendData(that.data.serverUrl + '/book/getBookInfo?recommend=' + recommend + '&page=' + page , "POST").then(res=>{
      var bookData = res.data;
      if (bookData.code != 200) {
        wx.showToast({
          icon: 'none',
          title: '书籍数据返回失败',
        })
        return;
      }
      // 如果当前页数为第一页清空原本数据后做拼接
      if (page == 1) {
        that.setData({
          books: []
        })
      }
      // 获取新数据
      var newBooks = bookData.data.rows;
      // 加载原本数据
      var oldBooks = that.data.recommend;
      //新旧数据拼接
      that.setData({
        page: bookData.data.page,
        records: bookData.data.records,
        recommend: oldBooks.concat(newBooks),
        loadingFlag: false
      })
    })
  },
   /**
   * 获取常用分类
   */
  sendClassifyUse:function(){
    var that = this;
    //获取常用分类
    return app.sendData(that.data.serverUrl + '/classify/getClassifyUse', "GET");
  },
  /**
   * swiper点击跳转
   */
  toCategory: function (e) {
    // 获取当前点击swiper-item内容的id名称及背景色
    var id = e.currentTarget.dataset.item.id;
    var title = e.currentTarget.dataset.item.name;
    var back = e.currentTarget.dataset.item.back;
    //页面跳转
    wx.navigateTo({
      url: '/pages/category/category?id=' + id + '&title=' + title + '&back=' + back
    })
  },
  /**
   * 跳转到答案内容
   */
  toMaterial:function(e){
    var that = this;
    // 获取书籍id
    var book = e.currentTarget.dataset.item;

    // 点击访问量 + 1 
    
    app.sendData(that.data.serverUrl + '/book/addCollectionByBookId/' + book.id, "GET");
    //页面跳转
    wx.navigateTo({
      url: '/pages/material/material?book=' + JSON.stringify(book)
    })
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