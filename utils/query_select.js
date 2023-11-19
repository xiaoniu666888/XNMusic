export function  querySelect(select){
  return new Promise(resolve=>{
    // 获取Image组件高度
    const query = wx.createSelectorQuery()
    // 拿到组件矩形框
    query.select(select).boundingClientRect()
    // 执行
    query.exec((res)=>{
      resolve(res)
    })
  })
}