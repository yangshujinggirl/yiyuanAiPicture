// pages/recharge/recharge.ts
const app = getApp<IAppOption>();
import {request} from '../../utils/http';


Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[],
        userInfo:app.globalData.userInfo
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.fetchList()
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
    fetchList(){
        request({
            url:"/imgai/zeus/rechargeconf/",
            data:{},
            method:"GET",
        }).then((res)=> {
            if(res?.code ===200) {
                this.setData({list:res.data})
            }
        })
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