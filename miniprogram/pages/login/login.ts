// index.ts
// 获取应用实例
import {request} from '../../utils/http';

Page({
  data: {
    password:"",
    account:"",
    isUsePassword:false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onLoad() {
    // @ts-ignore
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getPhoneNumber (e) {
    console.log(e.detail)
  },
  getUsePassword(){
    this.setData({ isUsePassword:true })
  },
  bindKeyPhone: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  bindKeyPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  handleLogin(){
    const { account, password } =this.data
    request({
      url:"/imgai/zeus/login/",
      data:{ account, password },
    }).then((res)=>{
      if(res?.code ===200) {
        const globalData = getApp().globalData;
        globalData.token = res.data.token;
        globalData.userInfo = res.data.userinfo;
        wx.setStorageSync('token', res.data.token)
          wx.switchTab({
            url:'/pages/index/index'
          })
      }
    }).catch((err)=> {
        console.log(err)
    })
  },
  goRegister(){
    wx.redirectTo({
      url:'/pages/register/register'
    })
  },
  handleAutoPhone(){
    this.setData({ isUsePassword:false })
  }
})
