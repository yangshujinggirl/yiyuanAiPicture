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
        currentIndex:0,
        currentPage:0,
        visible:false,
        currentPicSd:{},
        infoKeyList
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(e) {
        const {currentImgId,tempValue,currentPage} = e;
        this.setData({
            currentImgId,
            tempValue,
            currentPage
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
                const list = res?.data?.list || [];
                const currentIndex  = list.findIndex((el)=>el.id == values.currentImgId); 
                this.setData({ list,currentIndex })
            }
        }).catch((err)=> {
            console.log(err)
        })
    },
    submitLike(e){
        const data =e.currentTarget.dataset;
        request({
            url:"/imgai/zeus/like/",
            data:{order:data.orderid}
        }).then((res)=> {
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