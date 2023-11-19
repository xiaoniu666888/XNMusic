// pages/detail-song/detail-song.js
import   recommendStore from "../../store/recommendScore"
import rankingStore from '../../store/rankingStore'
import { getPlaylistDetail } from '../../services/music'
import playerStore from "../../store/playerStore"
Page({
  data:{
    songInfo: {},
    type: "ranking",
    key: "newRanking",
    id: ""
  },
  onLoad(options){
    // 1. 确定获取数据的类型
    // type: ranking -> 榜单数据
    // type: recommend -> 推荐数据
    // type: 点击其他歌单
    const type = options.type
    // this.data.type = type
    this.setData({ type })
    // 获取store中榜单数据
    if(type === "ranking"){
      const key = options.key
      this.data.key = key
      rankingStore.onState(key,this.hanldleRanking)
    }else if(type === "recommend"){
        recommendStore.onState("recommendSongInfo", this.hanldleRanking)
    }else if (type === "menu") {
      const id = options.id
      this.data.id = id 
      this.fetchMenuSongInfo()
      
    }
  },
  async fetchMenuSongInfo(){
    const res = await getPlaylistDetail(this.data.id)
    this.setData({ songInfo: res.playlist })
  },
   // ================== wxml事件监听 =============

   onSongItemTap() {
      playerStore.setState("playSongList",this.data.songInfo.tracks)
   },
  // ================== sotre共享数据 =============
  hanldleRanking(value){
    // if(this.data.type === "recommend"){
    //   value.name = "推荐歌曲"
    // }
  this.setData({ songInfo: value })
  // 设置顶部标题栏
  wx.setNavigationBarTitle({
    title: value.name || "XNMusic" ,
  })
  },
  onUnload(){
    if(this.data.type === "ranking"){
    rankingStore.offState(this.data.key, this.hanldleRanking)
  }else if(this.data.type === "recommend"){
    recommendStore.offState("recommendSongInfo", this.hanldleRanking)
  }
  }

})