const countBase = 3;
import {request, domain} from '../../utils/http';
import { fetchTemplate } from '../../api/commonApi';
enum GenerateType {
    "p2p" =1,
    "t2p"=2
}
Component({
    behaviors: [],
    properties: {
      pageType: { // 属性名
        type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
        value: 'p2p', // 属性初始值（可选），如果未指定则会根据类型选择一个
        observer: function (newVal, oldVal) { 
            // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
            this.handleReset()
            console.log("observer",newVal)
        } 
      },
    },
    data: {
      imgUrl:"",
      checked:"",
      styleList:[],
      tmpValue:0,
    //   redrawList:[
    //       {label:"像本人",value:1},
    //       {label:"创造性",value:2}
    //     ],
    //   redraw_type:1,
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
      prompt:"",
      path:"",
      frameSizeList:[
          {
              iconUrl:"../../assets/scale_1.png",
              value:"头像",
              size:"1:1",
              key:'1'
          },{
            iconUrl:"../../assets/scale_2.png",
            value:"手机屏幕",
            size:"1:2",
            key:"2"
        },{
            iconUrl:"../../assets/scale_3.png",
            value:"文章配图",
            size:"4:3",
            key:"3",
        },{
            iconUrl:"../../assets/scale_4.png",
            value:"社交媒体",
            size:"3:4",
            key:"4",
        },{
            iconUrl:"../../assets/scale_5.png",
            value:"电脑壁纸",
            size:"16:19",
            key:"5",
        },{
            iconUrl:"../../assets/scale_6.png",
            value:"宣传海报",
            size:"9:16",
            key:"6",
        },
      ],
      frameSizeActivity:'1',
    }, // 私有数据，可用于模版渲染
  
    lifetimes: {
      // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
      attached: function () { 
      },
      moved: function () { 
      },
      detached: function () { 
      },
    
    },
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { 
        
    }, // 此处attached的声明会被lifetimes字段中的声明覆盖
    ready: function() { 
    },
    pageLifetimes: {
      // 组件所在页面的生命周期函数
      show: function () { 
        this.handleReset()
        this.fetchTemplate()
      },
        hide: function(){
            this.handleReset()
        }
    },
  
    methods: {
        handleReset(){
            this.setData({
                imgUrl:"",
                checked:"",
                activityCount:1,
                prompt:"",
                path:"",
                frameSizeActivity:"1"
            })
        },
        switchChange:function(e){
            this.setData({checked:e.detail.value})
        },
        switchGenerate:function(e){
            const data = e.currentTarget.dataset
            this.setData({tmpValue:data.id})
        },
        switchRedraw:function(e){
            const data = e.currentTarget.dataset
            this.setData({redraw_type:data.id})
        },
        switchCount:function(e){
            const data = e.currentTarget.dataset
            this.setData({activityCount:data.id})
        },
        switchFrameSize:function(e){
            const data = e.currentTarget.dataset
            this.setData({frameSizeActivity:data.id})
        },
        submit(){
            // const params:{[x:string]:any} = {};
            wx.showLoading({
                title:"loading"
            })
            const {
                activityCount,
                tmpValue,
                path,
                prompt,
                checked,
                frameSizeActivity
            } = this.data;
            const { pageType } =this.properties;
            request({
                url:"/imgai/zeus/order/",
                data:{
                    source_img:pageType === 't2p'?null:path,
                    count:activityCount,
                    prompt,
                    temp:tmpValue,
                    generate_type:GenerateType[pageType],
                    status:checked?4:0,
                    ratio:frameSizeActivity
                },
            }).then((res)=>{
                if(res?.code ===200) {
                    wx.navigateTo({
                        url: '/pages/historyDraw/historyDraw?type=0',
                    })
                }
            }).catch((err)=> {
                console.log(err)
            }).finally(()=>{
                wx.hideLoading();
            })
        },
        uoloadFile:function(e) {
            const _this = this;
            wx.chooseMedia({
            success (res) {
                const tempFilePaths = res.tempFiles;
                const file = tempFilePaths[0];
                if(file.size > ( 1024 * 1024 )* 20 ) {
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
                    _this.setData({
                        imgUrl:data?.data?.data?.url,
                        path:data?.data?.data?.path
                    })
                },
                fail(error){
                    console.log(error)
                }
                })
            }
            })
        },
        fetchTemplate(){
            const that = this;
          fetchTemplate().then((res)=>{
              if(res?.code ===200) {
                  that.setData({
                      styleList:[...res.data.data],
                      tmpValue:res.data.data[0].tmpValue
                    })
              }
          }).catch((err)=> {
              console.log(err)
          })
        },
    }
  
  })