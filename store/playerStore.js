import { HYEventStore } from 'hy-event-store'
import {
  getSongDetail,
  getSongLyric
} from '../services/player'

import {  parseLyric } from '../utils/parse-lyric'
// 创建播放器
export const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    playSongList: [],
    playSongIndex: 0,
    id: 0,
    currentSong: {},
    lyricInfos: [],
    currentTime: 0,
    durationTime: 0,
    currentLyricText: "",
    currentLyricIndex: -1,
    isFirstPlay: true,
    isPlaying: false,
    playModeIndex: 0, // 0: 顺序播放 1: 单曲循环 2: 随机播放
  },
  actions: {
    // 播放歌曲
    playMusicWithSongIdAction(ctx, id) {
      // 0. 将原来的数据进行重置
      // 切换之前将之前的数据回到初始状态
      ctx.currentSong = {}
      ctx.sliderValue = 0
      ctx.currentTime = 0
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentLyricText = ""
      // 1. 保存id
      ctx.id = id
      ctx.isPlaying = true

      // 2. 请求歌曲相关数据
     // 2.1 根据id获取详情
     getSongDetail(id).then(res => {
      ctx.currentSong = res.songs[0]
      ctx.durationTime = res.songs[0].dt / 1000
     })
     // 2.2 根据id获取歌词信息
     getSongLyric(id).then(res => {
       const lyricString = res.lrc.lyric
       const lyricInfos = parseLyric(lyricString)
      ctx.lyricInfos = lyricInfos
     })
    //  3. 播放当前歌曲
     audioContext.stop()
     audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
     audioContext.autoplay = true
     // 4. 监听播放进度
     if (ctx.isFirstPlay) {
       ctx.isFirstPlay = false
       audioContext.onTimeUpdate(() => {
         // 1. 获取当前播放时间
         ctx.currentTime = audioContext.currentTime
         // 2. 匹配正确歌词
         if (!ctx.lyricInfos.length) return
         let index = ctx.lyricInfos.length - 1
         for (let i = 0; i < ctx.lyricInfos.length; i++) {
           const info = ctx.lyricInfos[i]
           if (info.time > audioContext.currentTime * 1000) {
             index = i - 1
             break
           }
         }
         if (index === ctx.currentLyricIndex || index === -1) return;
         // 3. 获取歌词的索引index和文本text
         const currentLyricText = ctx.lyricInfos[index].text
         // 4. 改变歌词滚动页面的位置
         ctx.currentLyricText = currentLyricText
         ctx.currentLyricIndex = index
       })
       audioContext.onWaiting(() => {
         audioContext.pause()
         ctx.isPlaying = false
       })
       audioContext.onCanplay(() => {
         audioContext.play()
         ctx.isPlaying = true
       })
       // 播放结束自动播放下一首歌曲
       audioContext.onEnded(()=>{
         // 如果是单曲循环，不需要其替换下一首歌曲
         if (audioContext.loop) return
         // 切换下一首歌
         this.dispatch("playNewMusicAction")
       })
     }
    },
    // 开始/暂停
    changeMusicStatusAction (ctx) {
      // 用audioContext.paused判断也可以
      if (ctx.isPlaying) {
        audioContext.pause()
        ctx.isPlaying = false
      } else {
        audioContext.play()
        ctx.isPlaying = true
      }
    },
    // 播放模式切换
    changePlayModeAction(ctx) {
        let modeIndex = ctx.playModeIndex
        modeIndex = modeIndex + 1
        if (modeIndex === 3) modeIndex = 0
        // 设置是否单曲循环
        if (modeIndex === 1) {
          audioContext.loop = true
        } else {
          audioContext.loop = false
        }
        ctx.playModeIndex = modeIndex
    },
    // 上一首/下一首歌曲
    playNewMusicAction(ctx, isNext = true) {
        // 1. 获取之前的数据
      const length = ctx.playSongList.length
      let index = ctx.playSongIndex
      // 2. 根据之前的数据计算最新的索引
      switch (ctx.playModeIndex) {
        case 1: // 单曲循环
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1
          // 2.1 判断越界
          if (index === length) index = 0
          if (index === -1) index = length - 1
          break;
        case 2: // 随机播放
          index = Math.floor(Math.random() * length)
          break;
      }
      // 3. 根据索引获取当前歌曲的信息
      const newSong = ctx.playSongList[index]
      // 开始播放新的歌曲
      this.dispatch("playMusicWithSongIdAction",newSong.id)
      // 4. 保存最新的索引值
      ctx.playSongIndex = index
      }
  }
})
export default playerStore