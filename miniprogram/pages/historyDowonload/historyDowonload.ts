// pages/historyDowonload/historyDowonload.ts
import {request} from '../../utils/http';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[],
        currentPage:1,
        totalPage:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        
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
        this.setData({list:[]})
        this.fetchList()
    },
    fetchList(pageNum?:number){
        wx.showLoading({
            title: '加载中',
        })
        const currentPage  = pageNum || this.data.currentPage; 
        const params:{[x:string]:any} = {
            page_number:currentPage
        };
        request({
            url:"/imgai/zeus/history/order",
            data:params,
            method:"GET",
        }).then((res)=>{
            if(res?.code ===200) {
                const newArr = res.data?.list.map((el)=>({...el, currentPage:res.data.page_number}))
                this.setData({ 
                    list:[...this.data.list,...newArr],
                    currentPage:res.data.page_number,
                    totalPage:Math.ceil(res.data.total/res.data.page_size)
               })
            }
            wx.hideLoading();
            wx.stopPullDownRefresh();
        }).catch((err)=> {
            console.log(err)
        })
    },
    onRefresh(){
        this.setData({list:[]})
        this.fetchList(1)
    },
     /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh(){
        this.onRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom(){
        let { currentPage, totalPage } =this.data;
        currentPage++;
        if( currentPage > totalPage) {
            wx.showToast({
                type:"none",
                title:"没有更多数据了哦～"
            })
            return;
        }
        this.fetchList(currentPage)
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
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})