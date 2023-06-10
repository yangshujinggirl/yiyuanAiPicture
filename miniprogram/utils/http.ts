const domain = "https://www.imageandai.com"; //统一接口域名，测试环境
interface IParamsProps {
    url:string;
    data:{[x:string]:any};
    login?:boolean;
    method?:"POST" | "OPTIONS" | "GET" | "HEAD" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined;
    responseType?:string;
}
//统一的网络请求方法
function request(params:IParamsProps) {
  // 全局变量
//   var globalData = getApp().globalData;
  return new Promise((resolve,reject)=> {
    wx.request({
        url: domain + params.url, //接口请求地址
        data: params.data,
        header: {
            'token': wx.getStorageSync('token')
        },
        method: params.method == undefined ? "POST" : params.method,
        dataType: 'json',
        responseType: params.responseType == undefined ? 'text' : params.responseType,
        success: function(res) {
            if (res.statusCode == 200) {
                resolve(res.data);
            } else if(res.statusCode == 403){
                getToken();
            } else if (res.statusCode == 500) {
                wx.showToast({
                    title: "服务器出了点小差",
                    icon: "none"
                });
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
var getToken = function() {
  const globalData = getApp().globalData;
  globalData.userInfo = {};
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      request({
        login: true,
        method: "POST",
        url: '/imgai/zeus/login',
        data: {
          code: res.code
        }
      }).then((res: { data:{ token:string; userinfo:{[x:string]:any} }})=> {
        globalData.token = res.data.token;
        globalData.userInfo = res.data.userinfo;
        wx.setStorageSync('token', res.data.token)
      })
    }
  })
}
export {
    request,
    domain
}
// exports.getToken = getToken;
// exports.request = request;
// exports.checkLogin = checkLogin;