// pages/chatroom/chatroom.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        options: {},
        inputValue: '',
        socket: null,
        messages: [],
        intervalWS: null,
        isLodaing:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({ options: options })
        this.webSocketInit()
    },
    webSocketInit() {
        var that = this
        let socket = null
        let socketUrl = `wss://www.imageandai.com/msg/?token=${wx.getStorageSync('token')}`
        // 建立 WebSocket 连接
        socket = wx.connectSocket({
            url: socketUrl,
            header: {
                'content-type': 'application/json',
                'authorization': 'testaaa',
                'x-wxapp-sockettype': 'ordertips',
            },
            success(res) {
                console.log('WebSocket 连接成功: ', res)
            },
            fail(err) {
                console.log('WebSocket 连接失败: ', err)
            }
        })
        // onOpen
        socket.onOpen(() => {
            console.log('打开 WebSocket 连接')
        })
        // onError
        socket.onError((err) => {
            console.log('WebSocket 连接失败：', err)
        })
        // onClose
        socket.onClose((ret) => {
            console.log('断开 WebSocket 连接', ret)
        })
        //监听接收到的消息
        let info = ''
        socket.onMessage((res) => {
            let msg = res.data
            if (typeof msg === "string" && msg.startsWith("{")) {
                msg = JSON.parse(msg)
            }
            if (msg.code == 200) {
                if (msg.type == 'ChatApi'||msg.type == 'ChatApiEnd') {
                    if (msg.temp_id == that.data.options.id) {
                        console.log(msg);
                        const messages = that.data.messages;
                        info += msg.message
                        if (msg.type == 'ChatApiEnd') {
                            that.setData({
                                isLodaing:false
                            })
                            messages.push({
                                id:msg.temp_id,
                                content: info,
                                isUser: false
                            });
                            that.setData({
                                messages: messages
                            })
                        }
                    }
                }
            }else{
                const messages = that.data.messages;
                messages.push({
                    id:msg.temp_id,
                    content: '服务端出错了！请稍后再试...',
                    isUser: false
                });
                that.setData({
                    messages: messages
                })
            }
        })
        that.setData({
            socket: socket
        })
    },
    //关闭socket连接
    closeSocket(socket) {
        socket.close({
            reason: "主动关闭",
            complete: res => {
                console.log("关闭socket连接", res)
            }
        })
        // if (this.data.intervalWS) clearInterval(this.data.intervalWS)
    },
    // 发送消息
    send(socket, msg) {
        let that = this
        socket.send({
            data: typeof msg === "object" ? JSON.stringify(msg) : msg,
            success(res) {
                const messages = that.data.messages;
                messages.push({
                    id:that.options.id,
                    content: msg.keyword,
                    isUser: true
                });
                that.setData({
                    messages: messages
                })
                setTimeout(()=>{
                    that.setData({
                        isLodaing:true
                    })
                },100)
                console.log('WebSocket 消息发送成功', res)
            },
            fail(err) {
                console.log('WebSocket 消息发送失败', err)
            }
        })
    },

    // 心跳，由客户端发起
    ping() {

    },
    sandFun() {
        if (this.data.inputValue == '') {
            wx.showToast({
                title: '内容不能为空',
                icon: "none"
            });
            return
        }
        let msg = {
            id: this.data.options.id,
            keyword: this.data.inputValue,
            operate_type: "chat"
        }
        this.send(this.data.socket, msg)
        this.setData({
            inputValue: ''
        })
    },
    watch() {
        var that = this
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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        
        this.closeSocket(this.data.socket)
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