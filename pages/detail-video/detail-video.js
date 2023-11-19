// pages/detail-video/detail-video.js
import { getMVUrl, getMVInfo, getMVRelated } from "../../services/video"
Page({
  data:{
    id: 0,
    mvUrl:'',
    danmuList:
    [
      {
      text: '第 1s 出现的弹幕',
      color: 'white',
      time: 1
    }, 
    {
      text: '第 3s 出现的弹幕',
      color: 'white',
      time: 3
    }
  ],
  imgUrl:['https://api.r10086.com/%E5%9B%BE%E5%8C%85/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80/%E5%A6%B2%E5%B7%B1/1.jpg',
  'https://api.r10086.com/%E5%9B%BE%E5%8C%85/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80/%E5%A6%B2%E5%B7%B1/2.jpg',
  'https://api.r10086.com/%E5%9B%BE%E5%8C%85/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80/%E5%A6%B2%E5%B7%B1/3.jpg'
],
    mvInfo:{},
    relatedVideo:[]
  },
 onLoad(options){
    const { id } = options
    this.setData({ id })
    this.fetchMVUrl(id)
    this.fetchMVInfo(id)
    this.fetchMVRelated(id)
  },
  async fetchMVUrl(id){
    const { data } = await getMVUrl(id)
    this.setData({mvUrl : data.url})
  },
  async fetchMVInfo(id){
    const { data } = await getMVInfo(id)
    this.setData({mvInfo: data})
  },
  async fetchMVRelated(id){
    const res = await getMVRelated(id)
    // this.setData({mvInfo: data})
    // data中没有数据
    // console.log(res);
  }
})
