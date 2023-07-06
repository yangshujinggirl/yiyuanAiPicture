// pages/authorization/authorization.js
import { updateUserInfo, updateUserInfoNewVersion } from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    nickname:'',
    defaultAvatarUrl:'../../assets/account_icon1.png',
    canIUseGetUserProfile: false,
    canIUseWrite:false
  },
  getUserProfile (e) {
    console.log('e',e)
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const { userInfo } =res;
        updateUserInfoNewVersion({
          nickname:userInfo.nickName,
          avatar:userInfo.avatarUrl
        },function(res){
            wx.navigateBack({
              delta: 1
            })
          })
      }
    })
  },
  getUserInfo(e) {
    console.log('e-getUserInfo',e)
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    updateUserInfo(function(res){
      wx.navigateBack({
        delta: 1
      })
    })
  },
  onChooseAvatar(e) {
    const that = this;
    const { avatarUrl } = e.detail;
    wx.uploadFile({
      url: 'https://api.qigebaobao.com/api/common/upload-image', //仅为示例，非真实的接口地址
      filePath: avatarUrl,
      name: 'file',
      header:{
        'Authorization': wx.getStorageSync('token')
      },
      formData: {
        'sourceType': 'member-idcard'
      },
      success (res){
        let data = res.data;
        data = JSON.parse(data);
           that.setData({
              avatar:data.data.imageUrl,
          })
      },
      fail(error){

      }
    })
 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const version = wx.getSystemInfoSync().SDKVersion;
    console.log('version',version,this.compareVersion(version, '2.24.4'))
    if (this.compareVersion(version, '2.24.4') >= 0) {
      this.setData({ canIUseWrite:true })
    } else {  
      this.setData({ canIUseWrite:false })
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  compareVersion:function(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)
  
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }
  
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
  
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
  
    return 0
  },
  onSave:function(){
    const { nickname, avatar } =this.data;
    if(!avatar) {
      wx.showToast({
        title: '请获取用户头像',
      })
      return;
    }
    if(!nickname) {
      wx.showToast({
        title: '请获取用户昵称',
      })
      return;
    }
    updateUserInfoNewVersion({
      nickname,
      avatar
    },()=>{
      wx.navigateBack({
        delta: 1
      })
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