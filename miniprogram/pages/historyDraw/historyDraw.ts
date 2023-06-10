// pages/historyDraw/historyDraw.ts
import {request} from '../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activityKey:"0",
        tabList:[
            {
                title:"全部",
                id:"99",
            },
            {
                title:"等待中",
                id:"0",
            },{
                title:"已生成",
                id:"2",
            },{
                title:"审核中",
                id:"4",
            },{
                title:"已发布",
                id:"5",
            },
        ],
        list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(e) {
        this.setData({ activityKey:e.type || "99"})
        this.fetchList()
    },
    switchTab(e) {
        const data = e.currentTarget.dataset
        this.setData({
            activityKey: data.tabid
        })
        this.fetchList()
    },
    fetchList(){
        const {activityKey} = this.data;
        const params:{[x:string]:any} = {
            order_type:activityKey==="99"?"":activityKey
        };

        request({
            url:"/imgai/zeus/orderownerlist/",
            data:params,
            method:"GET",
        }).then((res)=>{
            if(res?.code ===200) {
                this.setData({ list:res.data?.list })
            }
        }).catch((err)=> {
            console.log(err)
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