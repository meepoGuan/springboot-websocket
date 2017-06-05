module RongWebIMWidget.conversation {
    var UploadImageDomain = "http://7xogjk.com1.z0.glb.clouddn.com/"

    interface ConversationScope extends ng.IScope {

        emojiList: any
        showSelf: boolean
        showemoji: boolean
        _inputPanelState: number
        messageList: any[]

        conversation: {
            title: string
            targetType: number
            targetId: string
            messageContent: string
        }

        evaluate: {
            type: number
            showSelf: boolean
            valid: boolean
            onConfirm: Function
            onCancle: Function
        }

        scrollBar(): void
        minimize(): void
        getHistory(): void
        getMoreMessage(): void
        switchPerson(): void
        send(): void
        close(): void
        minimize(): void
    }

    class ConversationController {
        static $inject: string[] = ["$scope",
            "ConversationServer",
            "WebIMWidget",
            "ConversationListServer",
            "WidgetConfig",
            "ProviderData",
            "RongIMSDKServer"]
        busy: boolean
        constructor(private $scope: ConversationScope,
            private conversationServer: RongWebIMWidget.conversation.IConversationService,
            private WebIMWidget: RongWebIMWidget.WebIMWidget,
            private conversationListServer: any,
            private widgetConfig: RongWebIMWidget.WidgetConfig,
            private providerdata: RongWebIMWidget.ProviderData,
            private RongIMSDKServer: RongWebIMWidget.RongIMSDKServer) {

            var _this = this;
            _this.busy = false;

            conversationServer.changeConversation = function(obj) {
                _this.changeConversation(obj);
            }
            conversationServer.handleMessage = function(msg) {
                _this.handleMessage(msg);
            }

            conversationServer._handleConnectSuccess = function() {
                updateUploadToken();
            }
            function updateUploadToken() {
                RongIMSDKServer.getFileToken().then(function(token) {
                    conversationServer._uploadToken = token;
                    if (Helper.browser.msie && Helper.browser.version == "9.0") {
                        uploadFileUserFlash();
                    }else{
                        uploadFileRefresh();    
                    }
                })
            }

            $scope.evaluate = <any>{
                type: 1,
                showevaluate: false,
                valid: false,
                onConfirm: function(data) {
                    //发评价
                    if (data) {
                        if ($scope.evaluate.type == RongWebIMWidget.EnumCustomerStatus.person) {
                            RongIMSDKServer.evaluateHumanCustomService(conversationServer.current.targetId, data.stars, data.describe).then(function() {

                            }, function() {

                            });
                        } else {
                            RongIMSDKServer.evaluateRebotCustomService(conversationServer.current.targetId, data.value, data.describe).then(function() {

                            }, function() {

                            });
                        }
                    }
                    _this.conversationServer._customService.connected = false;
                    RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                        onSuccess: function() {

                        },
                        onError: function() {

                        }
                    });
                    _this.busy = false;
                    _this.closeState();
                },
                onCancle: function() {
                    $scope.evaluate.showSelf = false;
                }
            };


            $scope._inputPanelState = RongWebIMWidget.EnumInputPanelType.person;
            $scope.$watch("showemoji", function(newVal, oldVal) {
                if (newVal === oldVal)
                    return;
                if (!$scope.emojiList || $scope.emojiList.length == 0) {
                    $scope.emojiList = RongIMLib.RongIMEmoji.emojis.slice(0, 70);
                }
            });
            document.addEventListener("click", function(e: any) {
                if ($scope.showemoji && e.target.className.indexOf("iconfont-smile") == -1) {
                    $scope.$apply(function() {
                        $scope.showemoji = false;
                    });
                }
            });
            $scope.$watch("showSelf", function(newVal: string, oldVal: string) {
                if (newVal === oldVal)
                    return;
                if (newVal && conversationServer._uploadToken) {
                    uploadFileRefresh();
                } else {
                    qiniuuploader && qiniuuploader.destroy();
                }
            })
            $scope.$watch("_inputPanelState", function(newVal: any, oldVal: any) {
                if (newVal === oldVal)
                    return;
                if (newVal == RongWebIMWidget.EnumInputPanelType.person && conversationServer._uploadToken) {
                    uploadFileRefresh();
                } else {
                    qiniuuploader && qiniuuploader.destroy();
                }
            })
            $scope.$watch("conversation.messageContent", function(newVal: string, oldVal: string) {
                if (newVal === oldVal)
                    return;
                if ($scope.conversation) {
                    RongIMLib.RongIMClient.getInstance().saveTextMessageDraft(+$scope.conversation.targetType, $scope.conversation.targetId, newVal)
                }
            });

            $scope.getHistory = function() {
                var key = $scope.conversation.targetType + "_" + $scope.conversation.targetId;
                var arr = conversationServer._cacheHistory[key];
                arr.splice(0, arr.length);
                conversationServer._getHistoryMessages(+$scope.conversation.targetType, $scope.conversation.targetId, 20).then(function(data) {
                    
                    conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.TimePanel(conversationServer._cacheHistory[key][0].sentTime));
                    if (data.has) {
                        conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.GetMoreMessagePanel());
                    }
                });
            }

            $scope.getMoreMessage = function() {
                var key = $scope.conversation.targetType + "_" + $scope.conversation.targetId;
                conversationServer._cacheHistory[key].shift();
                conversationServer._cacheHistory[key].shift();

                conversationServer._getHistoryMessages(+$scope.conversation.targetType, $scope.conversation.targetId, 20).then(function(data) {
                    conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.TimePanel(conversationServer._cacheHistory[key][0].sentTime));
                    if (data.has) {
                        conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.GetMoreMessagePanel());
                    }
                });
            }

            $scope.switchPerson = function() {
                RongIMLib.RongIMClient.getInstance().switchToHumanMode(conversationServer.current.targetId, {
                    onSuccess: function() {

                    },
                    onError: function() {

                    }
                })
            }

            $scope.send = function() {
                if (!$scope.conversation.targetId || !$scope.conversation.targetType) {
                    alert("请先选择一个会话目标。")
                    return;
                }
                if ($scope.conversation.messageContent == "") {
                    return;
                }

                var con = RongIMLib.RongIMEmoji.symbolToEmoji($scope.conversation.messageContent);

                var msg = RongIMLib.TextMessage.obtain(con);
                var userinfo = new RongIMLib.UserInfo(providerdata.currentUserInfo.userId, providerdata.currentUserInfo.name, providerdata.currentUserInfo.portraitUri);

                msg.user = userinfo;

                try {
                    RongIMLib.RongIMClient.getInstance().sendMessage(+$scope.conversation.targetType, $scope.conversation.targetId, msg, {
                        onSuccess: function(retMessage: RongIMLib.Message) {

                            conversationListServer.updateConversations().then(function() {

                            });
                        },
                        onError: function(error) {

                        }
                    });

                } catch (e) {

                }


                var content = _this.packDisplaySendMessage(msg, RongWebIMWidget.MessageType.TextMessage);

                var cmsg = RongWebIMWidget.Message.convert(content);
                conversationServer._addHistoryMessages(cmsg);

                $scope.scrollBar();
                $scope.conversation.messageContent = ""
                var obj = document.getElementById("inputMsg");
                RongWebIMWidget.Helper.getFocus(obj);
            }

            function sendImageMessage(content,imageUrl){
                var im = RongIMLib.ImageMessage.obtain(content,imageUrl);

                var content:any = _this.packDisplaySendMessage(im, RongWebIMWidget.MessageType.ImageMessage);
                RongIMLib.RongIMClient.getInstance()
                    .sendMessage($scope.conversation.targetType,
                    $scope.conversation.targetId,
                    im,
                    {
                        onSuccess: function() {
                            conversationListServer.updateConversations().then(function() {

                            });
                        },
                        onError: function() {

                        }
                    })
                conversationServer._addHistoryMessages(RongWebIMWidget.Message.convert(content));
                $scope.$apply(function() {
                    $scope.scrollBar();
                });
            }

            

            function uploadFileUserFlash(){
                if (!widgetConfig.uploadFlashUrl) {
                    console.log('请在 init 时添加 flash 文件地址配置 uploadFlashUrl');
                }
                $('#upload-file').FileToDataURI({
                    moviePath: widgetConfig.uploadFlashUrl || '/rong_widget/images/FileToDataURI.swf',
                    // Choose to allow multiple files or now
                    multiple : true,
                    // Put th extensions allowed for the file picker
                    allowedExts: ['js','png','jpg','jpeg'],
                    // force flash - boolean to force flash
                    forceFlash : false,
                    token:conversationServer._uploadToken,
                    // Display the images in the page (callback function)
                    onSelect: function(files, response) {
                        
                        RongWebIMWidget.Helper.ImageHelper.getThumbnail(files[0].data, 60000, function(obj: any, data: any) {
                            
                            var basestr = files[0].data;
                            var reg = new RegExp('^data:image/[^;]+;base64,');
                            basestr = basestr.replace(reg, '');

                            RongIMLib.RongIMClient.getInstance().getFileUrl(RongIMLib.FileType.IMAGE,response.filename,'',{
                                        onSuccess: function(url) {
                                            sendImageMessage(data,url.downloadUrl);
                                        },
                                        onError: function() {

                                        }
                                    });
                        })
                    }
                })
            }

            

            function postImageBase(base64: string,callback: any){
                RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                    onSuccess: function (data) {
                        new RongIMLib.RongAjax({ token: data.token, base64: base64 }).send(function (ret) {
                            console.log(ret);
                            callback(ret);
                        });
                    },
                    onError: function (error) { }
                });
            }




            var qiniuuploader: any
            function uploadFileRefresh() {
                if (Helper.browser.msie && Helper.browser.version == "9.0")
                    return;

                qiniuuploader && qiniuuploader.destroy();
                qiniuuploader = Qiniu.uploader({
                    runtimes: 'html5,html4',
                    browse_button: 'upload-file',
                    container: 'funcPanel',
                    drop_element: 'inputMsg',
                    max_file_size: '100mb',
                    dragdrop: true,
                    chunk_size: '4mb',
                    unique_names: true,
                    uptoken: conversationServer._uploadToken,
                    domain: UploadImageDomain,
                    get_new_uptoken: false,
                    filters: {
                        mime_types: [{ title: "Image files", extensions: "jpg,gif,png,jpeg,bmp" }],
                        prevent_duplicates: false
                    },
                    multi_selection: false,
                    auto_start: true,
                    init: {
                        'FilesAdded': function(up: any, files: any) {
                        },
                        'BeforeUpload': function(up: any, file: any) {
                        },
                        'UploadProgress': function(up: any, file: any) {
                        },
                        'UploadComplete': function() {
                        },
                        'FileUploaded': function(up: any, file: any, info: any) {
                            if (!$scope.conversation.targetId || !$scope.conversation.targetType) {
                                alert("请先选择一个会话目标。")
                                return;
                            }
                            info = info.replace(/'/g, "\"");
                            info = JSON.parse(info);
                            RongIMLib.RongIMClient.getInstance()
                                .getFileUrl(RongIMLib.FileType.IMAGE,
                                file.target_name,'',
                                {
                                    onSuccess: function(url) {
                                        RongWebIMWidget.Helper.ImageHelper.getThumbnail(file.getNative(), 60000, function(obj: any, data: any) {
                                            
                                            sendImageMessage(data,url.downloadUrl);

                                        });

                                    },
                                    onError: function() {

                                    }
                                });
                        },
                        'Error': function(up: any, err: any, errTip: any) {
                            console.log(err);
                            updateUploadToken();
                        }
                    }
                });
            }

            $scope.close = function() {
                if (WebIMWidget.onCloseBefore && typeof WebIMWidget.onCloseBefore === "function") {
                    var isClose = WebIMWidget.onCloseBefore({
                        close: function(data) {
                            if (conversationServer.current.targetType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                                if ($scope.evaluate.valid) {
                                    _this.busy = true;
                                    $scope.evaluate.showSelf = true;
                                } else {
                                    RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                                        onSuccess: function() {

                                        },
                                        onError: function() {

                                        }
                                    });
                                    conversationServer._customService.connected = false;
                                    _this.closeState();
                                }
                            } else {
                                _this.closeState();
                            }
                        }
                    });
                } else {
                    if (conversationServer.current.targetType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                        if ($scope.evaluate.valid) {
                            _this.busy = true;
                            $scope.evaluate.showSelf = true;
                        } else {
                            RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                                onSuccess: function() {

                                },
                                onError: function() {

                                }
                            });
                            conversationServer._customService.connected = false;
                            _this.closeState();
                        }
                    } else {
                        _this.closeState();
                    }
                }
            }

            $scope.minimize = function() {
                WebIMWidget.display = false;
            }
        }

        closeState() {
            var _this = this;
            if (this.WebIMWidget.onClose && typeof this.WebIMWidget.onClose === "function") {
                setTimeout(function() { _this.WebIMWidget.onClose(_this.$scope.conversation) }, 1);
            }
            if (this.widgetConfig.displayConversationList) {
                this.$scope.showSelf = false;
            } else {
                this.WebIMWidget.display = false;
            }
            this.$scope.messageList = [];
            this.$scope.conversation = null;
            this.conversationServer.current = null;
            _this.$scope.evaluate.showSelf = false;
        }

        changeConversation(obj: RongWebIMWidget.Conversation) {
            var _this = this;
            if (_this.busy) {
                return;
            }

            if (_this.widgetConfig.displayConversationList) {
                _this.$scope.showSelf = true;
            } else {
                _this.$scope.showSelf = true;
                _this.WebIMWidget.display = true;
            }

            if (!obj || !obj.targetId) {
                _this.$scope.conversation = <any>{};
                _this.$scope.messageList = [];
                _this.conversationServer.current = null;
                setTimeout(function() {
                    _this.$scope.$apply();
                });
                return;
            }
            var key = obj.targetType + "_" + obj.targetId;
            var isCustomService = obj.targetType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE;
            if (isCustomService) {
                var curent = _this.conversationServer.getCacheCustomService(obj.targetType, obj.targetId);
                if (curent && curent.connected) {
                    _this.conversationServer._customService = curent;
                    _this.changeCustomerState(curent.inputPanelState);    
                } else {
                    _this.RongIMSDKServer.startCustomService(obj.targetId);
                }
            } else {
                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
            }

            _this.conversationServer.current = obj;
            _this.$scope.conversation = <any>obj;
            _this.$scope.conversation.messageContent = RongIMLib.RongIMClient.getInstance().getTextMessageDraft(obj.targetType, obj.targetId) || "";

            _this.$scope.messageList = _this.conversationServer._cacheHistory[key] = _this.conversationServer._cacheHistory[key] || []

            if (_this.$scope.messageList.length == 0 && _this.conversationServer.current.targetType !== RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                _this.conversationServer._getHistoryMessages(obj.targetType, obj.targetId, 3)
                    .then(function(data) {
                        if (_this.$scope.messageList.length > 0) {
                            _this.$scope.messageList.unshift(new RongWebIMWidget.TimePanl(_this.$scope.messageList[0].sentTime));
                            if (data.has) {
                                _this.$scope.messageList.unshift(new RongWebIMWidget.GetMoreMessagePanel());
                            }
                            setTimeout(function() {
                                _this.$scope.$apply();
                            })
                            _this.$scope.scrollBar();
                        }
                    })
                if(!_this.$scope.$$phase){
                 _this.$scope.$digest();
                }
            } else {
                setTimeout(function() {
                    _this.$scope.$apply();
                })
                _this.$scope.scrollBar();
            }

        }

        handleMessage(msg: RongWebIMWidget.Message) {
            var _this = this;
            if (_this.$scope.conversation
                && msg.targetId == _this.$scope.conversation.targetId
                && msg.conversationType == _this.$scope.conversation.targetType) {
                _this.$scope.$apply();
                var systemMsg = null;
                switch (msg.messageType) {
                    case RongWebIMWidget.MessageType.HandShakeResponseMessage://客服握手响应，保存附带客服信息（机器人需要自己提示欢迎语）

                        if (msg.content.data.serviceType == "1") {//仅机器人
                            _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                            msg.content.data.robotWelcome
                                && (systemMsg = this.packReceiveMessage(
                                    RongIMLib.TextMessage.obtain(msg.content.data.robotWelcome),
                                    RongWebIMWidget.MessageType.TextMessage));
                        } else if (msg.content.data.serviceType == "3") {
                            msg.content.data.robotWelcome
                                && (systemMsg = this.packReceiveMessage(
                                    RongIMLib.TextMessage.obtain(msg.content.data.robotWelcome),
                                    RongWebIMWidget.MessageType.TextMessage));
                            _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                        } else {
                            _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                        }
                        //会话一分钟评价有效，显示评价
                        _this.$scope.evaluate.valid = false;
                        _this.$scope.evaluate.showSelf = false;
                        setTimeout(function() {
                            _this.$scope.evaluate.valid = true;
                        }, 60 * 1000);
                        _this.providerdata._productInfo && _this.RongIMSDKServer.sendProductInfo(_this.conversationServer.current.targetId, _this.providerdata._productInfo);
                        break;
                    case RongWebIMWidget.MessageType.ChangeModeResponseMessage:
                        switch (msg.content.data.status) {
                            case 1:
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                break;
                            case 2:
                                if (_this.conversationServer._customService.type == "2") {
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                } else if (_this.conversationServer._customService.type == "1" || _this.conversationServer._customService.type == "3") {
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                                }
                                break;
                            case 3:
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                systemMsg = this.packReceiveMessage(RongIMLib.InformationNotificationMessage.obtain("你被拉黑了"),
                                    RongWebIMWidget.MessageType.InformationNotificationMessage);
                                break;
                            case 4:
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                systemMsg = _this.packReceiveMessage(RongIMLib.InformationNotificationMessage.obtain("已经是人工了"),
                                    RongWebIMWidget.MessageType.InformationNotificationMessage);
                                break;
                            default:
                                break;
                        }
                        break;
                    case RongWebIMWidget.MessageType.TerminateMessage:
                        //关闭客服
                        _this.conversationServer._customService.connected = false;
                        if (msg.content.code == 0) {
                            _this.$scope.evaluate.valid = true;
                            _this.$scope.close();
                        } else {
                            if (_this.conversationServer._customService.type == "1") {
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                            } else {
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                            }
                        }

                        break;
                    case RongWebIMWidget.MessageType.SuspendMessage:
                        if (msg.messageDirection == RongWebIMWidget.MessageDirection.SEND) {
                            _this.conversationServer._customService.connected = false;
                            _this.closeState();
                        }
                        break;
                    case RongWebIMWidget.MessageType.CustomerStatusUpdateMessage:
                        switch (Number(msg.content.serviceStatus)) {
                            case 1:
                                if (_this.conversationServer._customService.type == "1") {
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                } else {
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                                }
                                break;
                            case 2:
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                break;
                            case 3:
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.notService);
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }

                if (systemMsg) {
                    var wmsg = RongWebIMWidget.Message.convert(systemMsg);
                    _this.conversationServer.addCustomServiceInfo(wmsg);
                    _this.conversationServer._addHistoryMessages(wmsg);
                }

                _this.conversationServer.addCustomServiceInfo(msg);

                setTimeout(function() {
                    _this.$scope.$apply();
                    _this.$scope.scrollBar();
                }, 200);
            }

            if (msg.messageType === RongWebIMWidget.MessageType.ImageMessage) {
                setTimeout(function() {
                    _this.$scope.$apply();
                    _this.$scope.scrollBar();
                }, 800);
            }
        }

        changeCustomerState(type) {
            this.$scope._inputPanelState = type;
            if (type == RongWebIMWidget.EnumInputPanelType.person) {
                this.$scope.evaluate.type = RongWebIMWidget.EnumCustomerStatus.person;
                this.conversationServer._customService.currentType = RongWebIMWidget.EnumCustomerStatus.person;
            } else {
                this.$scope.evaluate.type = RongWebIMWidget.EnumCustomerStatus.robot;
                this.conversationServer._customService.currentType = RongWebIMWidget.EnumCustomerStatus.robot;
            }
        }

        packDisplaySendMessage(msg: any, messageType: string) {
            var ret = new RongIMLib.Message();
            var userinfo = new RongIMLib.UserInfo(this.providerdata.currentUserInfo.userId, this.providerdata.currentUserInfo.name || "我", this.providerdata.currentUserInfo.portraitUri);
            msg.user = userinfo;
            ret.content = msg;
            ret.conversationType = this.$scope.conversation.targetType;
            ret.targetId = this.$scope.conversation.targetId;
            ret.senderUserId = this.providerdata.currentUserInfo.userId;

            ret.messageDirection = RongIMLib.MessageDirection.SEND;
            ret.sentTime = (new Date()).getTime() - (RongIMLib.RongIMClient.getInstance().getDeltaTime() || 0);
            ret.messageType = messageType;

            return ret;
        }

        packReceiveMessage(msg: any, messageType: string) {
            var ret = new RongIMLib.Message();
            var userinfo = null;
            msg.userInfo = userinfo;
            ret.content = msg;
            ret.conversationType = this.$scope.conversation.targetType;
            ret.targetId = this.$scope.conversation.targetId;
            ret.senderUserId = this.$scope.conversation.targetId;

            ret.messageDirection = RongIMLib.MessageDirection.RECEIVE;
            ret.sentTime = (new Date()).getTime() - (RongIMLib.RongIMClient.getInstance().getDeltaTime() || 0);
            ret.messageType = messageType;

            return ret;
        }

    }


    angular.module("RongWebIMWidget.conversation")
        .controller("conversationController", ConversationController)
}
