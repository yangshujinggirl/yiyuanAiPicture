// pages/register/register.ts
import {request, domain} from '../../utils/http';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        password: '',
        confirmPassword: '',
        code:"",
        isAgree:false,
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

    },
    formSubmit(e) {
        this.setData({chosen:e.detail.value})
        this.submit();
    },
    formReset(e) {
        this.setData({
            chosen: ''
        })
    },
    submit(){
        const { phone,password,confirmPassword,code } = this.data;
        request({
            url:"/imgai/zeus/register",
            data:{phone,password,confirmPassword,code},
            method:"POST"
        }).then((res)=>{
            if(res?.code ===200) {
                const globalData = getApp().globalData;
                globalData.token = res.data.token;
                globalData.userInfo = res.data;
                wx.setStorageSync('token', res.data.token)
                wx.switchTab({
                    url:'/pages/index/index'
                })
            }
        }).catch((err)=> {
            console.log(err)
        })
    },
    getImgCode(){
        const { phone } =this.data;
        const that=this;
        request({
            url:"/imgai/zeus/sms/",
            data:{phone},
            method:"GET"
        }).then((res)=>{
            if(res?.code ===200) {
                that.setData({code:res.data.code})
            }
        }).catch((err)=> {
            console.log(err)
        })
    },
    switchPages(){
        wx.navigateTo({
            url:"/pages/protocol/protocol"
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