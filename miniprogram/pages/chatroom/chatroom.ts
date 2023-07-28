// pages/chatroom/chatroom.ts
import { request } from '../../utils/http';
import { fetchFormatUserInfo } from '../../api/commonApi';

const app = getApp<IAppOption>();
let intervalWS = "" //断线重连定时器
let socket = null
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
        isLodaing: false,
        userInfo: {},
        scrollTo: '',
        endId: '',
        isBtnLodaing: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({ options: options })
        this.getList()
        this.webSocketInit()
    },
    //滚动条至最底部
    autoScroll() {
        let view_id = 'view_id_' + parseInt(Math.random() * 1000000)
        this.setData({
            scrollTo: ''
        })
        this.setData({
            endId: view_id
        })
        this.setData({
            scrollTo: view_id
        })
    },
    copyText(e) {
        var content = e.target.dataset.info
        wx.setClipboardData({
            data: content,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        console.log(res.data) // 输出复制的内容
                    }
                })
            },
        });
    },
    copyTextInput(e){
        var content = e.target.dataset.info
        this.setData({
            inputValue:content
        })
    },
    getList() {
        var that = this;
        request({
            url: "/imgai/chatapi/message/history",
            data: {temp:that.data.options.id},
            method: "GET"
        }).then((res:any) => {
            if (res?.code === 200) {
                let messages = []
                if (res.data.list != '') {
                    res.data.list.forEach(item => {
                        if (item.key_word) {
                            messages.push({
                                id: item.temp_id,
                                content: item.key_word,
                                isUser: true
                            });
                        }
                        if (item.result_message) {
                            messages.push({
                                id: item.temp_id,
                                content: item.result_message,
                                isUser: false
                            });
                        }
                    });
                }

                that.setData({
                    messages: messages
                })
                this.autoScroll()

            }
        }).catch((err) => {
            console.log(err)
        })
    },
    webSocketInit() {
        var that = this
        let socketUrl = `wss://www.imageandai.com/msg/?token=${wx.getStorageSync('token')}`
        // 建立 WebSocket 连接
        socket = wx.connectSocket({
            url: socketUrl,
            header: {
                'content-type': 'application/json',
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
        socket.onMessage((res:any) => {
            let msg = res.data
            if (typeof msg === "string" && msg.startsWith("{")) {
                msg = JSON.parse(msg)
            }
            if (msg.code == 200) {
                if (msg.type == 'ChatApi' || msg.type == 'ChatApiEnd') {
                    if (msg.temp_id == that.data.options.id) {
                        console.log(msg);
                        const messages = that.data.messages;
                        info += msg.message
                        if (msg.type == 'ChatApiEnd') {
                            that.setData({
                                isLodaing: false
                            })
                            messages.push({
                                id: msg.temp_id,
                                content: info,
                                isUser: false
                            });
                            that.setData({
                                messages: messages,
                                isBtnLodaing: false
                            })
                            info = ''
                            that.autoScroll()
                        }
                    }
                }
            }else if(msg.code == 42001){
                const messages = that.data.messages;
                messages.push({
                    id: msg.temp_id,
                    content: '您的余额不足，请充值再使用...',
                    isUser: false
                });
                that.setData({
                    messages: messages,
                    isBtnLodaing: false
                })
            }else {
                const messages = that.data.messages;
                messages.push({
                    id: msg.temp_id,
                    content: msg.code + msg.message,
                    isUser: false
                });
                that.setData({
                    messages: messages,
                    isBtnLodaing: false
                })
            }
        })
        if (!intervalWS) {
            that.ping()
        }
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
        if (intervalWS) clearInterval(intervalWS)
    },
    // 发送消息
    send(socket, msg) {
        let that = this
        socket.send({
            data: typeof msg === "object" ? JSON.stringify(msg) : msg,
            success(res) {
                const messages = that.data.messages;
                messages.push({
                    id: that.options.id,
                    content: msg.keyword,
                    isUser: true
                });
                that.setData({
                    messages: messages
                })
                setTimeout(() => {
                    that.setData({
                        isLodaing: true
                    })
                }, 100)
                that.autoScroll()
                console.log('WebSocket 消息发送成功', res)
            },
            fail(err) {
                console.log('WebSocket 消息发送失败', err)
            }
        })
    },

    // 心跳，由客户端发起
    ping() {
        let times = 0
        var that = this
        // 每 10 秒钟由客户端发送一次心跳
        intervalWS = setInterval(function () {
            if (socket.readyState == 3) {
                times += 1
                // 超时重连，最多尝试 10 次
                console.log("重连次数", times)
                if (times >= 10) {
                    wx.showToast({
                        title: 'WebSocket 连接已断开~',
                        icon: 'none',
                        duration: 2000
                    })
                    clearInterval(intervalWS)
                } else {
                    webSocketInit()
                }
            }
        }, 10000)
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
        if (!this.data.isBtnLodaing) {
            this.setData({
                isBtnLodaing: true
            })
            this.send(this.data.socket, msg)
            this.setData({
                inputValue: ''
            })
        } else {
            wx.showToast({
                title: '不能操作太频繁了噢～',
                icon: "none"
            });
        }

    },
    getUserInfo() {
        const that = this;
        fetchFormatUserInfo((res) => {
            that.setData({
                userInfo: res
            })
        });
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
        this.getUserInfo()
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