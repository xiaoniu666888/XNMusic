import {
  xnRequest
} from "./index"
// 获取mv详情
export function getTopMV(offset = 0, limit = 20) {
 return xnRequest.get({
   url:"/top/mv",
   data:{
     offset,
     limit
   }
 })
}
// 获取视频
export function getMVUrl(id) {
  return xnRequest.get({
    url:"/mv/url",
    data:{
      id
    }
  })
 }
// 获取mv数据
 export function getMVInfo(mvid) {
  return xnRequest.get({
    url:"/mv/detail",
    data:{
      mvid
    }
  })
 }
 // 获取mv关联数据
 export function getMVRelated(id) {
  return xnRequest.get({
    url:"/related/allvideo",
    data:{
      id
    }
  })
 }