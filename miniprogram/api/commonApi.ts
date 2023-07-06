import { request } from '../utils/http';
export function fetchTemplate(){
  return request({
      url:"/imgai/zeus/temp",
      data:{},
      method:"GET"
  })
}

export function fetchUserInfo(){
    return request({
        url:"/imgai/zeus/userinfo/",
        data:{},
        method:"GET"
    })
}
export function fetchFormatUserInfo(fun:Function){
    return request({
        url:"/imgai/zeus/userinfo/",
        data:{},
        method:"GET"
    }).then((res)=> {
        if(res.code === 200) {
            console.log('res',res)
            const globalData = getApp().globalData;
            globalData.userInfo = res.data?.data;
            fun && typeof fun === 'function' && fun(res.data)
        }
    })
}
export function updateUserInfo(data){
    return request({
        url:"/imgai/zeus/user/update/",
        data,
        method:"POST"
    })
}