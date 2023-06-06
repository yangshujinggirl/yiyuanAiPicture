// index.ts
// 获取应用实例
const app = getApp<IAppOption>();
import {request} from '../../utils/http';

Page({
  data: {
    motto: 'Hello World',
    activityKey:1,
    tabList:[
        {
            title:"精选",
            id:1,
        },{
            title:"推荐",
            id:2,
        },{
            title:"动漫",
            id:3,
        },{
            title:"真人",
            id:4,
        },{
            title:"古风",
            id:5,
        },{
            title:"其他",
            id:6,
        }
    ],
    list:[
        {
            result_img:"../../assets/bg.png",
            download_total:100,
            like_total:30,
            title:"ui01"
        }, {
            result_img:"../../assets/bg.png",
            download_total:400,
            like_total:130,
            title:"ui02"
        }, {
            result_img:"../../assets/bg.png",
            download_total:1200,
            like_total:303,
            title:"ui03"
        }, {
            result_img:"../../assets/bg.png",
            download_total:2200,
            like_total:320,
            title:"ui04"
        },
    ]
  },
  // 事件处理函数
  bindInfoTap() {
    wx.navigateTo({
      url: '/pages/pictureInfo/pictureInfo',
    })
  },
  onLoad() {
    this.fetchList();
  },
  fetchList(){
    const params:{[x:string]:any} = {};
    const {activityKey} = this.data;
    switch(activityKey){
        case 1:
            params.level__gte = 1;
            break;
        case 3:
        case 4:
        case 5:
            params.generate_type = activityKey;
            break;
    }
    request({
        url:"/imgai/zeus/orderlist/",
        data:params,
        method:"POST",
    }).then((res)=>{
        console.log("res",res)
    }).catch((err)=> {
        console.log(err)
    })
  },
  switchTab(e) {
    const data = e.currentTarget.dataset
    this.setData({
        activityKey: data.tabid
    })
    this.fetchList()
  }
})
