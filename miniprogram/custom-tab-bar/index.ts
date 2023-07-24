const app = getApp<IAppOption>();

Component({
    data: {
      selected: 0,
      color: "#7A7E83",
      selectedColor: "#3cc51f",
      list: [{
        pagePath: "/pages/index/index",
        iconPath: "../assets/icon_tabbar0.png",
        selectedIconPath: "../assets/icon_tabbar00.png",
        text: "首页",
      }, {
        pagePath: "/pages/creation/creation",
        iconPath: "../assets/icon_tabbar1.png",
        selectedIconPath: "../assets/icon_tabbar11.png",
        text: "创作",
        isToken:true
      },{
        pagePath: "/pages/textToPicture/textToPicture",
        iconPath: "../assets/icon_tabbar2.png",
        selectedIconPath: "../assets/icon_tabbar22.png",
        text: "文字转图",
        isToken:true
      },{
        pagePath: "/pages/account/account",
        iconPath: "../assets/icon_tabbar3.png",
        selectedIconPath: "../assets/icon_tabbar33.png",
        text: "我的",
        isToken:true
      }]
    },
    attached() {
    },
    methods: {
      switchTab(e) {
        const tokens = wx.getStorageSync("token");
        const data = e.currentTarget.dataset;
        if(!tokens && data.tabitem.isToken) {
            wx.showModal({
                title: '您还未登录',
                content: '点击登录按钮，即可享受服务',
                success (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                        url:"/pages/login/login"
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
        } else {
            const url = data.path
            this.setData({
                selected: data.index
            })
            wx.switchTab({url})
        }
      }
    }
  })