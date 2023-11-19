import { xnRequest } from './index'

// 获取轮播图
export function getMusicBanner( type = 0 ){
  return xnRequest.get({
    url:'/banner',
    data:{
      type
    }
  })
}
// 获取歌曲列表
export function getPlaylistDetail( id ){
  return xnRequest.get({
    url:'/playlist/detail',
    data:{
      id
    }
  })
}

// 获取热门歌单列表
export function getSongMenuList( cat = "全部", limit = 6, offset = 0 ){
  return xnRequest.get({
    url:'/top/playList',
    data:{
      cat,
      limit,
      offset
    }
  })
}

// 获取热门歌单列表
export function getSongMenuTag(){
  return xnRequest.get({
    url:'/playlist/hot'
  })
}