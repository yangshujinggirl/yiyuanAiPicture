
const domain = "http://124.221.43.26:7006"; //统一接口域名，测试环境
interface IParamsProps {
    url:string;
    data:{[x:string]:any};
    login?:boolean;
    method?:"POST" | "OPTIONS" | "GET" | "HEAD" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined;
    responseType?:string;
}
//统一的网络请求方法
function request(params:IParamsProps, isGetTonken?:boolean) {
  // 全局变量
  var globalData = getApp().globalData;
  return new Promise((resolve,reject)=> {
    wx.request({
        url: domain + params.url, //接口请求地址
        data: params.data,
        header: {
        // 'content-type': params.method == "GET" ? 'application/x-www-form-urlencoded' : 'application/json;charset=utf-8',
        'Authorization': params.login ? undefined : wx.getStorageSync('token')
        },
        method: params.method == undefined ? "POST" : params.method,
        dataType: 'json',
        responseType: params.responseType == undefined ? 'text' : params.responseType,
        success: function(res) {
            if (res.statusCode == 200) {
                resolve(res.data);
            } else if (res.statusCode == 500) {
                wx.showToast({
                    title: "服务器出了点小差",
                    icon: "none"
                });
                reject(res.data)
            } else{
                reject(res.data)
            }
        },
        fail: function(err) {
            wx.hideLoading();
            wx.showToast({
                title: "服务器出了点小差",
                icon: "none"
            });
            reject(err)
        }
    })
  })

}

//通过code获取token,并保存到缓存
var getToken = function(callback) {
  const globalData = getApp().globalData;
  globalData.userInfo = {};
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      request({
        login: true,
        method: "POST",
        url: '/auth/login',
        data: {
          code: res.code
        },
        callBack: result => {
          // 没有获取到用户昵称，说明服务器没有保存用户的昵称，也就是用户授权的信息并没有传到服务器
          // if (!result.data.user.nickName) {
          //   updateUserInfo();
          // } 
          wx.setStorageSync('token', 'Bearer ' + result.data.user.token); //把token存入缓存，请求接口数据时要用
          globalData.isLanding = false;
          globalData.roleId = result.data.user.roleId;
          globalData.id = result.data.user.id;
          globalData.isNew = result.data.isNew;
          globalData.userInfo = {...result.data.user,isNew:result.data.isNew};
          callback && callback(globalData.userInfo);
          while (globalData.requestQueue.length) {
            request(globalData.requestQueue.pop());
          }
        }
      }, true)

    }
  })
}
const checkLogin=function(callback:Function){
  const globalData = getApp().globalData;
  if(globalData.userInfo.token && globalData.userInfo.id) {
    callback && callback(globalData.userInfo);
  } else {
    getToken(callback);
  }
}
export {
    request,getToken,checkLogin
}

// exports.getToken = getToken;
// exports.request = request;
// exports.checkLogin = checkLogin;