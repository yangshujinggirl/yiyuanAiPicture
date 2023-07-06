// pages/toPicture/toPicture.ts
const countBase = 3;
import {request, domain} from '../../utils/http';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        inputValue:"",
        imgUrl:"",
        checked:"",
        styleList:[
            {
                bgUrl:"../../assets/bg.png",
                name:"动漫",
                id:0
            },{
                bgUrl:"../../assets/bg.png",
                name:"国风",
                id:1
            },{
                bgUrl:"../../assets/bg.png",
                name:"真人",
                id:2
            },
        ],
        generate_type:0,
        redrawList:[{label:"像本人",value:1},{label:"创造性",value:2}],
        redraw_type:1,
        countList:[
            {
                count:1,
                points:countBase,
            },{
                count:9,
                points:9 * countBase,
            },{
                count:30,
                points:30 * countBase,
            },
        ],
        activityCount:1,
        prompt:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(props) {
        console.log('props',props)
    },
    bindKeyInput: function (e) {
        this.setData({
          inputValue: e.detail.value
        })
    },
    switchChange:function(e){
        this.setData({checked:e.detail.value})
    },
    switchGenerate:function(e){
        const data = e.currentTarget.dataset
        this.setData({generate_type:data.id})
    },
    switchRedraw:function(e){
        const data = e.currentTarget.dataset
        this.setData({redraw_type:data.id})
    },
    switchCount:function(e){
        const data = e.currentTarget.dataset
        this.setData({activityCount:data.id})
    },
    submit(){
        // const params:{[x:string]:any} = {};
        const {
            activityCount,
            redraw_type,
            generate_type,
            imgUrl,
            prompt,
            checked
        } = this.data;
        request({
            url:"/imgai/zeus/order/",
            data:{
                redraw_type,generate_type,source_img:imgUrl,count:activityCount,
                sd_data:{prompt},
                status:checked?4:null
            },
        }).then((res)=>{
            if(res?.code ===200) {
                wx.navigateTo({
                    url: '/pages/historyDraw/historyDraw?type=0',
                })
            }
        }).catch((err)=> {
            console.log(err)
        })
    },
    uoloadFile:function(e) {
        const _this = this;
        wx.chooseMedia({
          success (res) {
            const tempFilePaths = res.tempFiles;
            const file = tempFilePaths[0];
            if(file.size > ( 1024 * 1024 )* 5 ) {
              wx.showToast({
                title: '请上传5M以内文件',
              })
              return;
            }
            wx.uploadFile({
              url: `${domain}/imgai/zeus/upload/`, //仅为示例，非真实的接口地址
              filePath: tempFilePaths[0].tempFilePath,
              name: 'filename',
              header:{
                'token': wx.getStorageSync('token')
              },
              success (res){
                let data = res.data;
                data = JSON.parse(data);
                console.log("data",data)
                _this.setData({imgUrl:data?.data?.data?.url})
              },
              fail(error){
                console.log(error)
              }
            })
          }
        })
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
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1
            })
        }
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