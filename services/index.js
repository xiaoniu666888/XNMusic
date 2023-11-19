/**
 * 封装成类
 */
class XNRequest {
  constructor(baseURL) {
    this.baseURL = baseURL
  }
  request(options) {
    const {
      url
    } = options
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url: this.baseURL + url,
        success: (res) => {
          resolve(res.data)
        },
        fail: reject
      })
    })
  }
  get(options) {
    return this.request({
      ...options,
      method: "get"
    })
  }
  post(options) {
    return this.request({
      ...options,
      method: "post"
    })
  }
}
export const xnRequest = new XNRequest("http://codercba.com:9002")
// https://api.r10086.com/
// https://coderwhy-music.vercal.app/
// http://codercba.com:9002

