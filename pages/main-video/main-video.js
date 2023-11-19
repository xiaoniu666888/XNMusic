// pages/xn-video/xn-video.js
import {
  getTopMV
} from '../../services/video'
Page({
  data: {
    videoList: [],
    // 请求数据偏移量
    offset: 0,
    hasMore: true
  },
  onLoad() {
    this.fetchTopMV()
  },
  // 发送请求
  async fetchTopMV() {
    // 获取数据
    const res = await getTopMV(this.data.offset)
    // 追加新数据
    const newVideoList = [...this.data.videoList, ...res.data] 
    // 赋值
    this.setData({ videoList: newVideoList })
    // 改变时页面不需要刷新,不需要用this.setData()
    this.data.offset = this.data.videoList.length
    this.data.hasMore = res.hasMore
  },
  // 监听上拉和下拉
  onReachBottom() {
    // 判断是否有更多的数据
    if(!this.data.hasMore) return
    // 如果有更多的数据，再请求新的数据
    this.fetchTopMV()
  },
 async onPullDownRefresh(){
    // 清空之前的数据
    this.setData({ videoList: [] })
    this.data.offset = 0
    this.data.hasMore = true
    // 重新请求数据
   await this.fetchTopMV()
    // 停止下拉刷新
    wx.stopPullDownRefresh()
  },
  // 点击跳转
  // onVideoItemTap(event){
  //   // 第一种跳转方法
  //   // const item = event.currentTarget.dataset.item
  //   // wx.navigateTo({
  //   //   url: `/pages/detail-video/detail-video?id=${item.id}`,
  //   // })
  // }
})