// pages/settingCenter/settingCenter.ts
import { fetchFormatUserInfo, updateUserInfo } from '../../api/commonApi';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        defaultAvatar:"../../assets/account_icon1.png",
        isHidden:true,
        nickname:'',
        isChange:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getUserInfo()
    },
    getUserInfo(){
        const that = this;
        fetchFormatUserInfo((res)=>{
            that.setData({
                userInfo:res,
                nickname:res.username
            })
        });
    },
    onChooseAvatar(e) {
        const { avatarUrl } = e.detail 
        this.updateInfoApi({avatar:avatarUrl})
    },
    changeName(){
        this.setData({isChange:true})
    },
    updateInfoApi(params:{[x:string]:any},fun?:Function){
        const that =this;
        updateUserInfo(params).then((res)=> {
            if(res.code === 200) {
                wx.showToast({
                    title:'修改成功',
                    icon:'success'
                })
                fun && typeof fun === 'function' && fun();
                that.getUserInfo()
            } else {
                wx.showToast({
                    title:res.msg,
                    icon:'error'
                })
            }
        })
    },
    onSaveName(){
        this.updateInfoApi({username:this.data.nickname},()=>{
            this.setData({ isChange:false })
        })
    },
    onCancel(){
        this.setData({ isChange:false })
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