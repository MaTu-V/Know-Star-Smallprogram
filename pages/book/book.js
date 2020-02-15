// pages/details/details.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //地址
    serverUrl: app.serverUrl,
    // 加载动画
    loadingFlag: true,
    // 数据暂无信息
    noneFlag: false,
    noneSearchFlag:false,
    noneSearchTitle:'',
    //数据内容
    books: [],
    classifyId:"",
    // 通过点击收藏进入
    isSave:0,
    userColId: "",
    // 通过查找进入 （search中保存查找内容）
    search: false,
    goback:'',
    //分页总数
    records: '',
    // 当前页数
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //拿到url路径传递的参数
    var that = this;
    if (options.isSave == null || options.isSave == '' || options.isSave == undefined){
      options.isSave = 0;
    }
    // 获取传递参数统一配置
    that.setData({
      classifyId: options.classifyId != undefined ? options.classifyId : "",
      isSave: options.isSave != undefined ? options.isSave : 0,
      search: options.search != undefined ? options.search : "",
      goback: options.goback != undefined ? options.goback : false, 
      userColId: options.userColId != undefined ? options.userColId : ""
    })
    //获取分类数据
    that.sendBook(that.data.userColId, that.data.classifyId,that.data.page,that.data.search,that.data.isSave);
  },
  /**
   * 监听卸载
   */
  onUnload: function () {
    var that =this;
    if(that.data.goback){
      wx.switchTab({
        url: '/pages/home/home'
      })
    }
    // var page = getCurrentPages()
    // page.filter(item=>{
    //    if(item.route === 'pages/search/search'){
    //       wx.switchTab({
    //         url: '/pages/home/home'
    //       })
    //    }
    //    return 
    // })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //未开启
    var that = this;
    //开启下拉刷新动画
    //获取数据 第一页即可
    that.sendBook(that.data.userColId, that.data.classifyId,1, that.data.search, that.data.isSave);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    //获取总页数
    var records = that.data.records;
    //获取当前页
    var currentPage = that.data.page;
    if(currentPage == records){
      // 无更多数据
      that.setData({
        noneFlag: true
      })
      return;
    }
    var page = currentPage + 1;
    //传入当前page
    that.sendBook(that.data.userColId, that.data.classifyId,page, that.data.search, that.data.isSave);
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
   * 加载分类书籍
   */
  sendBook: function (userColId,classifyId, page,search,isSave){
    var that = this;
    var page = page!=null? page: 1;
    // 数据一次返回8条 在请求数据时 显示加载动画
    that.setData({
      loadingFlag: true
    })
    //通过传递的id获取对应的数据 (并且直接渲染数据)
    return app.sendData(
      that.data.serverUrl + '/book/getBook?userColId='
      + userColId + '&classifyId=' + classifyId +
      "&keyword=" + search + "&isSave=" + isSave + "&page=" + page
      , "POST").then(
      res => {
        var bookData = res.data;
        if (bookData.code != 200) {
          wx.showToast({
            icon: 'none',
            title: '数据返回失败',
          })
          return;
        }

        if(bookData.data.rows.length === 0){
          that.setData({
            noneSearchFlag:true,
            noneSearchTitle: '暂时没有相关书籍 ~',
            loadingFlag: false
          })
          return
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
        var oldBooks = that.data.books;
        //新旧数据拼接
        that.setData({
          page: bookData.data.page,
          records: bookData.data.records,
          books: oldBooks.concat(newBooks),
          loadingFlag: false
        })
      }, rej => {
        wx.showToast({
          icon: 'none',
          title: '网络加载出现问题',
        })
      }
    );
  },
  /**
   * 跳转书籍详情页
   */
  toMaterial: function (e) {
    var that = this;
    // 获取书籍id
    var book = e.currentTarget.dataset.item;
    // 点击访问量 + 1 
    app.sendData(that.data.serverUrl + '/book/addCollectionByBookId/' + book.id, "GET");
    //页面跳转
    wx.navigateTo({
      url: '/pages/material/material?book=' + JSON.stringify(book)
    })
  }
})