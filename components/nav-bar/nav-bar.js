// components/nav-bar/nav-bar.js
const app = getApp()
Component({
    options:{
      multipleSlots: true
    },
  /**
   * 组件的属性列表
   */
  properties: {

    title:{
      type: String,
      value: "导航标题"
    }
  },
  data:{
    statusHeight:20
  },
  lifetimes(){
    this.setData({ statusHeight: app.globalData.statusHeight })
  },
  methods: {
    onLeftClick() {
      this.triggerEvent("leftclick")
    }
  }


})
