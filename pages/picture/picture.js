// pages/materials/materials.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //地址
    serverUrl: app.serverUrl,
    title:'',
    pictureUrl:'',
    imageUrl:'',
    page:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //拿到url路径传递的参数
    var that = this;
    that.setData({
      title: options.title,
      pictureUrl: options.pictureUrl.substring(options.pictureUrl.lastIndexOf("/zykt"),options.pictureUrl.length)
    })
  
    that.sendPicture(that.data.page,options.pictureUrl);
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
   * 拿到url路径
   */
  sendPicture(page,url){
    //获取数据
    var that = this;
    return app.sendData(that.data.serverUrl + '/material/getMaterialImg?page=' + page + '&url=' + url, "GET").then(res => {
      var picData = res.data;
      if (picData.code != 200) {
        wx.showToast({
          icon: 'none',
          title: '书籍数据返回失败',
        })
        return;
      }
      // 对图片地址进行修改
      var url =  that.data.serverUrl + that.data.pictureUrl;
      var arrUrl = [picData.data.length];
      for(var i=0 ;i<picData.data.length; i++){
        var index = picData.data[i].split(".")[0];
        arrUrl[index] = url + picData.data[i];
      }
      that.setData({
        imageUrl: arrUrl
      })
    })
  },
  /**
   * 图片预览
   */
  imgYu:function(e){
    var that=this;
    var src = e.currentTarget.dataset.src;//获取data-src
    var imageUrl = e.currentTarget.dataset.url;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imageUrl // 需要预览的图片http链接列表
    })
  }
})