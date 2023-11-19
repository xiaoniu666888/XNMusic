// pages/main-music/main-music.js
import {
  getMusicBanner,
  getSongMenuList
} from '../../services/music'
import recommendStore from "../../store/recommendScore"
import {
  querySelect
} from '../../utils/query_select'
import throttle from '../../utils/throttle'
import rankingStore from '../../store/rankingStore'
import playerStore from '../../store/playerStore'

// 从 underscore 库中调用节流, 用的时候出现报错, 先注释掉
// import { throttle } from 'underscore'
const querySelecTthrottle = throttle(querySelect)
const app = getApp()
Page({
  data: {
    searchValue: '',
    banners: [],
    bannerHeight: 0,
    // 屏幕宽度
    screenWidth: 375,
    recommendSongs: [],
    // 热门歌单数据
    hotMenuList: [],
    recMenuList: [],
    // 巅峰榜数据
    rankingInfos: {},
    isRankingData: false,
    // 当前正在播放的歌曲
    currentSong: {},
    isPlaying: false

  },
  onLoad() {
    this.fetchMusicBanner()
    this.fetchSongMenuList()
    recommendStore.onState("recommendSongInfo", this.handleRecommendSong)
    recommendStore.dispatch("fetchRecommendSongsActions")
    rankingStore.onState("newRanking", this.getRankingHandler("newRanking"))
    rankingStore.onState("originRanking", this.getRankingHandler("originRanking"))
    rankingStore.onState("upRanking", this.getRankingHandler("upRanking"))
    rankingStore.dispatch("fetchRankingDataAction")
    playerStore.onStates(["currentSong","isPlaying"],this.handlePlayInfos)

    // 获取屏幕尺寸
    this.setData({
      screenWidth: app.globalData.screenWidth
    })
  },

  // 界面的事件监听方法
  onSearchCilck() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search'
    })
  },
  // 获取轮播图
  async fetchMusicBanner() {
    const {
      banners
    } = await getMusicBanner()

    this.setData({
      banners
    })
  },
  // 获取歌曲
  // async fetchRecommendSongs() {
  //   const res = await getPlaylistDetail(3778678)
  //   const playlist = res.playlist
  //   const recommendSongs = playlist.tracks.slice(0, 6)
  //   this.setData({
  //     recommendSongs
  //   })
  // },

  // 获取热门歌单
  async fetchSongMenuList() {
    // const res = await getSongMenuList()
    // this.setData({ hotMenuList: res.playlists})

    // 若这个地方还用await 会阻塞下边请求的进行
    getSongMenuList().then(res => {
      this.setData({
        hotMenuList: res.playlists
      })
    })
    getSongMenuList('华语').then(res => {
      this.setData({
        recMenuList: res.playlists
      })
    })
  },
  // 监听图片属性
  async onBannerImageLoad() {
    const res = await querySelecTthrottle(".banner-image")
    this.setData({
      bannerHeight: res[0].height
    })
  },
  // 点击更多跳转
  onRecommendMoreClick() {
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=recommend',
    })
  },
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList",this.data.recommendSongs)
    playerStore.setState("playSongIndex", index)
  },

  onPlayOrPauseBtnTap() {
    playerStore.dispatch("changeMusicStatusAction")
  },
  onPlayBarAlbumTap() {
    wx.navigateTo({
      url: '/pages/music-player/music-player',
    })
  },
  //====================== 从store中获取数据 ==================================
  handleRecommendSong(value) {
       
    if(!value.tracks) return
    this.setData({
      recommendSongs: value.tracks.slice(0, 6)
    })
  },
  

  // 封装函数
  getRankingHandler(ranking) {
    return value => {
      const newRankingInfos = {
        ...this.data.rankingInfos,
        [ranking]: value,
      }
      this.setData({
        rankingInfos: newRankingInfos,
      })
      this.setData({
        isRankingData: true
      })
    }
  },
  handlePlayInfos({ currentSong,isPlaying }) {
    if(currentSong) {
      this.setData({ currentSong })
    }
    if(isPlaying !== undefined) {
      this.setData({ isPlaying })
    }
  },
  onUnload() {
    recommendStore.offState("recommendSongs", this.handleRecommendSong)
    // rankingStore.offState("newRanking", this.handleNewRanking)
    // rankingStore.offState("originRanking", this.handleOriginRanking)
    // rankingStore.offState("upRanking", this.handleUpRanking)
    playerStore.offState(["currentSong","isPlaying"],this.handlePlayInfos)
  }
})