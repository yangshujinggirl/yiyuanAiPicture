// pages/historyDraw/historyDraw.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activityKey:1,
        tabList:[
            {
                title:"等待中",
                id:1,
            },{
                title:"已生成",
                id:2,
            },
        ],
        createdList:[1,2,3],
        waitedList:[1,2,3],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },
    switchTab(e) {
        const data = e.currentTarget.dataset
        this.setData({
            activityKey: data.tabid
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})