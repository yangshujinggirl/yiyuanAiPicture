Component({
    data: {
      selected: 0,
      color: "#7A7E83",
      selectedColor: "#3cc51f",
      list: [{
        pagePath: "/pages/index/index",
        iconPath: "../assets/icon_tabbar0.png",
        selectedIconPath: "../assets/icon_tabbar00.png",
        text: "首页"
      }, {
        pagePath: "/pages/toPicture/toPicture",
        iconPath: "../assets/icon_tabbar1.png",
        selectedIconPath: "../assets/icon_tabbar11.png",
        text: "图转图"
      },{
        pagePath: "/pages/textToPicture/textToPicture",
        iconPath: "../assets/icon_tabbar2.png",
        selectedIconPath: "../assets/icon_tabbar22.png",
        text: "文字转图"
      },{
        pagePath: "/pages/account/account",
        iconPath: "../assets/icon_tabbar3.png",
        selectedIconPath: "../assets/icon_tabbar33.png",
        text: "我的"
      }]
    },
    attached() {
    },
    methods: {
      switchTab(e) {
        const data = e.currentTarget.dataset
        const url = data.path
        wx.switchTab({url})
        this.setData({
          selected: data.index
        })
      }
    }
  })