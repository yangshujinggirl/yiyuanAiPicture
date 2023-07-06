// pages/account/account.ts
const app = getApp<IAppOption>();
import {request} from '../../utils/http';
import { fetchFormatUserInfo } from '../../api/commonApi';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userInfo:app.globalData.userInfo,
      defaultAvatar:"../../assets/account_icon1.png",
      list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
      this.setData({
        userInfo:app.globalData.userInfo
      })
      this.fetchList();
      this.getUserInfo()
    },
       // 事件处理函数
    bindToSet() {
        wx.navigateTo({
            url: '/pages/settingCenter/settingCenter',
        })
    },
      // 事件处理函数
    bindDrawTap() {
        wx.navigateTo({
            url: '/pages/historyDraw/historyDraw',
        })
    },
    handleMyCreat(e) {
        const data = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/historyDraw/historyDraw?tempVal=${data.tempval}&tempName=${data.tempname}`,
        })
    },
    fetchList(){
        const that = this;
        request({
            url:"/imgai/zeus/temporderlist/",
            method:"GET",
            data:{}
        }).then((res)=> {
            console.log('res',res)
            if(res.code === 200) {
                that.setData({
                    list:res.data?.data||[]
                })
            }
        })
        
    },
    getUserInfo(){
        const that = this;
        fetchFormatUserInfo((res)=>{
            that.setData({
                userInfo:res
            })
        });
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
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 3
            })
        }
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