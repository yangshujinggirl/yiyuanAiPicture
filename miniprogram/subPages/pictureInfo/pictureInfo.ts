// pages/pictureInfo/pictureInfo.ts
import {request} from '../../utils/http';
const infoKeyList =[
    {
        label:"发布标题",
        key:"title",
    },
    {
        label:"描述信息",
        key:"description",
    },
    {
        label:"风格名称",
        key:"generate_type",
    }, 
    {
        label:"生成方式",
        key:"generate_type",
    },
    {
        label:"模型名称",
        key:"model_name",
    },
   {
        label:"提示词",
        key:"prompt",
    },{
        label:"反向关键字",
        key:"negative_prompt",
    },{
        label:"随机参数",
        key:"seed",
    },{
        label:"提示权重",
        key:"cfg_scale",
    },{
        label:"重绘程度",
        key:"denoising_strength",
    }
]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[],
        prevIndex:0,
        currentIndex:0,
        currentPage:0,
        visible:false,
        currentPicSd:{},
        infoKeyList,
        tempValue:"",
        currentImgId:"",//当前的图片id
        total:0,
        totalPage:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(e) {
        const {currentImgId,tempValue,currentPage} = e;
        this.setData({
            currentImgId,
            tempValue,
            currentPage,
            list:[]
        })
        this.fetchList({ currentImgId, tempValue, currentPage })
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
    fetchList(values:{currentImgId:string|number;tempValue:string; currentPage:number; }){
        let params:{[x:string]:any} = {page_number:values.currentPage};
        switch(values.tempValue){
            case '1':
                params = {...params,level__gte:1};
                break;
            case '2':
                params = {...params};
                break;
            default:
                params = {...params,temp_value:values.tempValue};
                break;
        }
        request({
            url:"/imgai/zeus/orderlist/",
            data:params,
            method:"GET",
        }).then((res)=>{
            if(res?.code ===200) {
                const { list } =this.data;
                const newList = [...list,...res?.data?.list] || [];
                const currentIndex  = newList.findIndex((el)=>el.id == values.currentImgId);
                this.setData({ 
                    list:JSON.parse(JSON.stringify(newList)),
                    currentIndex,
                    total: res.data.total,
                    totalPage:Math.ceil(res.data.total/res.data.page_size)
                })
            }
        }).catch((err)=> {
            console.log(err)
        })
    },
    handleSwiper(e){
        const { list, currentPage, currentIndex, tempValue, totalPage  } =this.data;
        const { current, currentItemId } =e.detail;
        console.log('滑',e,`currentIndex-${this.data.currentIndex}`);
        if(Number(current) === currentIndex) {
            wx.showToast({
                title:'没有更多数据了哦～'
            })
            return;
        }
        //向左滑
        if(current < currentIndex) {
            if(current === 0 && currentPage!=1 && currentPage < totalPage) {
                const thsPageNum = Number(currentPage) - 1;
                this.setData({ currentPage: thsPageNum })
                this.fetchList({currentPage: thsPageNum, tempValue, currentImgId:currentItemId})
            }
        } else {
        //向右滑
            if(this.data.total === current ) {
                wx.showToast({
                    title:'没有更多数据了哦～'
                })
                return;
            }
            if(current === list.length -1 ) {
                const thsPageNum = Number(currentPage)+1;
                this.setData({ currentPage: thsPageNum })
                this.fetchList({currentPage: thsPageNum, tempValue, currentImgId:currentItemId})
            }
        }
        this.setData({ currentIndex: current,currentImgId:currentItemId })
    },
    submitLike(e){
        const data =e.currentTarget.dataset;
        const {currentImgId,tempValue,currentPage } =this.data;
        request({
            url:"/imgai/zeus/like/",
            data:{order:data.orderid}
        }).then((res)=> {
            this.fetchList({currentImgId,tempValue, currentPage});
            // wx.showToast({
            //     type:'success',
            //     title:""
            // })
        })
    },
    submitDownload(e){
        const data =e.currentTarget.dataset;
        const { order } =data;
        request({
            url:"/imgai/zeus/download/",
            data:{order:order.id}
        }).then((res)=> {
            wx.downloadFile({
                url: order.result_img, //仅为示例，并非真实的资源
                success (res) {
                    console.log('res',res)
                  // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                  if (res.statusCode === 200) {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success:function(res){
                            wx.showToast({
                                title:'照片下载成功'
                            })
                          wx.hideLoading()
                        }
                      })
                  }
                }
              })
        })
    },
    getInfo(e){
        const data =e.currentTarget.dataset;
        const { sd } =data;
        this.setData({ visible:true,currentPicSd:sd })
    },
    closeInfo(){
        this.setData({ visible:false, currentPicSd:{}})
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
        this.setData({list:[]})
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