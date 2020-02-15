// pages/upload.js
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
    //书籍id
    bookId: "",
    //上传书籍名称
    materialName:"",
    // 上传书籍地址 
    materialUrl:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //拿到url路径传递的参数
    var that = this;
    // 判断书籍id是否存在
    if (options.bookId == undefined || options.bookId == '') {
      wx.navigateBack({
        delta: 1
      });
      return;
    }
    // 获取传递参数统一配置 && 加载用户个人信息
    that.setData({
      userInfo: app.getGlobalUserInfo() != undefined ? app.getGlobalUserInfo() : "",
      bookId:options.bookId
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
  /**
  * 用户输入信息存取
  */
  userInput: function (e) {
    this.setData({
      materialName: e.detail.value
    })
  },
  /**
    * 上传相关资料
    */
  uploadFile: function () {
    var that = this;
    var bookId = that.data.bookId;
    // 停止上传
    wx.showToast({
      icon: 'none',
      title: '暂未开放...'
    })
    return;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        const tempFilePaths = res.tempFiles[0].path;
        wx.uploadFile({
          url: that.data.serverUrl + '/material/uploadFile?userId=' + that.data.userInfo.id,
          filePath: tempFilePaths,
          name: 'file',
          type: 'post',
          header: {
            'content-type': 'multipart/form-data',
            'user-id': that.data.userInfo.id,
            'user-token': that.data.userInfo.uniqueToken
          },
          success(res) {
            var result = JSON.parse(res.data);
            if(result.status != 200){
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
              return;
            }
            that.setData({
              materialUrl: result.data.uploadUrl
            })
          }
        })
      }
    });
  },
  /**
   * 保存用户上传资料信息
   */
  uploadMaterial:function(){
    var that = this;
    // 停止上传
    wx.showToast({
      icon: 'none',
      title: '暂未开放...'
    })
    return;
    // 用户id不存在则需要重新登录
    if (that.data.userInfo.id == undefined) {
      wx.redirectTo({
        url: '/pages/index/index',
      })
      return;
    }

    if (that.data.materialName == undefined || that.data.materialName == '' || !that.data.materialName){
      wx.showToast({
        icon:'none',
        title: '资料名称不得为空！'
      })
      return;
    }
    wx.showLoading({
      title: '上传中....',
    })
    var data = {
      'name': that.data.materialName,
      'fileUrl': that.data.materialUrl,
      'userId': that.data.userInfo.id,
      'bookId': that.data.bookId
    }
    wx.request({
      url: that.data.serverUrl + '/material/uploadMaterial',
      data: JSON.stringify(data),
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        wx.hideLoading();
        if (result.status != 200) {
          wx.showToast({
            icon:'none',
            title: '网络状态不佳.上传失败'
          })
          return;
        }
        wx.showToast({
          title: '上传成功'
        })
      }
    })
  }
})