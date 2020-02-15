const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //默认背景色、标题、字体颜色、分类id
    back: "linear-gradient(-225deg, #473B7B 0%, #3584A7 51%, #30D2BE 100%);",
    color: "#fff",
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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