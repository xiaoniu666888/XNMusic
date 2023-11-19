// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from '../../services/music'
Page({
  data: {
    songMenus: []
  },
  onLoad() {
    this.fetchAllMenuList()
  },
  // 发送网络请求
  async fetchAllMenuList() {
    const { tags } = await getSongMenuTag()
    // 根据tags去获取相应歌单
    const allPromise = []
    for (const tag of tags) {
       const promise = getSongMenuList(tag.name)
       allPromise.push(promise)
    }

    // 获取到所有数据之后，调用一次setData
    Promise.all(allPromise).then(res=>{
      this.setData({ songMenus: res })
    })
  }
})