// pages/creation/creation.ts
import { request } from '../../utils/http';
Page({
  data: {
    tabList: [{ id: 1, name: '全部' }],
    contentArray: [],
    barHeight: wx.getSystemInfoSync().statusBarHeight,
    viewW: 0,
    currentSwiper: 0,
  },
  onLoad: function () {
    let query = wx.createSelectorQuery();
    let that = this
    let tabList = that.data.tabList
    query = query.selectAll('.tab-item').boundingClientRect();
    query.exec(function (res) {
      let w = 0
      res[0].forEach((item, i) => {
        w += item.width
        tabList[i].left = item.left
        tabList[i].width = item.width
      });
      that.setData({
        viewW: w,
        tabList: tabList
      })
    });
    this.getList()
  },
  getList() {
    var that = this;
    request({
      url: "/imgai/chatapi/chatbot/temp",
      data: {},
      method: "GET"
    }).then((res) => {
      if (res?.code === 200) {
        that.setData({
          contentArray: res.data.data
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  likeClick() {

  },
  jumpDetail(e) {
    wx.navigateTo({
      url: '../chatroom/chatroom?id='+e.currentTarget.dataset.id+'&title='+e.currentTarget.dataset.title,
    })
  },
  onShow(){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
            selected: 1
        })
    }
  }
})