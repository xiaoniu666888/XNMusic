// app.js
App({
  globalData:{
    screenWidth: 375,
    screenHeight: 667,
    // 状态栏高度
    statusHeight: 20,
    // 歌词页内容高度
    contentHeight: 500
  },
   onLaunch(){
    // 获取设备信息
    wx.getSystemInfo({
      success:( res => {
        this.globalData.screenWidth = res.screenWidth
        this.globalData.screenHeight = res.screenHeight
        this.globalData.statusHeight = res.statusBarHeight
        this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44
      })
    })

  }
})
