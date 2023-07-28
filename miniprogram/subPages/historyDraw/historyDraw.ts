// pages/historyDraw/historyDraw.ts
import {request} from '../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultImg:"../../assets/account_bg.png",
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
        list:[],
        tempVal:"",
        currentPage:1,
        totalPage:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(e) {
        if(e.tempVal) {
            wx.setNavigationBarTitle({
                title: `${e.tempName}绘图`
              })
            this.setData({tempVal:e.tempVal,tempName:e.tempName})
        }
        this.setData({ activityKey:e.type || "99"})
        this.fetchList()
    },
     /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
    },
    switchTab(e) {
        const data = e.currentTarget.dataset
        this.setData({
            activityKey: data.tabid,
            list:[],
        })
        this.fetchList()
    },
    fetchList(pageNum?:number){
        wx.showLoading({
            title: '加载中',
        })
        const {activityKey,tempVal} = this.data;
        const currentPage  = pageNum || this.data.currentPage; 
        const params:{[x:string]:any} = {
            order_type:activityKey==="99"?"":activityKey,
            tempVal,
            page_number:currentPage
        };

        request({
            url:"/imgai/zeus/orderownerlist/",
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
    onPullDownRefresh(){
        this.onRefresh();
    },
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

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