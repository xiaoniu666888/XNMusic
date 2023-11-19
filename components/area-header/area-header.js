// components/area-header/area-header.js
Component({
  properties:{
    title:{
      type: String,
      value: "默认标题"
    },
    // 控制“更多”是否显示
    hasMore: {
      type: Boolean,
      value: true
    }
  },
  methods:{
    onMoreTap(){
      this.triggerEvent("moreclick")
    }
  }
})
