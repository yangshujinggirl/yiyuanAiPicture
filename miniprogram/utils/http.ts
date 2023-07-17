const domain = "https://www.imageandai.com"; //统一接口域名，测试环境
interface IParamsProps {
    url:string;
    data:{[x:string]:any};
    login?:boolean;
    method?:"POST" | "OPTIONS" | "GET" | "HEAD" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined;
    responseType?:string;
}
interface ResonseType<T> {
    code:number;
    data:T;
    msg:string
}
//统一的网络请求方法
function request<T>(params:IParamsProps):Promise<ResonseType<T>> {
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
                wx.navigateTo({
                    url:"/pages/login/login"
                })
            } else if(res.statusCode == 400){
                wx.showToast({
                    title: res.data.msg,
                    icon: "none"
                });
                reject(res.data)
            }else {
                wx.showToast({
                    title: "糟糕～服务器出了点小差",
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
export {
    request,
    domain
}
// exports.getToken = getToken;
// exports.request = request;
// exports.checkLogin = checkLogin;