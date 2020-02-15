// pages/materials/materials.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //地址
    serverUrl: app.serverUrl,
    //用户信息
    userInfo: "",
    // 加载动画
    loadingFlag: true,
    //数据内容
    book:[],
    materials:[],
    // 是否存在资料
    materialsFlag:false,
    // 是否已收藏
    collectionFlag: false,
    // 广告状态
    adFlag:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //拿到url路径传递的参数
    var that = this;
    var book = JSON.parse(options.book);
    // 获取传递参数统一配置 && 加载用户个人信息
    that.setData({
      book: book,
      userInfo: app.getGlobalUserInfo() != undefined ? app.getGlobalUserInfo() : ""
    })
    // 两者均完成后(解决多个异步ajax请求) (获取资料数据) (判断是否收藏过)
    Promise.all([that.sendMaterials(book.id,0), that.isExistCollection(book.id)]).then(res => {
      // 分别对应获取资料数据 / 判断是否收藏过
      var materialsData = res[0].data;
      var isColData = res[1].data;
      if (materialsData.code != 200 && isColData.code !=200) {
        wx.showToast({
          icon: 'none',
          title: '数据返回失败',
        })
        return;
      }
      if (materialsData.data.length > 0) {
        that.setData({
          materials: materialsData.data,
          materialsFlag: true
        })
      }else{
        wx.showToast({
          icon:'none',
          title:'童鞋,该书还未收集到相关资料'
        })
      }
      // 切换状态
      that.setData({
        collectionFlag: isColData.data ===undefined ? false: isColData.data,
        loadingFlag:false
      })
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
   * 获取答案信息
   */
  sendMaterials:function(id,types){
    var that = this;
    //判断当前书籍id是否存在
    if(id == null || id == undefined || id == ''){
      wx.showToast({
        icon: 'none',
        title: '该书籍及相关资料已被删除'
      })
      return;
    }
    // 获取资料信息
    return app.sendData(
      that.data.serverUrl + '/material/getMaterial?id=' + id + '&types=' + types,
      "POST",
      {
        'content-type': 'application/json',
        'user-id': that.data.userInfo.id,
        'user-token': that.data.userInfo.uniqueToken
      }
    );
  },
  /**
   * 点击收藏
   */
  chooseCollection:function(e){
    var that = this;
    var bookId = e.currentTarget.dataset.id;
    var flag = that.data.collectionFlag;
    // 用户id不存在则需要重新登录
    if (that.data.userInfo.id === undefined) {
      wx.redirectTo({
        url: '/pages/index/index',
      })
      return;
    }
    // 根据用户id获取数据
    var data ={
      "userId": that.data.userInfo.id,
      "bookId": bookId
    }
    // 收藏
    return app.sendData(
      that.data.serverUrl + '/collection/addCollection?status=' + !flag,
      "POST",
      JSON.stringify(data),
      {
        'content-type': 'application/json',
        'user-id': that.data.userInfo.id,
        'user-token': that.data.userInfo.uniqueToken
      }).then(res => {
        // 数据库 存储过程权限问题
        var result = res.data;
        if (result.code != 200) {
          wx.showToast({
            icon: 'none',
            title: '收藏失败'
          })
          return;
        }
        //切换状态
        that.setData({
          collectionFlag: !flag
        })
      },rej=>{
        wx.showToast({
          icon: 'none',
          title: '网络加载出现问题'
        })
      });
  },
  /**
   * 判断是否已收藏
   */
  isExistCollection:function(bookId){
    var that = this;
    var flag = that.data.collectionFlag;
    //书籍是否存在
    if (bookId == null || bookId == undefined || bookId == '') {
      wx.showToast({
        icon: 'none',
        title: '读取失败'
      })
      return;
    }
    // 根据用户id获取数据
    var data = {
      "userId": that.data.userInfo.id,
      "bookId": bookId
    }
    //获取数据
    return app.sendData(
      that.data.serverUrl + '/collection/isCollection', "POST", JSON.stringify(data), {
        'content-type': 'application/json',
        'user-id': that.data.userInfo.id,
        'user-token': that.data.userInfo.uniqueToken
      });
  },
  /**
   * 跳转到用户发布页
   */
  sendUpload:function(e){
    var bookId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/upload/upload?bookId=' + bookId,
    })
  },
  //激励式视频：
  videoClick: function(e) {
    // TODO: 待修改
    var that = this;
    // 在页面中定义激励视频广告
    let videoAd = null;
    wx.navigateTo({
      url: '/pages/picture/picture?title=' + e.currentTarget.dataset.item.name +
        '&pictureUrl=' + e.currentTarget.dataset.item.fileUrl,
    })

    //  QQ 小程序激励广告代码
    // if(that.data.adFlag){
    //   wx.showModal({
    //     title:'友情提示',
    //     content:'童鞋,首次点击需观看广告解锁章节.',
    //     success(res) {
    //       if(!res.confirm){
    //         return
    //       }
    //       that.setData({
    //         adFlag:false
    //       })
    //       // 在页面onLoad回调事件中创建激励视频广告实例
    //       if (wx.createRewardedVideoAd) {
    //         videoAd = wx.createRewardedVideoAd({
    //           adUnitId: '58c8005620d4cb7d2391305956a651f1'
    //         })
    //       }
    //       // 用户触发广告后，显示激励视频广告
    //       if (videoAd) {
    //         videoAd.show().catch(() => {
    //           // 失败重试
    //           videoAd.load().then(() => videoAd.show()).catch(err => {
    //             console.log('激励视频 广告显示失败')
    //           })
    //         })
    //         videoAd.onClose((status) => {
    //           if (status && status.isEnded || status === undefined) {
    //             // 正常播放结束，下发奖励
    //             // 打开文档
    //             wx.navigateTo({
    //               url: '/pages/picture/picture?title=' + e.currentTarget.dataset.item.name +
    //               '&pictureUrl=' + e.currentTarget.dataset.item.fileUrl,
    //             })
    //           } else {
    //             // 播放中途退出，进行提示
    //             // 打开文档
    //             wx.navigateTo({
    //               url: '/pages/picture/picture?title=' + e.currentTarget.dataset.item.name +
    //               '&pictureUrl=' + e.currentTarget.dataset.item.fileUrl,
    //             })
    //           }
    //         })
    //       }
    //     }
    //   })
    // }else{
    //   wx.navigateTo({
    //     url: '/pages/picture/picture?title=' + e.currentTarget.dataset.item.name +
    //    '&pictureUrl=' + e.currentTarget.dataset.item.fileUrl,
    //  })
    // }
  },
  sendMaterialData(e){
    var that = this;
    var bookId = e.currentTarget.dataset.id;
    var types = e.currentTarget.dataset.types;
    that.setData({
        loadingFlag:true
    })
    that.sendMaterials(bookId,types).then(res=>{
      var materialsData = res.data;
      if (materialsData.code != 200) {
        wx.showToast({
          icon: 'none',
          title: '数据返回失败',
        })
        return;
      }
      if (materialsData.data.length > 0) {
        that.setData({
          materials: materialsData.data,
          materialsFlag: true
        })
      }else{
        wx.showToast({
          icon:'none',
          title:'童鞋,该书还未收集到相关资料'
        })
        that.setData({
          materials: [],
          materialsFlag: false
        })
      }
      // 切换状态
      that.setData({
        loadingFlag:false
      })
    });
  }
})