// index.ts
// 获取应用实例
import {request} from '../../utils/http';
import { compareVersion } from '../../utils/util';

Page({
  data: {
    password:"",
    phone:"",
    isUsePassword:false,
    isAgree:false,
    code:"",
    isCanUseRealTime:false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onLoad() {
    const isHighVersion = compareVersion('2.24.4');
    if(isHighVersion >= 0) {
        this.setData({isCanUseRealTime:true})
    } else {
        this.setData({isCanUseRealTime:false})
    }
  },
  //1.2.0
  getPhoneNumber (e) {
    this.handleWeinxinLogin(e.detail.code)
  },
  //2.24.4
  bindgetrealtimephonenumber (e) {
    this.handleWeinxinLogin(e.detail.code)
  },
  validateForm(){
    const { phone, code } =this.data;
    const regCode =/^\d{4}/;
    const regPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
    if(!regPhone.test(phone)) {
        wx.showToast({
            title:"输入正确的手机",
            icon:"error",
            duration:2000
        })
        return false;
    }else if(!regCode.test(code)) {
        wx.showToast({
            title:"输入4位验证码",
            icon:"error",
            duration:2000
        })
        return false
    } else {
        return true;
    }
  },
  handleWeinxinLogin (phone:number) {
    const that = this;
    wx.login({
        success (res) {
          if (res.code) {
            //发起网络请求
            that.fetchLogin({ wx: res.code, phone })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
    })
  },
  handlePhoneLogin(){
    const { phone, code } =this.data;
    if(!this.validateForm()) {
        return;
    }
    this.fetchLogin({phone, code})
  },
  togglePhoneLogin(){
    this.setData({ isUsePassword:!this.data.isUsePassword })
  },
  fetchLogin(params){
    request({
        url:"/imgai/zeus/register/",
        data:params,
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
    const that = this;
    if(!this.validateForm()) {
        return;
    }
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
  goRegister(){
    wx.redirectTo({
      url:'/pages/register/register'
    })
  },
})
