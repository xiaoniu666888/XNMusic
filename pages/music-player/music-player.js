// pages/music-player/music-player.js
import 
  throttle
 from '../../utils/throttle'
import playerStore, { audioContext } from '../../store/playerStore'

const app = getApp()
const modeNames = ["circulate","repeatOnce","shuffle"]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: ["歌曲", "歌词"],
    id: 0,
    stateKeys: ["id","currentSong","durationTime","currentTime","lyricInfos","currentLyricText","currentLyricIndex","isPlaying","playModeIndex"],
    currentSong: {},
    lyricInfos: [],
    contentHeight: 0,
    statusHeight:0,
    currentPage: 0,
    currentTime: 0,
    durationTime: 0,
    // 进度条
    sliderValue: 0,
    isSliderChanging: false,
    isWaiting: false,
    isPlaying: true,
    // 当前歌词
    currentLyricText: "",
    currentLyricIndex: 0,
    isBlock: true,
    lyricScrollTop: 0,
    playSongList: [],
    playSongIndex: 0,
    isFirstPlay: true,
    playModeName:"circulate"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      statusHeight: app.globalData.statusHeight,
      contentHeight: app.globalData.contentHeight
    })
    // 1. 获取传入id
    const id = options.id
    // 2. 根据id播放歌曲
    if(id) {
      playerStore.dispatch("playMusicWithSongIdAction",id)
    }
    // 3. 获取store共享数据
    playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    playerStore.onStates(this.data.stateKeys ,this.getPlayerInfosHandler)
  },
  // 更新进度条
  updateProgress: throttle(function(currentTime) {
    // if(!this.data.isSliderChanging) return;
    // 1. 记录当前时间   2. 修改sliderValue
    const sliderValue = currentTime / this.data.durationTime * 100
    this.setData({ currentTime, sliderValue })
  }, 100, { leading: false, trailing: false }),
  //=================== 事件监听 ==========================
  // 点击左上角导航返回
  onNavBackTap() {
    wx.navigateBack()
  },
  // 切换歌曲/歌词页
  onSwiperChange(event) {
    this.setData({
      currentPage: event.detail.current
    })
  },
  // 切换歌曲/歌词页
  onNavTabTap(event) {
    const index = event.currentTarget.dataset.index
    this.setData({
      currentPage: index
    })
  },
  // 点击滑块
  onSliderChange: throttle(function(event) {
    // 1. 获取点击滑块对应的值
    this.data.isWaiting = true
    setTimeout(() => {
      this.data.isWaiting = false
    }, 1000)
    this.setData({ isPlaying: true })
    const {  value  } = event.detail
    // 2. 计算出要播放的时间位置
    const currentTime = value / 100 * this.data.durationTime
    // 3. 设置播放器，播放计算出的时间
    audioContext.seek(currentTime)
    this.setData({ currentTime,  isSliderChanging: false, sliderValue: value
    })
    this.data.isSliderChanging = true
  },100),
  // 点击暂停/播放按钮
  onPalyOrPause() {
    playerStore.dispatch("changeMusicStatusAction")
  },
  // 点击上一首
  onPrevBtnTap() {
    playerStore.dispatch("playNewMusicAction",false)
  },
  // 点击下一首
  onNextBtnTap() {
    playerStore.dispatch("playNewMusicAction",true)
  },
  // 切换播放模式
  onModeBtnTap() {
   playerStore.dispatch("changePlayModeAction")
  },
  // ====================   store共享数据   =========================
  getPlaySongInfosHandler({
    playSongList,
    playSongIndex
  }) {
    if (playSongList) {
      this.setData({
        playSongList
      })
    }
    if (playSongIndex !== undefined) {
      this.setData({
        playSongIndex
      })
    }

  },
  getPlayerInfosHandler({ id, currentSong, durationTime, currentTime,lyricInfos, currentLyricText, currentLyricIndex, isPlaying, playModeIndex  }) {
    if(id !== undefined) {
      this.setData({ id })
    }
    if (currentSong) {
      this.setData({ currentSong })
    }
    if (durationTime !== undefined) {
      this.setData({ durationTime })
    }
    if (currentTime !== undefined) {
      // 根据当前时间改变进度
      this.updateProgress(currentTime)  
    }
    if (lyricInfos) {
      this.setData({ lyricInfos })
    }
    if (currentLyricText) {
      this.setData({ currentLyricText })
    }
    if (currentLyricIndex !== undefined) {
      // 修改lyricScrollTop
      this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35})
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying })
    }
    if (playModeIndex !== undefined) {
      this.setData({ playModeName: modeNames[playModeIndex] })
    }

  },
  onUnload() {
    playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler),
    playerStore.offStates(this.data.stateKeys,this.getPlayerInfosHandler)
  }
})