// 获取应用实例
const app = getApp<IAppOption>();
import {request} from '../../utils/http';
import { fetchTemplate } from '../../api/commonApi';
import { ResponseType } from './type';
Page({
  data: {
    motto: 'Hello World',
    activityKey:'1',
    fixedList:[
        {
            tmpName:"精选",
            tmpValue:'1',
        },{
            tmpName:"推荐",
            tmpValue:'2',
        }
    ],
    tabList:[],
    dataList:[],
    currentPage:1,
    totalPage:0,
    defaultImg:"../../assets/loading.webp"
  },

  onLoad() {

  },
  onUnload: function() {
  },
  onShow(){
    this.resetData();
    this.fetchList();
    this.fetchTemplateList();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
    }
  },
  resetData(){
    this.setData({
        dataList:[],
        tabList:[]
    })

  },
    // 事件处理函数
  bindInfoTap(e) {
      const { activityKey } =this.data;
      const data = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/pictureInfo/pictureInfo?currentImgId=${data.id}&tempValue=${activityKey}&currentPage=${data.currentpage}`,
        })
  },
  fetchList(pageNum?:number){
    wx.showLoading({
        title: '加载中',
    })
    const currentPage  =pageNum || this.data.currentPage
    let params:{[x:string]:any} = { page_number: currentPage };
    const {activityKey} = this.data;
    switch(activityKey){
        case '1':
            params.level__gte = 1;
            break;
        case '2':
            params = { page_number: currentPage };
            break;
        default:
            params.temp_value = activityKey;
            break;
    }
    request<ResponseType>({
        url:"/imgai/zeus/orderlist/",
        data:params,
        method:"GET",
    }).then((res)=>{
        if(res?.code ===200) {
            const newList = res?.data?.list.map((el)=>({...el,currentPage:res.data.page_number}));
            this.setData({ 
                dataList:[...this.data.dataList,...newList],
                currentPage:res.data.page_number as number,
                totalPage:Math.ceil(res.data.total/res.data.page_size)
             })
            wx.stopPullDownRefresh();
        }
    }).catch((err)=> {
        console.log(err)
    }).finally(()=>{
        wx.hideLoading()
    })
  },
  switchTab(e) {
    const data = e.currentTarget.dataset
    this.setData({
        activityKey: data.tabid,
        currentPage:1,
        dataList:[]
    })
    this.fetchList()
  },
  fetchTemplateList(){
    const that = this;
    fetchTemplate().then((res)=>{
        if(res?.code ===200) {
            that.setData({tabList:[...that.data.fixedList,...res.data.data]})
        }
    }).catch((err)=> {
        console.log(err)
    })
  },
  onRefresh(){
    this.setData({dataList:[]})
    this.fetchList(1)
  },
  onPullDownRefresh(){
      this.onRefresh();
  },
  onReachBottom(){
    let { currentPage, totalPage } =this.data;
    currentPage++;
    if( currentPage > totalPage) {
        wx.showToast({
            type:"none",
            title:"没有更多数据了哦～"
        })
        return;
    }
    this.fetchList(currentPage)
  }
})
