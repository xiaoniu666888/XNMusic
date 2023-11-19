import { xnRequest } from './index'
export function getSongDetail(ids){
  return xnRequest.get({
    url: '/song/detail',
    data:{
      ids
    }
  })
}
export function getSongLyric(id){
  return xnRequest.get({
    url: "/lyric",
    data:{
      id
    }
  })
}