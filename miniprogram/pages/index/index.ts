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
        method:"GET",
    }).then((res)=>{
        console.log("res",res)
        if(res?.code ===200) {
            this.setData({ list:res.data?.results })
        }
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
  },
  onShow(){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
            selected: 0
            })
    }
  }
})
