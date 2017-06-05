var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation) {
        angular.module("RongWebIMWidget.conversation", []);
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        angular.module("RongWebIMWidget.conversationlist", []);
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
/// <reference path="../typings/tsd.d.ts" />
var RongWebIMWidget;
(function (RongWebIMWidget) {
    angular.module("RongWebIMWidget", [
        "RongWebIMWidget.conversation",
        "RongWebIMWidget.conversationlist",
        "Evaluate"
    ]);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var userAgent = window.navigator.userAgent.toLowerCase();
    var Helper = (function () {
        function Helper() {
        }
        Helper.timeCompare = function (first, second) {
            var pre = first.toString();
            var cur = second.toString();
            return pre.substring(0, pre.lastIndexOf(":")) == cur.substring(0, cur.lastIndexOf(":"));
        };
        Helper.cloneObject = function (obj) {
            if (!obj)
                return null;
            var ret;
            if (Object.prototype.toString.call(obj) == "[object Array]") {
                ret = [];
                var i = obj.length;
                while (i--) {
                    ret[i] = Helper.cloneObject(obj[i]);
                }
                return ret;
            }
            else if (typeof obj === "object") {
                ret = {};
                for (var item in obj) {
                    ret[item] = obj[item];
                }
                return ret;
            }
            else {
                return obj;
            }
        };
        Helper.discernUrlEmailInStr = function (str) {
            var html;
            var EMailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/gi;
            var EMailArr = [];
            html = str.replace(EMailReg, function (str) {
                EMailArr.push(str);
                return '[email`' + (EMailArr.length - 1) + ']';
            });
            var URLReg = /(((ht|f)tp(s?))\:\/\/)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|cn|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk|me|im))(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*/gi;
            html = html.replace(URLReg, function (str, $1) {
                if ($1) {
                    return '<a target="_blank" href="' + str + '">' + str + '</a>';
                }
                else {
                    return '<a target="_blank" href="//' + str + '">' + str + '</a>';
                }
            });
            for (var i = 0, len = EMailArr.length; i < len; i++) {
                html = html.replace('[email`' + i + ']', '<a href="mailto:' + EMailArr[i] + '">' + EMailArr[i] + '<a>');
            }
            return html;
        };
        Helper.checkType = function (obj) {
            var type = Object.prototype.toString.call(obj);
            return type.substring(8, type.length - 1).toLowerCase();
        };
        Helper.browser = {
            version: (userAgent.match(/.+(?:rv|it|ra|chrome|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
            safari: /webkit/.test(userAgent),
            opera: /opera|opr/.test(userAgent),
            msie: /msie|trident/.test(userAgent) && !/opera/.test(userAgent),
            chrome: /chrome/.test(userAgent),
            mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit|like gecko)/.test(userAgent)
        };
        Helper.escapeSymbol = {
            encodeHtmlsymbol: function (str) {
                if (!str)
                    return '';
                str = str.replace(/&/g, '&amp;');
                str = str.replace(/</g, '&lt;');
                str = str.replace(/>/g, '&gt;');
                str = str.replace(/"/g, '&quot;');
                str = str.replace(/'/g, '&#039;');
                return str;
            },
            decodeHtmlsymbol: function (str) {
                if (!str)
                    return '';
                str = str.replace(/&amp;/g, '&');
                str = str.replace(/&lt;/g, '<');
                str = str.replace(/&gt;/g, '>');
                str = str.replace(/&quot;/g, '"');
                str = str.replace(/&#039;/g, '\'');
                return str;
            }
        };
        Helper.getFocus = function (obj) {
            obj.focus();
            if (obj.createTextRange) {
                var rtextRange = obj.createTextRange();
                rtextRange.moveStart('character', obj.value.length);
                rtextRange.collapse(true);
                rtextRange.select();
            }
            else if (obj.selectionStart) {
                obj.selectionStart = obj.value.length;
            }
            else if (window.getSelection && obj.lastChild) {
                var sel = window.getSelection();
                var tempRange = document.createRange();
                if (Helper.browser.msie) {
                    tempRange.setStart(obj.lastChild, obj.lastChild.length);
                }
                else {
                    tempRange.setStart(obj.firstChild, obj.firstChild.length);
                }
                sel.removeAllRanges();
                sel.addRange(tempRange);
            }
        };
        Helper.ImageHelper = {
            getThumbnail: function (obj, area, callback) {
                var canvas = document.createElement("canvas"), context = canvas.getContext('2d');
                var img = new Image();
                img.onload = function () {
                    var target_w;
                    var target_h;
                    var imgarea = img.width * img.height;
                    if (imgarea > area) {
                        var scale = Math.sqrt(imgarea / area);
                        scale = Math.ceil(scale * 100) / 100;
                        target_w = img.width / scale;
                        target_h = img.height / scale;
                    }
                    else {
                        target_w = img.width;
                        target_h = img.height;
                    }
                    canvas.width = target_w;
                    canvas.height = target_h;
                    context.drawImage(img, 0, 0, target_w, target_h);
                    try {
                        var _canvas = canvas.toDataURL("image/jpeg", 0.5);
                        _canvas = _canvas.substr(23);
                        callback(obj, _canvas);
                    }
                    catch (e) {
                        callback(obj, null);
                    }
                };
                if (typeof obj == 'string') {
                    img.src = obj;
                }
                else {
                    img.src = Helper.ImageHelper.getFullPath(obj);
                }
            },
            getFullPath: function (file) {
                window.URL = window.URL || window.webkitURL;
                if (window.URL && window.URL.createObjectURL) {
                    return window.URL.createObjectURL(file);
                }
                else {
                    return null;
                }
            }
        };
        Helper.CookieHelper = {
            setCookie: function (name, value, exires) {
                if (exires) {
                    var date = new Date();
                    date.setDate(date.getDate() + exires);
                    document.cookie = name + "=" + encodeURI(value) + ";expires=" + date.toUTCString();
                }
                else {
                    document.cookie = name + "=" + encodeURI(value) + ";";
                }
            },
            getCookie: function (name) {
                var start = document.cookie.indexOf(name + "=");
                if (start != -1) {
                    var end = document.cookie.indexOf(";", start);
                    if (end == -1) {
                        end = document.cookie.length;
                    }
                    return decodeURI(document.cookie.substring(start + name.length + 1, end));
                }
                else {
                    return "";
                }
            },
            removeCookie: function (name) {
                var con = this.getCookie(name);
                if (con) {
                    this.setCookie(name, "con", -1);
                }
            }
        };
        return Helper;
    })();
    RongWebIMWidget.Helper = Helper;
    var NotificationHelper = (function () {
        function NotificationHelper() {
        }
        NotificationHelper.isNotificationSupported = function () {
            return (typeof Notification === "function" || typeof Notification === "object");
        };
        NotificationHelper.requestPermission = function () {
            if (!NotificationHelper.isNotificationSupported()) {
                return;
            }
            Notification.requestPermission(function (status) {
            });
        };
        NotificationHelper.onclick = function (n) { };
        NotificationHelper.showNotification = function (config) {
            if (!NotificationHelper.isNotificationSupported()) {
                console.log('the current browser does not support Notification API');
                return;
            }
            if (Notification.permission !== "granted") {
                console.log('the current page has not been granted for notification');
                return;
            }
            if (!NotificationHelper.desktopNotification) {
                return;
            }
            var title = config.title;
            delete config.title;
            var n = new Notification(title, config);
            n.onshow = function () {
                setTimeout(function () {
                    n.close();
                }, 5000);
            };
            n.onclick = function () {
                window.focus();
                NotificationHelper.onclick && NotificationHelper.onclick(n);
                n.close();
            };
            n.onerror = function () {
            };
            n.onclose = function () {
            };
        };
        NotificationHelper.desktopNotification = true;
        return NotificationHelper;
    })();
    RongWebIMWidget.NotificationHelper = NotificationHelper;
    var DirectiveFactory = (function () {
        function DirectiveFactory() {
        }
        DirectiveFactory.GetFactoryFor = function (classType) {
            var factory = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var newInstance = Object.create(classType.prototype);
                newInstance.constructor.apply(newInstance, args);
                return newInstance;
            };
            factory.$inject = classType.$inject;
            return factory;
        };
        return DirectiveFactory;
    })();
    RongWebIMWidget.DirectiveFactory = DirectiveFactory;
    var errSrc = (function () {
        function errSrc() {
        }
        errSrc.instance = function () {
            return new errSrc();
        };
        errSrc.prototype.link = function (scope, element, attrs) {
            if (!attrs["ngSrc"]) {
                attrs.$set('src', attrs["errSrc"]);
            }
            element.bind('error', function () {
                if (attrs["src"] != attrs["errSrc"]) {
                    attrs.$set('src', attrs["errSrc"]);
                }
            });
        };
        return errSrc;
    })();
    var contenteditableDire = (function () {
        function contenteditableDire() {
            this.restrict = 'A';
            this.require = '?ngModel';
        }
        contenteditableDire.prototype.link = function (scope, element, attrs, ngModel) {
            function replacemy(e) {
                return e.replace(new RegExp("<[\\s\\S.]*?>", "ig"), "");
            }
            var domElement = element[0];
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (newVal) {
                if (document.activeElement === domElement) {
                    return;
                }
                if (newVal === '' || newVal === attrs["placeholder"]) {
                    domElement.innerHTML = attrs["placeholder"];
                    domElement.style.color = "#a9a9a9";
                    ngModel.$setViewValue("");
                }
            });
            element.bind('focus', function () {
                if (domElement.innerHTML == attrs["placeholder"]) {
                    domElement.innerHTML = '';
                }
                domElement.style.color = '';
            });
            element.bind('blur', function () {
                if (domElement.innerHTML === '') {
                    domElement.innerHTML = attrs["placeholder"];
                    domElement.style.color = "#a9a9a9";
                }
            });
            if (!ngModel)
                return;
            element.bind("paste", function (e) {
                var that = this;
                var content;
                e.preventDefault();
                if (e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)) {
                    // originalEvent jQuery中的
                    content = (e.originalEvent || e).clipboardData.getData('text/plain');
                    content = replacemy(content || '');
                    content && document.execCommand('insertText', false, content);
                }
                else if (window['clipboardData']) {
                    content = window['clipboardData'].getData('Text');
                    content = replacemy(content || '');
                    if (document['selection']) {
                        content && document['selection'].createRange().pasteHTML(content);
                    }
                    else if (document.getSelection) {
                        document.getSelection().getRangeAt(0).insertNode(document.createTextNode(content));
                    }
                }
                ngModel.$setViewValue(that.innerHTML);
            });
            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };
            element.bind("keyup paste", read);
            element.bind("input", read);
            function read() {
                var html = element.html();
                var html = Helper.escapeSymbol.decodeHtmlsymbol(html);
                html = html.replace(/^<br>$/i, "");
                html = html.replace(/<br>/gi, "\n");
                if (attrs["stripBr"] && html == '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        };
        return contenteditableDire;
    })();
    var ctrlEnterKeys = (function () {
        function ctrlEnterKeys() {
            this.restrict = "A";
            this.require = '?ngModel';
            this.scope = {
                fun: "&",
                ctrlenter: "=",
                content: "="
            };
        }
        ctrlEnterKeys.prototype.link = function (scope, element, attrs, ngModel) {
            scope.ctrlenter = scope.ctrlenter || false;
            element.bind("keypress", function (e) {
                if (scope.ctrlenter) {
                    if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    }
                }
                else {
                    if (e.ctrlKey === false && e.shiftKey === false && (e.keyCode === 13 || e.keyCode === 10)) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    }
                    else if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                    }
                }
            });
        };
        return ctrlEnterKeys;
    })();
    angular.module("RongWebIMWidget")
        .directive('errSrc', errSrc.instance)
        .directive("contenteditableDire", DirectiveFactory.GetFactoryFor(contenteditableDire))
        .directive("ctrlEnterKeys", DirectiveFactory.GetFactoryFor(ctrlEnterKeys))
        .filter('trustHtml', ["$sce", function ($sce) {
            return function (str) {
                var trustAsHtml = $sce.trustAsHtml(str);
                return trustAsHtml;
            };
        }]).filter("historyTime", ["$filter", function ($filter) {
            return function (time) {
                var today = new Date();
                if (time.toDateString() === today.toDateString()) {
                    return $filter("date")(time, "HH:mm");
                }
                else if (time.toDateString() === new Date(today.setTime(today.getTime() - 1)).toDateString()) {
                    return "昨天" + $filter("date")(time, "HH:mm");
                }
                else {
                    return $filter("date")(time, "yyyy-MM-dd HH:mm");
                }
            };
        }]);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation) {
        var UploadImageDomain = "http://7xogjk.com1.z0.glb.clouddn.com/";
        var ConversationController = (function () {
            function ConversationController($scope, conversationServer, WebIMWidget, conversationListServer, widgetConfig, providerdata, RongIMSDKServer) {
                this.$scope = $scope;
                this.conversationServer = conversationServer;
                this.WebIMWidget = WebIMWidget;
                this.conversationListServer = conversationListServer;
                this.widgetConfig = widgetConfig;
                this.providerdata = providerdata;
                this.RongIMSDKServer = RongIMSDKServer;
                var _this = this;
                _this.busy = false;
                conversationServer.changeConversation = function (obj) {
                    _this.changeConversation(obj);
                };
                conversationServer.handleMessage = function (msg) {
                    _this.handleMessage(msg);
                };
                conversationServer._handleConnectSuccess = function () {
                    updateUploadToken();
                };
                function updateUploadToken() {
                    RongIMSDKServer.getFileToken().then(function (token) {
                        conversationServer._uploadToken = token;
                        if (RongWebIMWidget.Helper.browser.msie && RongWebIMWidget.Helper.browser.version == "9.0") {
                            uploadFileUserFlash();
                        }
                        else {
                            uploadFileRefresh();
                        }
                    });
                }
                $scope.evaluate = {
                    type: 1,
                    showevaluate: false,
                    valid: false,
                    onConfirm: function (data) {
                        //发评价
                        if (data) {
                            if ($scope.evaluate.type == RongWebIMWidget.EnumCustomerStatus.person) {
                                RongIMSDKServer.evaluateHumanCustomService(conversationServer.current.targetId, data.stars, data.describe).then(function () {
                                }, function () {
                                });
                            }
                            else {
                                RongIMSDKServer.evaluateRebotCustomService(conversationServer.current.targetId, data.value, data.describe).then(function () {
                                }, function () {
                                });
                            }
                        }
                        _this.conversationServer._customService.connected = false;
                        RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                            onSuccess: function () {
                            },
                            onError: function () {
                            }
                        });
                        _this.busy = false;
                        _this.closeState();
                    },
                    onCancle: function () {
                        $scope.evaluate.showSelf = false;
                    }
                };
                $scope._inputPanelState = RongWebIMWidget.EnumInputPanelType.person;
                $scope.$watch("showemoji", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if (!$scope.emojiList || $scope.emojiList.length == 0) {
                        $scope.emojiList = RongIMLib.RongIMEmoji.emojis.slice(0, 70);
                    }
                });
                document.addEventListener("click", function (e) {
                    if ($scope.showemoji && e.target.className.indexOf("iconfont-smile") == -1) {
                        $scope.$apply(function () {
                            $scope.showemoji = false;
                        });
                    }
                });
                $scope.$watch("showSelf", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if (newVal && conversationServer._uploadToken) {
                        uploadFileRefresh();
                    }
                    else {
                        qiniuuploader && qiniuuploader.destroy();
                    }
                });
                $scope.$watch("_inputPanelState", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if (newVal == RongWebIMWidget.EnumInputPanelType.person && conversationServer._uploadToken) {
                        uploadFileRefresh();
                    }
                    else {
                        qiniuuploader && qiniuuploader.destroy();
                    }
                });
                $scope.$watch("conversation.messageContent", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if ($scope.conversation) {
                        RongIMLib.RongIMClient.getInstance().saveTextMessageDraft(+$scope.conversation.targetType, $scope.conversation.targetId, newVal);
                    }
                });
                $scope.getHistory = function () {
                    var key = $scope.conversation.targetType + "_" + $scope.conversation.targetId;
                    var arr = conversationServer._cacheHistory[key];
                    arr.splice(0, arr.length);
                    conversationServer._getHistoryMessages(+$scope.conversation.targetType, $scope.conversation.targetId, 20).then(function (data) {
                        conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.TimePanel(conversationServer._cacheHistory[key][0].sentTime));
                        if (data.has) {
                            conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.GetMoreMessagePanel());
                        }
                    });
                };
                $scope.getMoreMessage = function () {
                    var key = $scope.conversation.targetType + "_" + $scope.conversation.targetId;
                    conversationServer._cacheHistory[key].shift();
                    conversationServer._cacheHistory[key].shift();
                    conversationServer._getHistoryMessages(+$scope.conversation.targetType, $scope.conversation.targetId, 20).then(function (data) {
                        conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.TimePanel(conversationServer._cacheHistory[key][0].sentTime));
                        if (data.has) {
                            conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.GetMoreMessagePanel());
                        }
                    });
                };
                $scope.switchPerson = function () {
                    RongIMLib.RongIMClient.getInstance().switchToHumanMode(conversationServer.current.targetId, {
                        onSuccess: function () {
                        },
                        onError: function () {
                        }
                    });
                };
                $scope.send = function () {
                    if (!$scope.conversation.targetId || !$scope.conversation.targetType) {
                        alert("请先选择一个会话目标。");
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
                            onSuccess: function (retMessage) {
                                conversationListServer.updateConversations().then(function () {
                                });
                            },
                            onError: function (error) {
                            }
                        });
                    }
                    catch (e) {
                    }
                    var content = _this.packDisplaySendMessage(msg, RongWebIMWidget.MessageType.TextMessage);
                    var cmsg = RongWebIMWidget.Message.convert(content);
                    conversationServer._addHistoryMessages(cmsg);
                    $scope.scrollBar();
                    $scope.conversation.messageContent = "";
                    var obj = document.getElementById("inputMsg");
                    RongWebIMWidget.Helper.getFocus(obj);
                };
                function sendImageMessage(content, imageUrl) {
                    var im = RongIMLib.ImageMessage.obtain(content, imageUrl);
                    var content = _this.packDisplaySendMessage(im, RongWebIMWidget.MessageType.ImageMessage);
                    RongIMLib.RongIMClient.getInstance()
                        .sendMessage($scope.conversation.targetType, $scope.conversation.targetId, im, {
                        onSuccess: function () {
                            conversationListServer.updateConversations().then(function () {
                            });
                        },
                        onError: function () {
                        }
                    });
                    conversationServer._addHistoryMessages(RongWebIMWidget.Message.convert(content));
                    $scope.$apply(function () {
                        $scope.scrollBar();
                    });
                }
                function uploadFileUserFlash() {
                    if (!widgetConfig.uploadFlashUrl) {
                        console.log('请在 init 时添加 flash 文件地址配置 uploadFlashUrl');
                    }
                    $('#upload-file').FileToDataURI({
                        moviePath: widgetConfig.uploadFlashUrl || '/rong_widget/images/FileToDataURI.swf',
                        // Choose to allow multiple files or now
                        multiple: true,
                        // Put th extensions allowed for the file picker
                        allowedExts: ['js', 'png', 'jpg', 'jpeg'],
                        // force flash - boolean to force flash
                        forceFlash: false,
                        token: conversationServer._uploadToken,
                        // Display the images in the page (callback function)
                        onSelect: function (files, response) {
                            RongWebIMWidget.Helper.ImageHelper.getThumbnail(files[0].data, 60000, function (obj, data) {
                                var basestr = files[0].data;
                                var reg = new RegExp('^data:image/[^;]+;base64,');
                                basestr = basestr.replace(reg, '');
                                RongIMLib.RongIMClient.getInstance().getFileUrl(RongIMLib.FileType.IMAGE, response.filename, '', {
                                    onSuccess: function (url) {
                                        sendImageMessage(data, url.downloadUrl);
                                    },
                                    onError: function () {
                                    }
                                });
                            });
                        }
                    });
                }
                function postImageBase(base64, callback) {
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
                var qiniuuploader;
                function uploadFileRefresh() {
                    if (RongWebIMWidget.Helper.browser.msie && RongWebIMWidget.Helper.browser.version == "9.0")
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
                            'FilesAdded': function (up, files) {
                            },
                            'BeforeUpload': function (up, file) {
                            },
                            'UploadProgress': function (up, file) {
                            },
                            'UploadComplete': function () {
                            },
                            'FileUploaded': function (up, file, info) {
                                if (!$scope.conversation.targetId || !$scope.conversation.targetType) {
                                    alert("请先选择一个会话目标。");
                                    return;
                                }
                                info = info.replace(/'/g, "\"");
                                info = JSON.parse(info);
                                RongIMLib.RongIMClient.getInstance()
                                    .getFileUrl(RongIMLib.FileType.IMAGE, file.target_name, '', {
                                    onSuccess: function (url) {
                                        RongWebIMWidget.Helper.ImageHelper.getThumbnail(file.getNative(), 60000, function (obj, data) {
                                            sendImageMessage(data, url.downloadUrl);
                                        });
                                    },
                                    onError: function () {
                                    }
                                });
                            },
                            'Error': function (up, err, errTip) {
                                console.log(err);
                                updateUploadToken();
                            }
                        }
                    });
                }
                $scope.close = function () {
                    if (WebIMWidget.onCloseBefore && typeof WebIMWidget.onCloseBefore === "function") {
                        var isClose = WebIMWidget.onCloseBefore({
                            close: function (data) {
                                if (conversationServer.current.targetType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                                    if ($scope.evaluate.valid) {
                                        _this.busy = true;
                                        $scope.evaluate.showSelf = true;
                                    }
                                    else {
                                        RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                                            onSuccess: function () {
                                            },
                                            onError: function () {
                                            }
                                        });
                                        conversationServer._customService.connected = false;
                                        _this.closeState();
                                    }
                                }
                                else {
                                    _this.closeState();
                                }
                            }
                        });
                    }
                    else {
                        if (conversationServer.current.targetType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                            if ($scope.evaluate.valid) {
                                _this.busy = true;
                                $scope.evaluate.showSelf = true;
                            }
                            else {
                                RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                                    onSuccess: function () {
                                    },
                                    onError: function () {
                                    }
                                });
                                conversationServer._customService.connected = false;
                                _this.closeState();
                            }
                        }
                        else {
                            _this.closeState();
                        }
                    }
                };
                $scope.minimize = function () {
                    WebIMWidget.display = false;
                };
            }
            ConversationController.prototype.closeState = function () {
                var _this = this;
                if (this.WebIMWidget.onClose && typeof this.WebIMWidget.onClose === "function") {
                    setTimeout(function () { _this.WebIMWidget.onClose(_this.$scope.conversation); }, 1);
                }
                if (this.widgetConfig.displayConversationList) {
                    this.$scope.showSelf = false;
                }
                else {
                    this.WebIMWidget.display = false;
                }
                this.$scope.messageList = [];
                this.$scope.conversation = null;
                this.conversationServer.current = null;
                _this.$scope.evaluate.showSelf = false;
            };
            ConversationController.prototype.changeConversation = function (obj) {
                var _this = this;
                if (_this.busy) {
                    return;
                }
                if (_this.widgetConfig.displayConversationList) {
                    _this.$scope.showSelf = true;
                }
                else {
                    _this.$scope.showSelf = true;
                    _this.WebIMWidget.display = true;
                }
                if (!obj || !obj.targetId) {
                    _this.$scope.conversation = {};
                    _this.$scope.messageList = [];
                    _this.conversationServer.current = null;
                    setTimeout(function () {
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
                    }
                    else {
                        _this.RongIMSDKServer.startCustomService(obj.targetId);
                    }
                }
                else {
                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                }
                _this.conversationServer.current = obj;
                _this.$scope.conversation = obj;
                _this.$scope.conversation.messageContent = RongIMLib.RongIMClient.getInstance().getTextMessageDraft(obj.targetType, obj.targetId) || "";
                _this.$scope.messageList = _this.conversationServer._cacheHistory[key] = _this.conversationServer._cacheHistory[key] || [];
                if (_this.$scope.messageList.length == 0 && _this.conversationServer.current.targetType !== RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                    _this.conversationServer._getHistoryMessages(obj.targetType, obj.targetId, 3)
                        .then(function (data) {
                        if (_this.$scope.messageList.length > 0) {
                            _this.$scope.messageList.unshift(new RongWebIMWidget.TimePanl(_this.$scope.messageList[0].sentTime));
                            if (data.has) {
                                _this.$scope.messageList.unshift(new RongWebIMWidget.GetMoreMessagePanel());
                            }
                            setTimeout(function () {
                                _this.$scope.$apply();
                            });
                            _this.$scope.scrollBar();
                        }
                    });
                    if (!_this.$scope.$$phase) {
                        _this.$scope.$digest();
                    }
                }
                else {
                    setTimeout(function () {
                        _this.$scope.$apply();
                    });
                    _this.$scope.scrollBar();
                }
            };
            ConversationController.prototype.handleMessage = function (msg) {
                var _this = this;
                if (_this.$scope.conversation
                    && msg.targetId == _this.$scope.conversation.targetId
                    && msg.conversationType == _this.$scope.conversation.targetType) {
                    _this.$scope.$apply();
                    var systemMsg = null;
                    switch (msg.messageType) {
                        case RongWebIMWidget.MessageType.HandShakeResponseMessage:
                            if (msg.content.data.serviceType == "1") {
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                msg.content.data.robotWelcome
                                    && (systemMsg = this.packReceiveMessage(RongIMLib.TextMessage.obtain(msg.content.data.robotWelcome), RongWebIMWidget.MessageType.TextMessage));
                            }
                            else if (msg.content.data.serviceType == "3") {
                                msg.content.data.robotWelcome
                                    && (systemMsg = this.packReceiveMessage(RongIMLib.TextMessage.obtain(msg.content.data.robotWelcome), RongWebIMWidget.MessageType.TextMessage));
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                            }
                            else {
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                            }
                            //会话一分钟评价有效，显示评价
                            _this.$scope.evaluate.valid = false;
                            _this.$scope.evaluate.showSelf = false;
                            setTimeout(function () {
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
                                    }
                                    else if (_this.conversationServer._customService.type == "1" || _this.conversationServer._customService.type == "3") {
                                        _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                                    }
                                    break;
                                case 3:
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                    systemMsg = this.packReceiveMessage(RongIMLib.InformationNotificationMessage.obtain("你被拉黑了"), RongWebIMWidget.MessageType.InformationNotificationMessage);
                                    break;
                                case 4:
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                    systemMsg = _this.packReceiveMessage(RongIMLib.InformationNotificationMessage.obtain("已经是人工了"), RongWebIMWidget.MessageType.InformationNotificationMessage);
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
                            }
                            else {
                                if (_this.conversationServer._customService.type == "1") {
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                }
                                else {
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
                                    }
                                    else {
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
                    setTimeout(function () {
                        _this.$scope.$apply();
                        _this.$scope.scrollBar();
                    }, 200);
                }
                if (msg.messageType === RongWebIMWidget.MessageType.ImageMessage) {
                    setTimeout(function () {
                        _this.$scope.$apply();
                        _this.$scope.scrollBar();
                    }, 800);
                }
            };
            ConversationController.prototype.changeCustomerState = function (type) {
                this.$scope._inputPanelState = type;
                if (type == RongWebIMWidget.EnumInputPanelType.person) {
                    this.$scope.evaluate.type = RongWebIMWidget.EnumCustomerStatus.person;
                    this.conversationServer._customService.currentType = RongWebIMWidget.EnumCustomerStatus.person;
                }
                else {
                    this.$scope.evaluate.type = RongWebIMWidget.EnumCustomerStatus.robot;
                    this.conversationServer._customService.currentType = RongWebIMWidget.EnumCustomerStatus.robot;
                }
            };
            ConversationController.prototype.packDisplaySendMessage = function (msg, messageType) {
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
            };
            ConversationController.prototype.packReceiveMessage = function (msg, messageType) {
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
            };
            ConversationController.$inject = ["$scope",
                "ConversationServer",
                "WebIMWidget",
                "ConversationListServer",
                "WidgetConfig",
                "ProviderData",
                "RongIMSDKServer"];
            return ConversationController;
        })();
        angular.module("RongWebIMWidget.conversation")
            .controller("conversationController", ConversationController);
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation) {
        var factory = RongWebIMWidget.DirectiveFactory.GetFactoryFor;
        var rongConversation = (function () {
            function rongConversation(conversationServer) {
                this.conversationServer = conversationServer;
                this.restrict = "E";
                this.templateUrl = "./ts/conversation/conversation.tpl.html";
                this.controller = "conversationController";
            }
            rongConversation.prototype.link = function (scope, ele) {
                if (window["jQuery"] && window["jQuery"].nicescroll && !RongWebIMWidget.Helper.browser.msie) {
                    $("#Messages").niceScroll({
                        'cursorcolor': "#0099ff",
                        'cursoropacitymax': 1,
                        'touchbehavior': true,
                        'cursorwidth': "8px",
                        'cursorborder': "0",
                        'cursorborderradius': "5px"
                    });
                }
                scope.scrollBar = function () {
                    setTimeout(function () {
                        var ele = document.getElementById("Messages");
                        if (!ele)
                            return;
                        ele.scrollTop = ele.scrollHeight;
                    }, 200);
                };
            };
            rongConversation.$inject = ["ConversationServer"];
            return rongConversation;
        })();
        var emoji = (function () {
            function emoji() {
                this.restrict = "E";
                this.scope = {
                    item: "=",
                    content: "="
                };
                this.template = '<div style="display:inline-block"></div>';
            }
            emoji.prototype.link = function (scope, ele, attr) {
                ele.find("div").append(scope.item);
                ele.on("click", function () {
                    scope.content.messageContent = scope.content.messageContent || "";
                    scope.content.messageContent = scope.content.messageContent.replace(/\n$/, "");
                    scope.content.messageContent = scope.content.messageContent + scope.item.children[0].getAttribute("name");
                    scope.$parent.$apply();
                    var obj = document.getElementById("inputMsg");
                    RongWebIMWidget.Helper.getFocus(obj);
                });
            };
            return emoji;
        })();
        var textmessage = (function () {
            function textmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-text"><pre class="rongcloud-Message-entry" ng-bind-html="msg.content|trustHtml"><br></pre></div>' +
                    '</div>';
            }
            textmessage.prototype.link = function (scope, ele, attr) {
            };
            return textmessage;
        })();
        var includinglinkmessage = (function () {
            function includinglinkmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-text">' +
                    '<pre class="rongcloud-Message-entry" style="">' +
                    '维护中 由于我们的服务商出现故障，融云官网及相关服务也受到影响，给各位用户带来的不便，还请谅解。  您可以通过 <a href="#">【官方微博】</a>了解</pre>' +
                    '</div>' +
                    '</div>';
            }
            return includinglinkmessage;
        })();
        var imagemessage = (function () {
            function imagemessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-img">' +
                    '<span id="{{\'rebox_\'+$id}}"  class="rongcloud-Message-entry" style="">' +
                    // '<p>发给您一张示意图</p>' +
                    // '<img ng-src="{{msg.content}}" alt="">' +
                    '<a href="{{msg.imageUri}}" target="_black"><img ng-src="{{msg.content}}"  data-image="{{msg.imageUri}}" alt=""/></a>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }
            imagemessage.prototype.link = function (scope, ele, attr) {
                var img = new Image();
                img.src = scope.msg.imageUri;
                img.onload = function () {
                    scope.$apply(function () {
                        scope.msg.content = scope.msg.imageUri;
                    });
                };
                setTimeout(function () {
                    if (window["jQuery"] && window["jQuery"].rebox) {
                        $('#rebox_' + scope.$id).rebox({ selector: 'a', zIndex: 999999, theme: "rebox" }).bind("rebox:open", function () {
                            //jQuery rebox 点击空白关闭
                            var rebox = document.getElementsByClassName("rebox")[0];
                            rebox.onclick = function (e) {
                                if (e.target.tagName.toLowerCase() != "img") {
                                    var rebox_close = document.getElementsByClassName("rebox-close")[0];
                                    rebox_close.click();
                                    rebox = null;
                                    rebox_close = null;
                                }
                            };
                        });
                    }
                });
            };
            return imagemessage;
        })();
        var voicemessage = (function () {
            function voicemessage($timeout) {
                this.$timeout = $timeout;
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-audio">' +
                    '<span class="rongcloud-Message-entry" style="">' +
                    '<span class="rongcloud-audioBox" ng-click="play()" ng-class="{\'rongcloud-animate\':isplaying}" ><i></i><i></i><i></i> ' +
                    // '<div style="display: inline-block;" > ' +
                    // '</div>' +
                    '</span>' +
                    '<span class="rongcloud-audioTimer">{{msg.duration}}”</span> ' +
                    '<span class="rongcloud-audioState" ng-show="msg.isUnReade"></span>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
                voicemessage.prototype["link"] = function (scope, ele, attr) {
                    scope.msg.duration = parseInt(scope.msg.duration || scope.msg.content.length / 1024);
                    RongIMLib.RongIMVoice.preLoaded(scope.msg.content);
                    scope.play = function () {
                        RongIMLib.RongIMVoice.stop(scope.msg.content);
                        if (!scope.isplaying) {
                            scope.msg.isUnReade = false;
                            RongIMLib.RongIMVoice.play(scope.msg.content, scope.msg.duration);
                            scope.isplaying = true;
                            if (scope.timeoutid) {
                                $timeout.cancel(scope.timeoutid);
                            }
                            scope.timeoutid = $timeout(function () {
                                scope.isplaying = false;
                            }, scope.msg.duration * 1000);
                        }
                        else {
                            scope.isplaying = false;
                            $timeout.cancel(scope.timeoutid);
                        }
                    };
                };
            }
            voicemessage.$inject = ["$timeout"];
            return voicemessage;
        })();
        var locationmessage = (function () {
            function locationmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-map">' +
                    '<span class="rongcloud-Message-entry" style="">' +
                    '<div class="rongcloud-mapBox">' +
                    '<img ng-src="{{msg.content}}" alt="">' +
                    '<span>{{msg.poi}}</span>' +
                    '</div>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }
            return locationmessage;
        })();
        var richcontentmessage = (function () {
            function richcontentmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-image-text">' +
                    '<span class="rongcloud-Message-entry" style="">' +
                    '<div class="rongcloud-image-textBox">' +
                    '<h4>{{msg.title}}</h4>' +
                    '<div class="rongcloud-cont rongcloud-clearfix">' +
                    '<img ng-src="{{msg.imageUri}}" alt="">' +
                    '<div>{{msg.content}}</div>' +
                    '</div>' +
                    '</div>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }
            return richcontentmessage;
        })();
        angular.module("RongWebIMWidget.conversation")
            .directive("rongConversation", factory(rongConversation))
            .directive("emoji", factory(emoji))
            .directive("textmessage", factory(textmessage))
            .directive("includinglinkmessage", factory(includinglinkmessage))
            .directive("imagemessage", factory(imagemessage))
            .directive("voicemessage", factory(voicemessage))
            .directive("locationmessage", factory(locationmessage))
            .directive("richcontentmessage", factory(richcontentmessage));
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation_1) {
        var CustomerService = (function () {
            function CustomerService() {
                this.human = {};
            }
            return CustomerService;
        })();
        var conversationServer = (function () {
            function conversationServer($q, providerdata) {
                this.$q = $q;
                this.providerdata = providerdata;
                this.current = new RongWebIMWidget.Conversation;
                this._cacheHistory = {};
                this._cacheCustomService = {};
                this._customService = new CustomerService();
            }
            conversationServer.prototype.unshiftHistoryMessages = function (id, type, item) {
                var key = type + "_" + id;
                var arr = this._cacheHistory[key] = this._cacheHistory[key] || [];
                if (arr[0] && arr[0].sentTime && arr[0].panelType != RongWebIMWidget.PanelType.Time && item.sentTime) {
                    if (!RongWebIMWidget.Helper.timeCompare(arr[0].sentTime, item.sentTime)) {
                        arr.unshift(new RongWebIMWidget.TimePanl(arr[0].sentTime));
                    }
                }
                arr.unshift(item);
            };
            conversationServer.prototype._getHistoryMessages = function (targetType, targetId, number, reset) {
                var defer = this.$q.defer();
                var _this = this;
                RongIMLib.RongIMClient.getInstance().getHistoryMessages(targetType, targetId, reset ? 0 : null, number, {
                    onSuccess: function (data, has) {
                        var msglen = data.length;
                        while (msglen--) {
                            var msg = RongWebIMWidget.Message.convert(data[msglen]);
                            switch (msg.messageType) {
                                case RongWebIMWidget.MessageType.TextMessage:
                                case RongWebIMWidget.MessageType.ImageMessage:
                                case RongWebIMWidget.MessageType.VoiceMessage:
                                case RongWebIMWidget.MessageType.RichContentMessage:
                                case RongWebIMWidget.MessageType.LocationMessage:
                                case RongWebIMWidget.MessageType.InformationNotificationMessage:
                                    _this.unshiftHistoryMessages(targetId, targetType, msg);
                                    _this.addCustomServiceInfo(msg);
                                    if (msg.content && _this.providerdata.getUserInfo) {
                                        (function (msg) {
                                            _this.providerdata.getUserInfo(msg.senderUserId, {
                                                onSuccess: function (obj) {
                                                    msg.content.userInfo = new RongWebIMWidget.UserInfo(obj.userId, obj.name, obj.portraitUri);
                                                }
                                            });
                                        })(msg);
                                    }
                                    break;
                                case RongWebIMWidget.MessageType.UnknownMessage:
                                    break;
                                default:
                                    break;
                            }
                        }
                        defer.resolve({ data: data, has: has });
                    },
                    onError: function (error) {
                        defer.reject(error);
                    }
                });
                return defer.promise;
            };
            conversationServer.prototype._addHistoryMessages = function (item) {
                var key = item.conversationType + "_" + item.targetId;
                var arr = this._cacheHistory[key];
                if (arr.length == 0) {
                    arr.push(new RongWebIMWidget.GetHistoryPanel());
                }
                if (arr[arr.length - 1]
                    && arr[arr.length - 1].panelType != RongWebIMWidget.PanelType.Time
                    && arr[arr.length - 1].sentTime
                    && item.sentTime) {
                    if (!RongWebIMWidget.Helper.timeCompare(arr[arr.length - 1].sentTime, item.sentTime)) {
                        arr.push(new RongWebIMWidget.TimePanl(item.sentTime));
                    }
                }
                arr.push(item);
            };
            conversationServer.prototype.updateUploadToken = function () {
                var _this = this;
                RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                    onSuccess: function (data) {
                        _this._uploadToken = data.token;
                    }, onError: function () {
                    }
                });
            };
            conversationServer.prototype.addCustomServiceInfo = function (msg) {
                if (!msg.content || (msg.content.userInfo && msg.content.userInfo.name)) {
                    return;
                }
                if (msg.conversationType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && msg.content && msg.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE) {
                    if (this._customService.currentType == 1) {
                        msg.content.userInfo = {
                            name: this._customService.human.name || "客服人员",
                            portraitUri: this._customService.human.headimgurl || this._customService.robotIcon
                        };
                    }
                    else {
                        msg.content.userInfo = {
                            name: this._customService.robotName,
                            portraitUri: this._customService.robotIcon
                        };
                    }
                }
                else if (msg.conversationType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && msg.content && msg.messageDirection == RongWebIMWidget.MessageDirection.SEND) {
                    msg.content.userInfo = {
                        name: "我",
                        portraitUri: this.providerdata.currentUserInfo.portraitUri
                    };
                }
                return msg;
            };
            conversationServer.prototype.getCacheCustomService = function (type, id) {
                type = Number(type);
                if (type == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                    var key = type + '_' + id;
                    var cache = this._cacheCustomService;
                    cache[key] = cache[key] || {};
                    return cache[key];
                }
            };
            conversationServer.$inject = ["$q", "ProviderData"];
            return conversationServer;
        })();
        angular.module("RongWebIMWidget.conversation")
            .service("ConversationServer", conversationServer);
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        var conversationListController = (function () {
            function conversationListController($scope, conversationListServer, WebIMWidget) {
                this.$scope = $scope;
                this.conversationListServer = conversationListServer;
                this.WebIMWidget = WebIMWidget;
                $scope.minbtn = function () {
                    WebIMWidget.display = false;
                };
                $scope.conversationListServer = conversationListServer;
            }
            conversationListController.$inject = [
                "$scope",
                "ConversationListServer",
                "WebIMWidget"
            ];
            return conversationListController;
        })();
        angular.module("RongWebIMWidget.conversationlist")
            .controller("conversationListController", conversationListController);
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        var factory = RongWebIMWidget.DirectiveFactory.GetFactoryFor;
        var conversationItem = (function () {
            function conversationItem(conversationServer, conversationListServer, RongIMSDKServer) {
                this.conversationServer = conversationServer;
                this.conversationListServer = conversationListServer;
                this.RongIMSDKServer = RongIMSDKServer;
                this.restrict = "E";
                this.scope = { item: "=" };
                this.template = '<div class="rongcloud-chatList">' +
                    '<div class="rongcloud-chat_item " ng-class="{\'rongcloud-online\':item.onLine}">' +
                    '<div class="rongcloud-ext">' +
                    '<p class="rongcloud-attr clearfix">' +
                    '<span class="rongcloud-badge" ng-show="item.unreadMessageCount>0">{{item.unreadMessageCount>99?"99+":item.unreadMessageCount}}</span>' +
                    '<i class="rongcloud-sprite rongcloud-no-remind" ng-click="remove($event)"></i>' +
                    '</p>' +
                    '</div>' +
                    '<div class="rongcloud-photo">' +
                    '<img class="rongcloud-img" ng-src="{{item.portraitUri}}" err-src="http://7xo1cb.com1.z0.glb.clouddn.com/rongcloudkefu2.png" alt="">' +
                    '<i ng-show="!!$parent.data.getOnlineStatus&&item.targetType==1" class="rongcloud-Presence rongcloud-Presence--stacked rongcloud-Presence--mainBox"></i>' +
                    '</div>' +
                    '<div class="rongcloud-info">' +
                    '<h3 class="rongcloud-nickname">' +
                    '<span class="rongcloud-nickname_text" title="{{item.title}}">{{item.title}}</span>' +
                    '</h3>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                conversationItem.prototype["link"] = function (scope, ele, attr) {
                    ele.on("click", function () {
                        conversationServer
                            .changeConversation(new RongWebIMWidget.Conversation(scope.item.targetType, scope.item.targetId, scope.item.title));
                        if (scope.item.unreadMessageCount > 0) {
                            RongIMSDKServer.clearUnreadCount(scope.item.targetType, scope.item.targetId);
                            RongIMSDKServer.sendReadReceiptMessage(scope.item.targetId, Number(scope.item.targetType));
                            conversationListServer.updateConversations();
                        }
                    });
                    scope.remove = function (e) {
                        e.stopPropagation();
                        RongIMSDKServer.removeConversation(scope.item.targetType, scope.item.targetId).then(function () {
                            if (conversationServer.current.targetType == scope.item.targetType
                                && conversationServer.current.targetId == scope.item.targetId) {
                            }
                            conversationListServer.updateConversations();
                        }, function (error) {
                        });
                    };
                };
            }
            conversationItem.$inject = ["ConversationServer",
                "ConversationListServer",
                "RongIMSDKServer"];
            return conversationItem;
        })();
        angular.module("RongWebIMWidget.conversationlist")
            .directive("rongConversationList", ['WebIMWidget',
            function (WebIMWidget) {
                return {
                    restrict: "E",
                    templateUrl: "./ts/conversationlist/conversationList.tpl.html",
                    controller: "conversationListController",
                    link: function () {
                        WebIMWidget.isReady = true;
                        if (WebIMWidget.onReady) {
                            WebIMWidget.onReady();
                        }
                    }
                };
            }])
            .directive("conversationItem", factory(conversationItem));
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        var ConversationListServer = (function () {
            function ConversationListServer($q, providerdata, widgetConfig, RongIMSDKServer, conversationServer) {
                this.$q = $q;
                this.providerdata = providerdata;
                this.widgetConfig = widgetConfig;
                this.RongIMSDKServer = RongIMSDKServer;
                this.conversationServer = conversationServer;
                this._conversationList = [];
                this._onlineStatus = [];
                this.hiddenConversations = [];
                this._hiddenConversationObject = {};
            }
            ConversationListServer.prototype.setHiddenConversations = function (list) {
                if (angular.isArray(list)) {
                    for (var i = 0, length = list.length; i < length; i++) {
                        this._hiddenConversationObject[list[i].type + "_" + list[i].id] = true;
                    }
                }
            };
            ConversationListServer.prototype.updateConversations = function () {
                var defer = this.$q.defer();
                var _this = this;
                RongIMLib.RongIMClient.getInstance().getConversationList({
                    onSuccess: function (data) {
                        var totalUnreadCount = 0;
                        _this._conversationList.splice(0, _this._conversationList.length);
                        for (var i = 0, len = data.length; i < len; i++) {
                            var con = RongWebIMWidget.Conversation.onvert(data[i]);
                            if (_this._hiddenConversationObject[con.targetType + "_" + con.targetId]) {
                                continue;
                            }
                            switch (con.targetType) {
                                case RongIMLib.ConversationType.PRIVATE:
                                    if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function") {
                                        (function (a, b) {
                                            _this.providerdata.getUserInfo(a.targetId, {
                                                onSuccess: function (data) {
                                                    a.title = data.name;
                                                    a.portraitUri = data.portraitUri;
                                                    b.conversationTitle = data.name;
                                                    b.portraitUri = data.portraitUri;
                                                }
                                            });
                                        }(con, data[i]));
                                    }
                                    break;
                                case RongIMLib.ConversationType.GROUP:
                                    if (RongWebIMWidget.Helper.checkType(_this.providerdata.getGroupInfo) == "function") {
                                        (function (a, b) {
                                            _this.providerdata.getGroupInfo(a.targetId, {
                                                onSuccess: function (data) {
                                                    a.title = data.name;
                                                    a.portraitUri = data.portraitUri;
                                                    b.conversationTitle = data.name;
                                                    b.portraitUri = data.portraitUri;
                                                }
                                            });
                                        }(con, data[i]));
                                    }
                                    break;
                                case RongIMLib.ConversationType.CUSTOMER_SERVICE:
                                    con.title = "客服";
                                    break;
                                case RongIMLib.ConversationType.CHATROOM:
                                    con.title = "聊天室：" + con.targetId;
                                    break;
                            }
                            totalUnreadCount += Number(con.unreadMessageCount) || 0;
                            _this._conversationList.push(con);
                        }
                        _this._onlineStatus.forEach(function (item) {
                            var conv = _this._getConversation(RongWebIMWidget.EnumConversationType.PRIVATE, item.id);
                            conv && (conv.onLine = item.status);
                        });
                        if (_this.widgetConfig.displayConversationList) {
                            _this.providerdata.totalUnreadCount = totalUnreadCount;
                            defer.resolve();
                        }
                        else {
                            var cu = _this.conversationServer.current;
                            cu && cu.targetId && _this.RongIMSDKServer.getConversation(cu.targetType, cu.targetId).then(function (conv) {
                                if (conv && conv.unreadMessageCount) {
                                    _this.providerdata.totalUnreadCount = conv.unreadMessageCount || 0;
                                    defer.resolve();
                                }
                                else {
                                    _this.providerdata.totalUnreadCount = 0;
                                    defer.resolve();
                                }
                            });
                        }
                    },
                    onError: function (error) {
                        defer.reject(error);
                    }
                }, null);
                return defer.promise;
            };
            ConversationListServer.prototype._getConversation = function (type, id) {
                for (var i = 0, len = this._conversationList.length; i < len; i++) {
                    if (this._conversationList[i].targetType == type && this._conversationList[i].targetId == id) {
                        return this._conversationList[i];
                    }
                }
                return null;
            };
            ConversationListServer.prototype.startRefreshOnlineStatus = function () {
                var _this = this;
                if (_this.widgetConfig.displayConversationList && _this.providerdata.getOnlineStatus) {
                    _this._getOnlineStatus();
                    _this.__intervale && clearInterval(this.__intervale);
                    _this.__intervale = setInterval(function () {
                        _this._getOnlineStatus();
                    }, 30 * 1000);
                }
            };
            ConversationListServer.prototype._getOnlineStatus = function () {
                var _this = this;
                var arr = _this._conversationList.map(function (item) { return item.targetId; });
                _this.providerdata.getOnlineStatus(arr, {
                    onSuccess: function (data) {
                        _this._onlineStatus = data;
                        _this.updateConversations();
                    }
                });
            };
            ConversationListServer.prototype.stopRefreshOnlineStatus = function () {
                clearInterval(this.__intervale);
                this.__intervale = null;
            };
            ConversationListServer.$inject = ["$q",
                "ProviderData",
                "WidgetConfig",
                "RongIMSDKServer",
                "ConversationServer"];
            return ConversationListServer;
        })();
        angular.module("RongWebIMWidget.conversationlist")
            .service("ConversationListServer", ConversationListServer);
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var ProductInfo = (function () {
        function ProductInfo() {
        }
        return ProductInfo;
    })();
    var eleConversationListWidth = 195, eleminbtnHeight = 50, eleminbtnWidth = 195, spacing = 3;
    var WebIMWidget = (function () {
        function WebIMWidget($q, conversationServer, conversationListServer, providerdata, widgetConfig, RongIMSDKServer, $log) {
            this.$q = $q;
            this.conversationServer = conversationServer;
            this.conversationListServer = conversationListServer;
            this.providerdata = providerdata;
            this.widgetConfig = widgetConfig;
            this.RongIMSDKServer = RongIMSDKServer;
            this.$log = $log;
            this.display = false;
            this.connected = false;
            this.isReady = false;
            this.isInit = false;
            this.EnumConversationType = RongWebIMWidget.EnumConversationType;
            this.EnumConversationListPosition = RongWebIMWidget.EnumConversationListPosition;
        }
        WebIMWidget.prototype.initStyle = function (defaultStyle) {
            var _this = this;
            var eleconversation = document.getElementById("rong-conversation");
            var eleconversationlist = document.getElementById("rong-conversation-list");
            var eleminbtn = document.getElementById("rong-widget-minbtn");
            if (_this.widgetConfig.__isKefu) {
                eleminbtn = document.getElementById("rong-widget-minbtn-kefu");
            }
            if (defaultStyle) {
                eleconversation.style["height"] = defaultStyle.height + "px";
                eleconversation.style["width"] = defaultStyle.width + "px";
                eleconversationlist.style["height"] = defaultStyle.height + "px";
                if (defaultStyle.positionFixed) {
                    eleconversationlist.style['position'] = "fixed";
                    eleminbtn.style['position'] = "fixed";
                    eleconversation.style['position'] = "fixed";
                }
                else {
                    eleconversationlist.style['position'] = "absolute";
                    eleminbtn.style['position'] = "absolute";
                    eleconversation.style['position'] = "absolute";
                }
                if (_this.widgetConfig.displayConversationList) {
                    eleminbtn.style["display"] = "inline-block";
                    eleconversationlist.style["display"] = "inline-block";
                    if (_this.widgetConfig.conversationListPosition == RongWebIMWidget.EnumConversationListPosition.left) {
                        if (!isNaN(defaultStyle.left)) {
                            eleconversationlist.style["left"] = defaultStyle.left + "px";
                            eleminbtn.style["left"] = defaultStyle.left + "px";
                            eleconversation.style["left"] = defaultStyle.left + eleConversationListWidth + spacing + "px";
                        }
                        if (!isNaN(defaultStyle.right)) {
                            eleconversationlist.style["right"] = defaultStyle.right + defaultStyle.width + spacing + "px";
                            eleminbtn.style["right"] = defaultStyle.right + defaultStyle.width + spacing + "px";
                            eleconversation.style["right"] = defaultStyle.right + "px";
                        }
                    }
                    else if (_this.widgetConfig.conversationListPosition == RongWebIMWidget.EnumConversationListPosition.right) {
                        if (!isNaN(defaultStyle.left)) {
                            eleconversationlist.style["left"] = defaultStyle.left + defaultStyle.width + spacing + "px";
                            eleminbtn.style["left"] = defaultStyle.left + defaultStyle.width + spacing + "px";
                            eleconversation.style["left"] = defaultStyle.left + "px";
                        }
                        if (!isNaN(defaultStyle.right)) {
                            eleconversationlist.style["right"] = defaultStyle.right + "px";
                            eleminbtn.style["right"] = defaultStyle.right + "px";
                            eleconversation.style["right"] = defaultStyle.right + eleConversationListWidth + spacing + "px";
                        }
                    }
                    else {
                        throw new Error("config conversationListPosition value is invalid");
                    }
                    if (!isNaN(defaultStyle["top"])) {
                        eleconversationlist.style["top"] = defaultStyle.top + "px";
                        eleminbtn.style["top"] = defaultStyle.top + defaultStyle.height - eleminbtnHeight + "px";
                        eleconversation.style["top"] = defaultStyle.top + "px";
                    }
                    if (!isNaN(defaultStyle["bottom"])) {
                        eleconversationlist.style["bottom"] = defaultStyle.bottom + "px";
                        eleminbtn.style["bottom"] = defaultStyle.bottom + "px";
                        eleconversation.style["bottom"] = defaultStyle.bottom + "px";
                    }
                }
                else {
                    eleminbtn.style["display"] = "inline-block";
                    eleconversationlist.style["display"] = "none";
                    eleconversation.style["left"] = defaultStyle["left"] + "px";
                    eleconversation.style["right"] = defaultStyle["right"] + "px";
                    eleconversation.style["top"] = defaultStyle["top"] + "px";
                    eleconversation.style["bottom"] = defaultStyle["bottom"] + "px";
                    eleminbtn.style["top"] = defaultStyle.top + defaultStyle.height - eleminbtnHeight + "px";
                    eleminbtn.style["bottom"] = defaultStyle.bottom + "px";
                    eleminbtn.style["left"] = defaultStyle.left + defaultStyle.width / 2 - eleminbtnWidth / 2 + "px";
                    eleminbtn.style["right"] = defaultStyle.right + defaultStyle.width / 2 - eleminbtnWidth / 2 + "px";
                }
            }
            if (_this.widgetConfig.displayMinButton == false) {
                eleminbtn.style["display"] = "none";
            }
            else {
                eleminbtn.style["display"] = "block";
            }
        };
        WebIMWidget.prototype.init = function (config) {
            var _this = this;
            this.isInit = true;
            config.reminder && (_this.widgetConfig.reminder = config.reminder);
            if (!window.RongIMLib || !window.RongIMLib.RongIMClient) {
                _this.widgetConfig._config = config;
                return;
            }
            var defaultStyle = _this.widgetConfig.style;
            angular.extend(_this.widgetConfig, config);
            _this.widgetConfig.style = angular.extend(defaultStyle, config.style);
            if (config.desktopNotification) {
                RongWebIMWidget.NotificationHelper.requestPermission();
            }
            var eleplaysound = document.getElementById("rongcloud-playsound");
            if (eleplaysound && typeof _this.widgetConfig.voiceUrl === "string") {
                eleplaysound["src"] = _this.widgetConfig.voiceUrl;
                _this.widgetConfig.voiceNotification = true;
            }
            else {
                _this.widgetConfig.voiceNotification = false;
            }
            if (this.isReady) {
                _this.initStyle(defaultStyle);
            }
            else {
                _this.onReady = function () {
                    _this.initStyle(defaultStyle);
                };
            }
            _this.conversationListServer.setHiddenConversations(_this.widgetConfig.hiddenConversations);
            _this.RongIMSDKServer.init(_this.widgetConfig.appkey);
            if (RongIMLib.RongIMEmoji) {
                RongIMLib.RongIMEmoji.init();
            }
            if (RongIMLib.RongIMVoice) {
                RongIMLib.RongIMVoice.init();
            }
            _this.RongIMSDKServer.registerMessage();
            _this.RongIMSDKServer.connect(_this.widgetConfig.token).then(function (userId) {
                _this.conversationListServer.updateConversations();
                _this.conversationListServer.startRefreshOnlineStatus();
                _this.conversationServer._handleConnectSuccess && _this.conversationServer._handleConnectSuccess();
                if (RongWebIMWidget.Helper.checkType(_this.widgetConfig.onSuccess) == "function") {
                    _this.widgetConfig.onSuccess(userId);
                }
                if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function") {
                    _this.providerdata.getUserInfo(userId, {
                        onSuccess: function (data) {
                            _this.providerdata.currentUserInfo =
                                new RongWebIMWidget.UserInfo(data.userId, data.name, data.portraitUri);
                        }
                    });
                }
                //_this.conversationServer._onConnectSuccess();
            }, function (err) {
                if (err.tokenError) {
                    if (_this.widgetConfig.onError && typeof _this.widgetConfig.onError == "function") {
                        _this.widgetConfig.onError({ code: 0, info: "token 无效" });
                    }
                }
                else {
                    if (_this.widgetConfig.onError && typeof _this.widgetConfig.onError == "function") {
                        _this.widgetConfig.onError({ code: err.errorCode });
                    }
                }
            });
            _this.RongIMSDKServer.setConnectionStatusListener({
                onChanged: function (status) {
                    _this.providerdata.connectionState = false;
                    switch (status) {
                        //链接成功
                        case RongIMLib.ConnectionStatus.CONNECTED:
                            _this.$log.debug('链接成功');
                            _this.providerdata.connectionState = true;
                            break;
                        //正在链接
                        case RongIMLib.ConnectionStatus.CONNECTING:
                            _this.$log.debug('正在链接');
                            break;
                        //其他设备登陆
                        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                            _this.$log.debug('其他设备登录');
                            break;
                        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                            _this.$log.debug("网络不可用");
                            break;
                        default:
                            _this.$log.debug(status);
                    }
                }
            });
            _this.RongIMSDKServer.setOnReceiveMessageListener({
                onReceived: function (data) {
                    _this.$log.debug(data);
                    var msg = RongWebIMWidget.Message.convert(data);
                    if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function" && msg.content && !data.content.user) {
                        _this.providerdata.getUserInfo(msg.senderUserId, {
                            onSuccess: function (data) {
                                if (data) {
                                    msg.content.userInfo = new RongWebIMWidget.UserInfo(data.userId, data.name, data.portraitUri);
                                }
                            }
                        });
                    }
                    switch (data.messageType) {
                        case RongWebIMWidget.MessageType.VoiceMessage:
                            msg.content.isUnReade = true;
                        case RongWebIMWidget.MessageType.TextMessage:
                        case RongWebIMWidget.MessageType.LocationMessage:
                        case RongWebIMWidget.MessageType.ImageMessage:
                        case RongWebIMWidget.MessageType.RichContentMessage:
                            _this.addMessageAndOperation(msg);
                            var voiceBase = _this.providerdata.voiceSound == true
                                && eleplaysound
                                && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                                && _this.widgetConfig.voiceNotification;
                            var currentConvversationBase = _this.conversationServer.current
                                && _this.conversationServer.current.targetType == msg.conversationType
                                && _this.conversationServer.current.targetId == msg.targetId;
                            var notificationBase = (document.hidden || !_this.display)
                                && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                                && _this.widgetConfig.desktopNotification;
                            if ((_this.widgetConfig.displayConversationList && voiceBase) || (!_this.widgetConfig.displayConversationList && voiceBase && currentConvversationBase)) {
                                eleplaysound["play"]();
                            }
                            if ((notificationBase && _this.widgetConfig.displayConversationList) || (!_this.widgetConfig.displayConversationList && notificationBase && currentConvversationBase)) {
                                RongWebIMWidget.NotificationHelper.showNotification({
                                    title: msg.content.userInfo.name,
                                    icon: "",
                                    body: RongWebIMWidget.Message.messageToNotification(data), data: { targetId: msg.targetId, targetType: msg.conversationType }
                                });
                            }
                            break;
                        case RongWebIMWidget.MessageType.ContactNotificationMessage:
                            //好友通知自行处理
                            break;
                        case RongWebIMWidget.MessageType.InformationNotificationMessage:
                            _this.addMessageAndOperation(msg);
                            break;
                        case RongWebIMWidget.MessageType.UnknownMessage:
                            //未知消息自行处理
                            break;
                        case RongWebIMWidget.MessageType.ReadReceiptMessage:
                            if (data.messageDirection == RongWebIMWidget.MessageDirection.SEND) {
                                _this.RongIMSDKServer.clearUnreadCount(data.conversationType, data.targetId);
                            }
                            break;
                        case 'HandShakeResponseMessage':
                            _this.HandShakeResponseMessage(data);
                            break;
                        case 'ChangeModeResponseMessage':
                            _this.ChangeModeResponseMessage(data);
                            break;
                        case 'TerminateMessage':
                            _this.TerminateMessage(data);
                            break;
                        case 'CustomerStatusUpdateMessage':
                            _this.CustomerStatusUpdateMessage(data);
                            break;
                        default:
                            //未捕获的消息类型
                            break;
                    }
                    if (_this.onReceivedMessage) {
                        _this.onReceivedMessage(data);
                    }
                    _this.conversationServer.handleMessage(msg);
                    if (!document.hidden && _this.display
                        && _this.conversationServer.current
                        && _this.conversationServer.current.targetType == msg.conversationType
                        && _this.conversationServer.current.targetId == msg.targetId
                        && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                        && data.messageType != RongWebIMWidget.MessageType.ReadReceiptMessage) {
                        _this.RongIMSDKServer.clearUnreadCount(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId);
                        _this.RongIMSDKServer.sendReadReceiptMessage(_this.conversationServer.current.targetId, _this.conversationServer.current.targetType);
                    }
                    _this.conversationListServer.updateConversations().then(function () { });
                }
            });
            window.onfocus = function () {
                if (_this.conversationServer.current && _this.conversationServer.current.targetId && _this.display) {
                    _this.RongIMSDKServer.getConversation(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId).then(function (conv) {
                        if (conv && conv.unreadMessageCount > 0) {
                            _this.RongIMSDKServer.clearUnreadCount(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId);
                            _this.RongIMSDKServer.sendReadReceiptMessage(_this.conversationServer.current.targetId, _this.conversationServer.current.targetType);
                            _this.conversationListServer.updateConversations().then(function () { });
                        }
                    });
                }
            };
        };
        WebIMWidget.prototype.HandShakeResponseMessage = function (message) {
            var type = message.conversationType;
            var id = message.targetId;
            var current = this.conversationServer.getCacheCustomService(type, id);
            if (current) {
                angular.merge(current, message.content.data);
                current.connected = true;
                if (message.content.data.serviceType == "1") {
                    current.inputPanelState = RongWebIMWidget.EnumInputPanelType.robot;
                }
                else if (message.content.data.serviceType == "3") {
                    current.inputPanelState = RongWebIMWidget.EnumInputPanelType.robotSwitchPerson;
                }
                else {
                    current.inputPanelState = RongWebIMWidget.EnumInputPanelType.person;
                }
            }
        };
        WebIMWidget.prototype.ChangeModeResponseMessage = function (message) {
            var type = message.conversationType;
            var id = message.targetId;
            var current = this.conversationServer.getCacheCustomService(type, id);
            if (current) {
                switch (message.content.data.status) {
                    case 1:
                        current.inputPanelState = RongWebIMWidget.EnumInputPanelType.person;
                        break;
                    case 2:
                        if (current.type == "2") {
                            current.inputPanelState = RongWebIMWidget.EnumInputPanelType.person;
                        }
                        else if (current.type == "1" || current.type == "3") {
                            current.inputPanelState = RongWebIMWidget.EnumInputPanelType.robotSwitchPerson;
                        }
                        break;
                    case 3:
                        current.inputPanelState = RongWebIMWidget.EnumInputPanelType.robot;
                        break;
                    case 4:
                        current.inputPanelState = RongWebIMWidget.EnumInputPanelType.person;
                        break;
                    default:
                        break;
                }
            }
        };
        WebIMWidget.prototype.TerminateMessage = function (message) {
            var type = message.conversationType;
            var id = message.targetId;
            var current = this.conversationServer.getCacheCustomService(type, id);
            current.connected = false;
            if (current && message.content.code != 0) {
                if (current.type == "1") {
                    current.inputPanelState = RongWebIMWidget.EnumInputPanelType.robot;
                }
                else {
                    current.inputPanelState = RongWebIMWidget.EnumInputPanelType.robotSwitchPerson;
                }
            }
        };
        WebIMWidget.prototype.CustomerStatusUpdateMessage = function (message) {
            var type = message.conversationType;
            var id = message.targetId;
            var current = this.conversationServer.getCacheCustomService(type, id);
            if (current) {
                switch (Number(message.content.serviceStatus)) {
                    case 1:
                        if (current.type == "1") {
                            current.inputPanelState = RongWebIMWidget.EnumInputPanelType.robot;
                        }
                        else {
                            current.inputPanelState = RongWebIMWidget.EnumInputPanelType.robotSwitchPerson;
                        }
                        break;
                    case 2:
                        current.inputPanelState = RongWebIMWidget.EnumInputPanelType.person;
                        break;
                    case 3:
                        current.inputPanelState = RongWebIMWidget.EnumInputPanelType.notService;
                        break;
                    default:
                        break;
                }
            }
        };
        WebIMWidget.prototype.addMessageAndOperation = function (msg) {
            if (msg.conversationType === RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && !this.conversationServer._customService.connected) {
                //客服没有连接直接返回不追加显示消息
                return;
            }
            var key = msg.conversationType + "_" + msg.targetId;
            var hislist = this.conversationServer._cacheHistory[key] = this.conversationServer._cacheHistory[key] || [];
            if (hislist.length == 0) {
                hislist.push(new RongWebIMWidget.GetHistoryPanel());
                hislist.push(new RongWebIMWidget.TimePanl(msg.sentTime));
            }
            this.conversationServer._addHistoryMessages(msg);
        };
        WebIMWidget.prototype.setConversation = function (targetType, targetId, title) {
            this.conversationServer.changeConversation(new RongWebIMWidget.Conversation(targetType, targetId, title));
        };
        WebIMWidget.prototype.setUserInfoProvider = function (fun) {
            this.providerdata.getUserInfo = fun;
        };
        WebIMWidget.prototype.setGroupInfoProvider = function (fun) {
            this.providerdata.getGroupInfo = fun;
        };
        WebIMWidget.prototype.setOnlineStatusProvider = function (fun) {
            this.providerdata.getOnlineStatus = fun;
        };
        WebIMWidget.prototype.setProductInfo = function (obj) {
            if (this.conversationServer._customService.connected) {
                this.RongIMSDKServer.sendProductInfo(this.conversationServer.current.targetId, obj);
            }
            else {
                this.providerdata._productInfo = obj;
            }
        };
        WebIMWidget.prototype.show = function () {
            this.display = true;
        };
        WebIMWidget.prototype.hidden = function () {
            this.display = false;
        };
        WebIMWidget.prototype.getCurrentConversation = function () {
            return this.conversationServer.current;
        };
        WebIMWidget.$inject = ["$q",
            "ConversationServer",
            "ConversationListServer",
            "ProviderData",
            "WidgetConfig",
            "RongIMSDKServer",
            "$log"];
        return WebIMWidget;
    })();
    RongWebIMWidget.WebIMWidget = WebIMWidget;
    angular.module("RongWebIMWidget")
        .service("WebIMWidget", WebIMWidget);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var Position;
    (function (Position) {
        Position[Position["left"] = 1] = "left";
        Position[Position["right"] = 2] = "right";
    })(Position || (Position = {}));
    var RongCustomerService = (function () {
        function RongCustomerService(WebIMWidget) {
            this.WebIMWidget = WebIMWidget;
            this.defaultconfig = {
                __isCustomerService: true
            };
            this.Position = Position;
        }
        RongCustomerService.prototype.init = function (config) {
            var _this = this;
            angular.extend(this.defaultconfig, config);
            var style = {
                right: 20
            };
            if (config.position) {
                if (config.position == Position.left) {
                    style = {
                        left: 20,
                        bottom: 0,
                        width: 325,
                        positionFixed: true
                    };
                }
                else {
                    style = {
                        right: 20,
                        bottom: 0,
                        width: 325,
                        positionFixed: true
                    };
                }
            }
            if (config.style) {
                config.style.width && (style.width = config.style.width);
                config.style.height && (style.height = config.style.height);
            }
            this.defaultconfig.style = style;
            _this.WebIMWidget.init(this.defaultconfig);
            _this.WebIMWidget.onShow = function () {
                _this.WebIMWidget.setConversation(RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE, config.customerServiceId, "客服");
            };
        };
        RongCustomerService.prototype.show = function () {
            this.WebIMWidget.show();
        };
        RongCustomerService.prototype.setProductInfo = function (obj) {
            this.WebIMWidget.setProductInfo(obj);
        };
        RongCustomerService.prototype.hidden = function () {
            this.WebIMWidget.hidden();
        };
        RongCustomerService.$inject = ["WebIMWidget"];
        return RongCustomerService;
    })();
    RongWebIMWidget.RongCustomerService = RongCustomerService;
    angular.module("RongWebIMWidget")
        .service("RongCustomerService", RongCustomerService);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var Evaluate;
(function (Evaluate) {
    var evaluatedir = (function () {
        function evaluatedir($timeout) {
            this.$timeout = $timeout;
            this.restrict = "E";
            this.scope = {
                type: "=",
                display: "=",
                enter: "&confirm",
                dcancle: "&cancle"
            };
            this.templateUrl = './ts/evaluate/evaluate.tpl.html';
            evaluatedir.prototype["link"] = function (scope, ele) {
                var stars = [false, false, false, false, false];
                var labels = [{ display: "答非所问" }, { display: "理解能力差" }, { display: "一问三不知" }, { display: "不礼貌" }];
                var enterStars = false; //鼠标悬浮样式
                scope.stars = stars;
                scope.labels = RongWebIMWidget.Helper.cloneObject(labels);
                scope.end = false;
                scope.displayDescribe = false;
                scope.data = {
                    stars: 0,
                    value: 0,
                    describe: "",
                    label: ""
                };
                scope.$watch("display", function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    else {
                        enterStars = false;
                        scope.displayDescribe = false;
                        scope.labels = RongWebIMWidget.Helper.cloneObject(labels);
                        scope.data = {
                            stars: 0,
                            value: 0,
                            describe: "",
                            label: ""
                        };
                    }
                });
                scope.mousehover = function (data) {
                    !enterStars && (scope.data.stars = data);
                };
                scope.confirm = function (data) {
                    if (data != undefined) {
                        enterStars = true;
                        if (scope.type == 1) {
                            scope.data.stars = data;
                            if (scope.data.stars != 5) {
                                scope.displayDescribe = true;
                            }
                            else {
                                callbackConfirm(scope.data);
                            }
                        }
                        else {
                            scope.data.value = data;
                            if (scope.data.value === false) {
                                scope.displayDescribe = true;
                            }
                            else {
                                callbackConfirm(scope.data);
                            }
                        }
                    }
                    else {
                        callbackConfirm(null);
                    }
                };
                scope.commit = function () {
                    var value = [];
                    for (var i = 0, len = scope.labels.length; i < len; i++) {
                        if (scope.labels[i].selected) {
                            value.push(scope.labels[i].display);
                        }
                    }
                    scope.data.label = value;
                    callbackConfirm(scope.data);
                };
                scope.cancle = function () {
                    scope.display = false;
                    scope.dcancle();
                };
                function callbackConfirm(data) {
                    scope.end = true;
                    if (data) {
                        $timeout(function () {
                            scope.display = false;
                            scope.end = false;
                            scope.enter({ data: data });
                        }, 800);
                    }
                    else {
                        scope.display = false;
                        scope.end = false;
                        scope.enter({ data: data });
                    }
                }
            };
        }
        evaluatedir.$inject = ["$timeout"];
        return evaluatedir;
    })();
    angular.module("Evaluate", [])
        .directive("evaluatedir", RongWebIMWidget.DirectiveFactory.GetFactoryFor(evaluatedir));
})(Evaluate || (Evaluate = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    runApp.$inject = ["$http", "WebIMWidget", "WidgetConfig", "RongCustomerService"];
    function runApp($http, WebIMWidget, WidgetConfig, RongCustomerService) {
    }
    var rongWidget = (function () {
        function rongWidget() {
            this.restrict = "E";
            this.templateUrl = "./ts/main.tpl.html";
            this.controller = "rongWidgetController";
        }
        return rongWidget;
    })();
    var rongWidgetController = (function () {
        function rongWidgetController($scope, $interval, WebIMWidget, WidgetConfig, providerdata, conversationServer, conversationListServer, RongIMSDKServer) {
            this.$scope = $scope;
            this.$interval = $interval;
            this.WebIMWidget = WebIMWidget;
            this.WidgetConfig = WidgetConfig;
            this.providerdata = providerdata;
            this.conversationServer = conversationServer;
            this.conversationListServer = conversationListServer;
            this.RongIMSDKServer = RongIMSDKServer;
            $scope.main = WebIMWidget;
            $scope.config = WidgetConfig;
            $scope.data = providerdata;
            var voicecookie = RongWebIMWidget.Helper.CookieHelper.getCookie("rongcloud.voiceSound");
            providerdata.voiceSound = voicecookie ? (voicecookie == "true") : true;
            $scope.$watch("data.voiceSound", function (newVal, oldVal) {
                if (newVal === oldVal)
                    return;
                RongWebIMWidget.Helper.CookieHelper.setCookie("rongcloud.voiceSound", newVal);
            });
            var interval = null;
            $scope.$watch("data.totalUnreadCount", function (newVal, oldVal) {
                if (newVal > 0) {
                    interval && $interval.cancel(interval);
                    interval = $interval(function () {
                        $scope.twinkle = !$scope.twinkle;
                    }, 1000);
                }
                else {
                    $interval.cancel(interval);
                }
            });
            $scope.$watch("main.display", function () {
                if (conversationServer.current && conversationServer.current.targetId && WebIMWidget.display) {
                    RongIMSDKServer.getConversation(conversationServer.current.targetType, conversationServer.current.targetId).then(function (conv) {
                        if (conv && conv.unreadMessageCount > 0) {
                            RongIMSDKServer.clearUnreadCount(conversationServer.current.targetType, conversationServer.current.targetId);
                            RongIMSDKServer.sendReadReceiptMessage(conversationServer.current.targetId, conversationServer.current.targetType);
                            conversationListServer.updateConversations().then(function () { });
                        }
                    });
                }
            });
            WebIMWidget.show = function () {
                WebIMWidget.display = true;
                WebIMWidget.fullScreen = false;
                WebIMWidget.onShow && WebIMWidget.onShow();
                setTimeout(function () {
                    $scope.$apply();
                });
            };
            WebIMWidget.hidden = function () {
                WebIMWidget.display = false;
                setTimeout(function () {
                    $scope.$apply();
                });
            };
            $scope.showbtn = function () {
                WebIMWidget.display = true;
                WebIMWidget.onShow && WebIMWidget.onShow();
            };
        }
        rongWidgetController.$inject = ["$scope",
            "$interval",
            "WebIMWidget",
            "WidgetConfig",
            "ProviderData",
            "ConversationServer",
            "ConversationListServer",
            "RongIMSDKServer"
        ];
        return rongWidgetController;
    })();
    angular.module("RongWebIMWidget").run(runApp)
        .directive("rongWidget", RongWebIMWidget.DirectiveFactory.GetFactoryFor(rongWidget))
        .controller("rongWidgetController", rongWidgetController);
    ;
})(RongWebIMWidget || (RongWebIMWidget = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RongWebIMWidget;
(function (RongWebIMWidget) {
    (function (EnumConversationListPosition) {
        EnumConversationListPosition[EnumConversationListPosition["left"] = 0] = "left";
        EnumConversationListPosition[EnumConversationListPosition["right"] = 1] = "right";
    })(RongWebIMWidget.EnumConversationListPosition || (RongWebIMWidget.EnumConversationListPosition = {}));
    var EnumConversationListPosition = RongWebIMWidget.EnumConversationListPosition;
    (function (EnumConversationType) {
        EnumConversationType[EnumConversationType["PRIVATE"] = 1] = "PRIVATE";
        EnumConversationType[EnumConversationType["DISCUSSION"] = 2] = "DISCUSSION";
        EnumConversationType[EnumConversationType["GROUP"] = 3] = "GROUP";
        EnumConversationType[EnumConversationType["CHATROOM"] = 4] = "CHATROOM";
        EnumConversationType[EnumConversationType["CUSTOMER_SERVICE"] = 5] = "CUSTOMER_SERVICE";
        EnumConversationType[EnumConversationType["SYSTEM"] = 6] = "SYSTEM";
        EnumConversationType[EnumConversationType["APP_PUBLIC_SERVICE"] = 7] = "APP_PUBLIC_SERVICE";
        EnumConversationType[EnumConversationType["PUBLIC_SERVICE"] = 8] = "PUBLIC_SERVICE";
    })(RongWebIMWidget.EnumConversationType || (RongWebIMWidget.EnumConversationType = {}));
    var EnumConversationType = RongWebIMWidget.EnumConversationType;
    (function (MessageDirection) {
        MessageDirection[MessageDirection["SEND"] = 1] = "SEND";
        MessageDirection[MessageDirection["RECEIVE"] = 2] = "RECEIVE";
    })(RongWebIMWidget.MessageDirection || (RongWebIMWidget.MessageDirection = {}));
    var MessageDirection = RongWebIMWidget.MessageDirection;
    (function (ReceivedStatus) {
        ReceivedStatus[ReceivedStatus["READ"] = 1] = "READ";
        ReceivedStatus[ReceivedStatus["LISTENED"] = 2] = "LISTENED";
        ReceivedStatus[ReceivedStatus["DOWNLOADED"] = 4] = "DOWNLOADED";
    })(RongWebIMWidget.ReceivedStatus || (RongWebIMWidget.ReceivedStatus = {}));
    var ReceivedStatus = RongWebIMWidget.ReceivedStatus;
    (function (SentStatus) {
        /**
         * 发送中。
         */
        SentStatus[SentStatus["SENDING"] = 10] = "SENDING";
        /**
         * 发送失败。
         */
        SentStatus[SentStatus["FAILED"] = 20] = "FAILED";
        /**
         * 已发送。
         */
        SentStatus[SentStatus["SENT"] = 30] = "SENT";
        /**
         * 对方已接收。
         */
        SentStatus[SentStatus["RECEIVED"] = 40] = "RECEIVED";
        /**
         * 对方已读。
         */
        SentStatus[SentStatus["READ"] = 50] = "READ";
        /**
         * 对方已销毁。
         */
        SentStatus[SentStatus["DESTROYED"] = 60] = "DESTROYED";
    })(RongWebIMWidget.SentStatus || (RongWebIMWidget.SentStatus = {}));
    var SentStatus = RongWebIMWidget.SentStatus;
    var AnimationType;
    (function (AnimationType) {
        AnimationType[AnimationType["left"] = 1] = "left";
        AnimationType[AnimationType["right"] = 2] = "right";
        AnimationType[AnimationType["top"] = 3] = "top";
        AnimationType[AnimationType["bottom"] = 4] = "bottom";
    })(AnimationType || (AnimationType = {}));
    (function (EnumInputPanelType) {
        EnumInputPanelType[EnumInputPanelType["person"] = 0] = "person";
        EnumInputPanelType[EnumInputPanelType["robot"] = 1] = "robot";
        EnumInputPanelType[EnumInputPanelType["robotSwitchPerson"] = 2] = "robotSwitchPerson";
        EnumInputPanelType[EnumInputPanelType["notService"] = 4] = "notService";
    })(RongWebIMWidget.EnumInputPanelType || (RongWebIMWidget.EnumInputPanelType = {}));
    var EnumInputPanelType = RongWebIMWidget.EnumInputPanelType;
    (function (EnumCustomerStatus) {
        EnumCustomerStatus[EnumCustomerStatus["person"] = 1] = "person";
        EnumCustomerStatus[EnumCustomerStatus["robot"] = 2] = "robot";
    })(RongWebIMWidget.EnumCustomerStatus || (RongWebIMWidget.EnumCustomerStatus = {}));
    var EnumCustomerStatus = RongWebIMWidget.EnumCustomerStatus;
    RongWebIMWidget.MessageType = {
        DiscussionNotificationMessage: "DiscussionNotificationMessage ",
        TextMessage: "TextMessage",
        ImageMessage: "ImageMessage",
        VoiceMessage: "VoiceMessage",
        RichContentMessage: "RichContentMessage",
        HandshakeMessage: "HandshakeMessage",
        UnknownMessage: "UnknownMessage",
        SuspendMessage: "SuspendMessage",
        LocationMessage: "LocationMessage",
        InformationNotificationMessage: "InformationNotificationMessage",
        ContactNotificationMessage: "ContactNotificationMessage",
        ProfileNotificationMessage: "ProfileNotificationMessage",
        CommandNotificationMessage: "CommandNotificationMessage",
        HandShakeResponseMessage: "HandShakeResponseMessage",
        ChangeModeResponseMessage: "ChangeModeResponseMessage",
        TerminateMessage: "TerminateMessage",
        CustomerStatusUpdateMessage: "CustomerStatusUpdateMessage",
        ReadReceiptMessage: "ReadReceiptMessage"
    };
    (function (PanelType) {
        PanelType[PanelType["Message"] = 1] = "Message";
        PanelType[PanelType["InformationNotification"] = 2] = "InformationNotification";
        PanelType[PanelType["System"] = 103] = "System";
        PanelType[PanelType["Time"] = 104] = "Time";
        PanelType[PanelType["getHistory"] = 105] = "getHistory";
        PanelType[PanelType["getMore"] = 106] = "getMore";
        PanelType[PanelType["Other"] = 0] = "Other";
    })(RongWebIMWidget.PanelType || (RongWebIMWidget.PanelType = {}));
    var PanelType = RongWebIMWidget.PanelType;
    var ChatPanel = (function () {
        function ChatPanel(type) {
            this.panelType = type;
        }
        return ChatPanel;
    })();
    RongWebIMWidget.ChatPanel = ChatPanel;
    var TimePanl = (function (_super) {
        __extends(TimePanl, _super);
        function TimePanl(date) {
            _super.call(this, PanelType.Time);
            this.sentTime = date;
        }
        return TimePanl;
    })(ChatPanel);
    RongWebIMWidget.TimePanl = TimePanl;
    var GetHistoryPanel = (function (_super) {
        __extends(GetHistoryPanel, _super);
        function GetHistoryPanel() {
            _super.call(this, PanelType.getHistory);
        }
        return GetHistoryPanel;
    })(ChatPanel);
    RongWebIMWidget.GetHistoryPanel = GetHistoryPanel;
    var GetMoreMessagePanel = (function (_super) {
        __extends(GetMoreMessagePanel, _super);
        function GetMoreMessagePanel() {
            _super.call(this, PanelType.getMore);
        }
        return GetMoreMessagePanel;
    })(ChatPanel);
    RongWebIMWidget.GetMoreMessagePanel = GetMoreMessagePanel;
    var TimePanel = (function (_super) {
        __extends(TimePanel, _super);
        function TimePanel(time) {
            _super.call(this, PanelType.Time);
            this.sentTime = time;
        }
        return TimePanel;
    })(ChatPanel);
    RongWebIMWidget.TimePanel = TimePanel;
    var Message = (function (_super) {
        __extends(Message, _super);
        function Message(content, conversationType, extra, objectName, messageDirection, messageId, receivedStatus, receivedTime, senderUserId, sentStatus, sentTime, targetId, messageType) {
            _super.call(this, PanelType.Message);
        }
        Message.convert = function (SDKmsg) {
            var msg = new Message();
            msg.conversationType = SDKmsg.conversationType;
            msg.extra = SDKmsg.extra;
            msg.objectName = SDKmsg.objectName;
            msg.messageDirection = SDKmsg.messageDirection;
            msg.messageId = SDKmsg.messageId;
            msg.receivedStatus = SDKmsg.receivedStatus;
            msg.receivedTime = new Date(SDKmsg.receivedTime);
            msg.senderUserId = SDKmsg.senderUserId;
            msg.sentStatus = SDKmsg.sendStatusMessage;
            msg.sentTime = new Date(SDKmsg.sentTime);
            msg.targetId = SDKmsg.targetId;
            msg.messageType = SDKmsg.messageType;
            switch (msg.messageType) {
                case RongWebIMWidget.MessageType.TextMessage:
                    var texmsg = new TextMessage();
                    var content = SDKmsg.content.content;
                    content = RongWebIMWidget.Helper.escapeSymbol.encodeHtmlsymbol(content);
                    content = RongWebIMWidget.Helper.discernUrlEmailInStr(content);
                    if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.emojiToHTML) {
                        content = RongIMLib.RongIMEmoji.emojiToHTML(content);
                    }
                    texmsg.content = content;
                    texmsg.extra = SDKmsg.content.extra;
                    msg.content = texmsg;
                    break;
                case RongWebIMWidget.MessageType.ImageMessage:
                    var image = new ImageMessage();
                    var content = SDKmsg.content.content || "";
                    if (content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    image.content = content;
                    image.imageUri = SDKmsg.content.imageUri;
                    image.extra = SDKmsg.content.extra;
                    msg.content = image;
                    break;
                case RongWebIMWidget.MessageType.VoiceMessage:
                    var voice = new VoiceMessage();
                    voice.content = SDKmsg.content.content;
                    voice.duration = SDKmsg.content.duration;
                    voice.extra = SDKmsg.content.extra;
                    msg.content = voice;
                    break;
                case RongWebIMWidget.MessageType.RichContentMessage:
                    var rich = new RichContentMessage();
                    rich.content = SDKmsg.content.content;
                    rich.title = SDKmsg.content.title;
                    rich.imageUri = SDKmsg.content.imageUri;
                    rich.extra = SDKmsg.content.extra;
                    msg.content = rich;
                    break;
                case RongWebIMWidget.MessageType.LocationMessage:
                    var location = new LocationMessage();
                    var content = SDKmsg.content.content || "";
                    if (content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    location.content = content;
                    location.latiude = SDKmsg.content.latiude;
                    location.longitude = SDKmsg.content.longitude;
                    location.poi = SDKmsg.content.poi;
                    location.extra = SDKmsg.content.extra;
                    msg.content = location;
                    break;
                case RongWebIMWidget.MessageType.InformationNotificationMessage:
                    var info = new InformationNotificationMessage();
                    msg.panelType = 2; //灰条消息
                    info.content = SDKmsg.content.message;
                    msg.content = info;
                    break;
                case RongWebIMWidget.MessageType.DiscussionNotificationMessage:
                    var discussion = new DiscussionNotificationMessage();
                    discussion.extension = SDKmsg.content.extension;
                    discussion.operation = SDKmsg.content.operation;
                    discussion.type = SDKmsg.content.type;
                    discussion.isHasReceived = SDKmsg.content.isHasReceived;
                    msg.content = discussion;
                case RongWebIMWidget.MessageType.HandShakeResponseMessage:
                    var handshak = new HandShakeResponseMessage();
                    handshak.status = SDKmsg.content.status;
                    handshak.msg = SDKmsg.content.msg;
                    handshak.data = SDKmsg.content.data;
                    msg.content = handshak;
                    break;
                case RongWebIMWidget.MessageType.ChangeModeResponseMessage:
                    var change = new ChangeModeResponseMessage();
                    change.code = SDKmsg.content.code;
                    change.data = SDKmsg.content.data;
                    change.status = SDKmsg.content.status;
                    msg.content = change;
                    break;
                case RongWebIMWidget.MessageType.CustomerStatusUpdateMessage:
                    var up = new CustomerStatusUpdateMessage();
                    up.serviceStatus = SDKmsg.content.serviceStatus;
                    msg.content = up;
                    break;
                case RongWebIMWidget.MessageType.TerminateMessage:
                    var ter = new TerminateMessage();
                    ter.code = SDKmsg.content.code;
                    msg.content = ter;
                    break;
                default:
                    break;
            }
            if (msg.content) {
                msg.content.userInfo = SDKmsg.content.user;
            }
            return msg;
        };
        Message.messageToNotification = function (msg) {
            if (!msg)
                return null;
            var msgtype = msg.messageType, msgContent;
            if (msgtype == RongWebIMWidget.MessageType.ImageMessage) {
                msgContent = "[图片]";
            }
            else if (msgtype == RongWebIMWidget.MessageType.LocationMessage) {
                msgContent = "[位置]";
            }
            else if (msgtype == RongWebIMWidget.MessageType.VoiceMessage) {
                msgContent = "[语音]";
            }
            else if (msgtype == RongWebIMWidget.MessageType.ContactNotificationMessage || msgtype == RongWebIMWidget.MessageType.CommandNotificationMessage) {
                msgContent = "[通知消息]";
            }
            else if (msg.objectName == "RC:GrpNtf") {
                var data = msg.content.message.content.data.data;
                switch (msg.content.message.content.operation) {
                    case "Add":
                        msgContent = data.targetUserDisplayNames ? (data.targetUserDisplayNames.join("、") + " 加入了群组") : "加入群组";
                        break;
                    case "Quit":
                        msgContent = data.operatorNickname + " 退出了群组";
                        break;
                    case "Kicked":
                        msgContent = data.targetUserDisplayNames ? (data.targetUserDisplayNames.join("、") + " 被剔出群组") : "移除群组";
                        break;
                    case "Rename":
                        msgContent = data.operatorNickname + " 修改了群名称";
                        break;
                    case "Create":
                        msgContent = data.operatorNickname + " 创建了群组";
                        break;
                    case "Dismiss":
                        msgContent = data.operatorNickname + " 解散了群组 " + data.targetGroupName;
                        break;
                    default:
                        break;
                }
            }
            else {
                msgContent = msg.content ? msg.content.content : "";
                msgContent = RongIMLib.RongIMEmoji.emojiToSymbol(msgContent);
                msgContent = msgContent.replace(/\n/g, " ");
                msgContent = msgContent.replace(/([\w]{49,50})/g, "$1 ");
            }
            return msgContent;
        };
        return Message;
    })(ChatPanel);
    RongWebIMWidget.Message = Message;
    var UserInfo = (function () {
        function UserInfo(userId, name, portraitUri) {
            this.userId = userId;
            this.name = name;
            this.portraitUri = portraitUri;
        }
        return UserInfo;
    })();
    RongWebIMWidget.UserInfo = UserInfo;
    var GroupInfo = (function () {
        function GroupInfo(userId, name, portraitUri) {
            this.userId = userId;
            this.name = name;
            this.portraitUri = portraitUri;
        }
        return GroupInfo;
    })();
    RongWebIMWidget.GroupInfo = GroupInfo;
    var TextMessage = (function () {
        function TextMessage(msg) {
            msg = msg || {};
            this.content = msg.content;
            this.userInfo = msg.userInfo;
        }
        return TextMessage;
    })();
    RongWebIMWidget.TextMessage = TextMessage;
    var HandShakeResponseMessage = (function () {
        function HandShakeResponseMessage() {
        }
        return HandShakeResponseMessage;
    })();
    RongWebIMWidget.HandShakeResponseMessage = HandShakeResponseMessage;
    var ChangeModeResponseMessage = (function () {
        function ChangeModeResponseMessage() {
        }
        return ChangeModeResponseMessage;
    })();
    RongWebIMWidget.ChangeModeResponseMessage = ChangeModeResponseMessage;
    var TerminateMessage = (function () {
        function TerminateMessage() {
        }
        return TerminateMessage;
    })();
    RongWebIMWidget.TerminateMessage = TerminateMessage;
    var CustomerStatusUpdateMessage = (function () {
        function CustomerStatusUpdateMessage() {
        }
        return CustomerStatusUpdateMessage;
    })();
    RongWebIMWidget.CustomerStatusUpdateMessage = CustomerStatusUpdateMessage;
    var InformationNotificationMessage = (function () {
        function InformationNotificationMessage() {
        }
        return InformationNotificationMessage;
    })();
    RongWebIMWidget.InformationNotificationMessage = InformationNotificationMessage;
    var ImageMessage = (function () {
        function ImageMessage() {
        }
        return ImageMessage;
    })();
    RongWebIMWidget.ImageMessage = ImageMessage;
    var VoiceMessage = (function () {
        function VoiceMessage() {
        }
        return VoiceMessage;
    })();
    RongWebIMWidget.VoiceMessage = VoiceMessage;
    var LocationMessage = (function () {
        function LocationMessage() {
        }
        return LocationMessage;
    })();
    RongWebIMWidget.LocationMessage = LocationMessage;
    var RichContentMessage = (function () {
        function RichContentMessage() {
        }
        return RichContentMessage;
    })();
    RongWebIMWidget.RichContentMessage = RichContentMessage;
    var DiscussionNotificationMessage = (function () {
        function DiscussionNotificationMessage() {
        }
        return DiscussionNotificationMessage;
    })();
    RongWebIMWidget.DiscussionNotificationMessage = DiscussionNotificationMessage;
    var Conversation = (function () {
        function Conversation(targetType, targetId, title) {
            this.targetType = targetType;
            this.targetId = targetId;
            this.title = title || "";
        }
        Conversation.onvert = function (item) {
            var conver = new Conversation();
            conver.targetId = item.targetId;
            conver.targetType = item.conversationType;
            conver.title = item.conversationTitle;
            conver.portraitUri = item.senderPortraitUri;
            conver.unreadMessageCount = item.unreadMessageCount;
            return conver;
        };
        return Conversation;
    })();
    RongWebIMWidget.Conversation = Conversation;
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var RongIMSDKServer = (function () {
        function RongIMSDKServer($q) {
            var _this = this;
            this.$q = $q;
            this.connect = function (token) {
                var defer = _this.$q.defer();
                RongIMLib.RongIMClient.connect(token, {
                    onSuccess: function (data) {
                        defer.resolve(data);
                    },
                    onTokenIncorrect: function () {
                        defer.reject({ tokenError: true });
                    },
                    onError: function (errorCode) {
                        defer.reject({ errorCode: errorCode });
                        var info = '';
                        switch (errorCode) {
                            case RongIMLib.ErrorCode.TIMEOUT:
                                info = '连接超时';
                                break;
                            case RongIMLib.ErrorCode.UNKNOWN:
                                info = '未知错误';
                                break;
                            case RongIMLib.ConnectionState.UNACCEPTABLE_PROTOCOL_VERSION:
                                info = '不可接受的协议版本';
                                break;
                            case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                                info = 'appkey不正确';
                                break;
                            case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                                info = '服务器不可用';
                                break;
                            case RongIMLib.ConnectionState.NOT_AUTHORIZED:
                                info = '未认证';
                                break;
                            case RongIMLib.ConnectionState.REDIRECT:
                                info = '重新获取导航';
                                break;
                            case RongIMLib.ConnectionState.APP_BLOCK_OR_DELETE:
                                info = '应用已被封禁或已被删除';
                                break;
                            case RongIMLib.ConnectionState.BLOCK:
                                info = '用户被封禁';
                                break;
                        }
                        console.log("失败:" + info + errorCode);
                    }
                });
                return defer.promise;
            };
            this.getConversation = function (type, targetId) {
                var defer = _this.$q.defer();
                RongIMLib.RongIMClient.getInstance().getConversation(Number(type), targetId, {
                    onSuccess: function (data) {
                        defer.resolve(data);
                    },
                    onError: function () {
                        defer.reject();
                    }
                });
                return defer.promise;
            };
            this.getFileToken = function () {
                var defer = _this.$q.defer();
                RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                    onSuccess: function (data) {
                        if (data) {
                            defer.resolve(data.token);
                        }
                        else {
                            defer.reject();
                        }
                    }, onError: function () {
                        defer.reject();
                    }
                });
                return defer.promise;
            };
        }
        RongIMSDKServer.prototype.init = function (appkey) {
            RongIMLib.RongIMClient.init(appkey);
        };
        RongIMSDKServer.prototype.setOnReceiveMessageListener = function (option) {
            RongIMLib.RongIMClient.setOnReceiveMessageListener(option);
        };
        RongIMSDKServer.prototype.setConnectionStatusListener = function (option) {
            RongIMLib.RongIMClient.setConnectionStatusListener(option);
        };
        RongIMSDKServer.prototype.startCustomService = function (targetId) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().startCustomService(targetId, {
                onSuccess: function () {
                    defer.resolve();
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.sendReadReceiptMessage = function (targetId, type) {
            var that = this;
            RongIMLib.RongIMClient.getInstance()
                .getConversation(Number(type), targetId, {
                onSuccess: function (data) {
                    if (data) {
                        var read = RongIMLib.ReadReceiptMessage
                            .obtain(data.latestMessage.messageUId, data.latestMessage.sentTime, "1");
                        that.sendMessage(type, targetId, read);
                    }
                },
                onError: function () {
                }
            });
        };
        RongIMSDKServer.prototype.sendMessage = function (conver, targetId, content) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().sendMessage(+conver, targetId, content, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (errorCode, message) {
                    defer.reject({ errorCode: errorCode, message: message });
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default:
                            info = "";
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.evaluateHumanCustomService = function (targetId, value, describe) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().evaluateHumanCustomService(targetId, value, describe, {
                onSuccess: function () {
                    defer.resolve();
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.evaluateRebotCustomService = function (targetId, value, describe) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().evaluateRebotCustomService(targetId, value, describe, {
                onSuccess: function () {
                    defer.resolve();
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.reconnect = function (callback) {
            RongIMLib.RongIMClient.reconnect(callback);
        };
        RongIMSDKServer.prototype.disconnect = function () {
            RongIMLib.RongIMClient.getInstance().disconnect();
        };
        RongIMSDKServer.prototype.logout = function () {
            if (RongIMLib && RongIMLib.RongIMClient) {
                RongIMLib.RongIMClient.getInstance().logout();
            }
        };
        RongIMSDKServer.prototype.clearUnreadCount = function (type, targetid) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .clearUnreadCount(type, targetid, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getTotalUnreadCount = function () {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getTotalUnreadCount({
                onSuccess: function (num) {
                    defer.resolve(num);
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getConversationList = function () {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getConversationList({
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            }, null);
            return defer.promise;
        };
        RongIMSDKServer.prototype.removeConversation = function (type, targetId) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .removeConversation(type, targetId, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getHistoryMessages = function (type, targetId, num) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getHistoryMessages(type, targetId, null, num, {
                onSuccess: function (data, has) {
                    defer.resolve({
                        data: data,
                        has: has
                    });
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getDraft = function (type, targetId) {
            return RongIMLib.RongIMClient.getInstance()
                .getTextMessageDraft(type, targetId) || "";
        };
        RongIMSDKServer.prototype.setDraft = function (type, targetId, value) {
            return RongIMLib.RongIMClient.getInstance()
                .saveTextMessageDraft(type, targetId, value);
        };
        RongIMSDKServer.prototype.clearDraft = function (type, targetId) {
            return RongIMLib.RongIMClient.getInstance()
                .clearTextMessageDraft(type, targetId);
        };
        RongIMSDKServer.prototype.sendProductInfo = function (targetId, msgContent) {
            var msg = new RongIMLib.RongIMClient.RegisterMessage["ProductMessage"](msgContent);
            this.sendMessage(RongIMLib.ConversationType.CUSTOMER_SERVICE, targetId, msg);
        };
        RongIMSDKServer.prototype.registerMessage = function () {
            var messageName = "ProductMessage"; // 消息名称。
            var objectName = "cs:product"; // 消息内置名称，请按照此格式命名。
            var mesasgeTag = new RongIMLib.MessageTag(true, true); // 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
            var propertys = ["title", "url", "content", "imageUrl", "extra"]; // 消息类中的属性名。
            RongIMLib.RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, propertys);
        };
        RongIMSDKServer.$inject = ["$q"];
        return RongIMSDKServer;
    })();
    RongWebIMWidget.RongIMSDKServer = RongIMSDKServer;
    angular.module("RongWebIMWidget")
        .service("RongIMSDKServer", RongIMSDKServer);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var ProviderData = (function () {
        function ProviderData() {
            this._cacheUserInfo = [];
            this._cacheGroupInfo = [];
            this.totalUnreadCount = 0;
            this.connectionState = true;
            this.voiceSound = false;
            this.currentUserInfo = {};
        }
        ProviderData.prototype._getCacheUserInfo = function (id) {
            for (var i = 0, len = this._cacheUserInfo.length; i < len; i++) {
                if (this._cacheUserInfo[i].userId == id) {
                    return this._cacheUserInfo[i];
                }
            }
            return null;
        };
        ProviderData.prototype._addUserInfo = function (user) {
            var olduser = this._getCacheUserInfo(user.userId);
            if (olduser) {
                angular.extend(olduser, user);
            }
            else {
                this._cacheUserInfo.push(user);
            }
        };
        return ProviderData;
    })();
    RongWebIMWidget.ProviderData = ProviderData;
    var ElementStyle = (function () {
        function ElementStyle() {
        }
        return ElementStyle;
    })();
    var WidgetConfig = (function () {
        function WidgetConfig() {
            this.displayConversationList = false;
            this.conversationListPosition = RongWebIMWidget.EnumConversationListPosition.left;
            this.displayMinButton = true;
            this.desktopNotification = false;
            this.reminder = "";
            this.voiceNotification = false;
            this.style = {
                positionFixed: false,
                width: 450,
                height: 470,
                bottom: 0,
                right: 0
            };
            this.refershOnlineStateIntercycle = 1000 * 20;
            this.hiddenConversations = [];
            this.__isKefu = false;
        }
        return WidgetConfig;
    })();
    RongWebIMWidget.WidgetConfig = WidgetConfig;
    angular.module("RongWebIMWidget")
        .service("ProviderData", ProviderData)
        .service("WidgetConfig", WidgetConfig);
})(RongWebIMWidget || (RongWebIMWidget = {}));

angular.module('RongWebIMWidget').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('./ts/conversation/conversation.tpl.html',
    "<div id=rong-conversation class=\"rongcloud-kefuChatBox rongcloud-both rongcloud-am-fade-and-slide-top\" ng-show=showSelf ng-class=\"{'rongcloud-fullScreen':resoures.fullScreen}\"><evaluatedir type=evaluate.type display=evaluate.showSelf confirm=evaluate.onConfirm(data) cancle=evaluate.onCancle()></evaluatedir><div class=rongcloud-kefuChat><div id=header class=\"rongcloud-rong-header rongcloud-blueBg rongcloud-online\"><div class=\"rongcloud-infoBar rongcloud-pull-left\"><div class=rongcloud-infoBarTit><span class=rongcloud-kefuName ng-bind=conversation.title></span></div></div><div class=\"rongcloud-toolBar rongcloud-headBtn rongcloud-pull-right\"><div ng-show=!config.displayConversationList&&config.voiceNotification class=rongcloud-voice ng-class=\"{'rongcloud-voice-mute':!data.voiceSound,'rongcloud-voice-sound':data.voiceSound}\" ng-click=\"data.voiceSound=!data.voiceSound\"></div><a href=javascript:; class=\"rongcloud-kefuChatBoxHide rongcloud-sprite\" style=margin-right:6px ng-show=!config.displayConversationList ng-click=minimize() title=隐藏></a> <a href=javascript:; class=\"rongcloud-kefuChatBoxClose rongcloud-sprite\" ng-click=close() title=结束对话></a></div></div><div class=rongcloud-outlineBox ng-hide=data.connectionState><div class=rongcloud-sprite></div><span>连接断开,请刷新重连</span></div><div id=Messages><div class=rongcloud-emptyBox>暂时没有新消息</div><div class=rongcloud-MessagesInner><div ng-repeat=\"item in messageList\" ng-switch=item.panelType><div class=rongcloud-Messages-date ng-switch-when=104><b>{{item.sentTime|historyTime}}</b></div><div class=rongcloud-Messages-history ng-switch-when=105><b ng-click=getHistory()>查看历史消息</b></div><div class=rongcloud-Messages-history ng-switch-when=106><b ng-click=getMoreMessage()>获取更多消息</b></div><div class=rongcloud-sys-tips ng-switch-when=2><span ng-bind-html=item.content.content|trustHtml></span></div><div class=\"rongcloud-Message rongcloud-clearfix\" ng-class=\"{'rongcloud-Message-send': item.messageDirection == 1}\" ng-switch-when=1><div class=rongcloud-Messages-unreadLine></div><div><div class=rongcloud-Message-header><img class=\"rongcloud-img rongcloud-u-isActionable rongcloud-Message-avatar rongcloud-avatar\" ng-src={{item.content.userInfo.portraitUri||item.content.userInfo.icon}} err-src=http://7xo1cb.com1.z0.glb.clouddn.com/rongcloudkefu2.png errsrcserasdfasdfasdfa alt=\"\"><div class=\"rongcloud-Message-author rongcloud-clearfix\" ng-if=\"item.messageDirection == 2\"><a class=\"rongcloud-author rongcloud-u-isActionable\">{{item.content.userInfo.name}}</a></div></div></div><div class=rongcloud-Message-body ng-switch=item.messageType><textmessage ng-switch-when=TextMessage msg=item.content></textmessage><imagemessage ng-switch-when=ImageMessage msg=item.content></imagemessage><voicemessage ng-switch-when=VoiceMessage msg=item.content></voicemessage><locationmessage ng-switch-when=LocationMessage msg=item.content></locationmessage><richcontentmessage ng-switch-when=RichContentMessage msg=item.content></richcontentmessage></div></div></div></div></div><div id=footer class=rongcloud-rong-footer style=\"display: block\"><div class=rongcloud-footer-con><div class=rongcloud-text-layout><div id=funcPanel class=\"rongcloud-funcPanel rongcloud-robotMode\"><div class=rongcloud-mode1 ng-show=\"_inputPanelState==0\"><div class=rongcloud-MessageForm-tool id=expressionWrap><i class=\"rongcloud-sprite rongcloud-iconfont-smile\" ng-click=\"showemoji=!showemoji\"></i><div class=rongcloud-expressionWrap ng-show=showemoji><i class=rongcloud-arrow></i><emoji ng-repeat=\"item in emojiList\" item=item content=conversation></emoji></div></div><div class=rongcloud-MessageForm-tool><i class=\"rongcloud-sprite rongcloud-iconfont-upload\" id=upload-file style=\"position: relative; z-index: 1\"></i></div></div><div class=rongcloud-mode2 ng-show=\"_inputPanelState==2\"><a ng-click=switchPerson() id=chatSwitch class=rongcloud-chatSwitch>转人工服务</a></div></div><pre id=inputMsg class=\"rongcloud-text rongcloud-grey\" contenteditable contenteditable-dire ng-focus=\"showemoji=fase\" style=\"background-color: rgba(0,0,0,0);color:black\" ctrl-enter-keys fun=send() ctrlenter=false placeholder=请输入文字... ondrop=\"return false\" ng-model=conversation.messageContent></pre></div><div class=rongcloud-powBox><button type=button style=\"background-color: #0099ff\" class=\"rongcloud-rong-btn rongcloud-rong-send-btn\" id=rong-sendBtn ng-click=send()>发送</button></div></div></div></div></div>"
  );


  $templateCache.put('./ts/conversationlist/conversationList.tpl.html',
    "<div id=rong-conversation-list class=\"rongcloud-kefuListBox rongcloud-both\"><div class=rongcloud-kefuList><div class=\"rongcloud-rong-header rongcloud-blueBg\"><div class=\"rongcloud-toolBar rongcloud-headBtn\"><div ng-show=config.voiceNotification class=rongcloud-voice ng-class=\"{'rongcloud-voice-mute':!data.voiceSound,'rongcloud-voice-sound':data.voiceSound}\" ng-click=\"data.voiceSound=!data.voiceSound\"></div><div class=\"rongcloud-sprite rongcloud-people\"></div><span class=rongcloud-recent>最近联系人</span><div class=\"rongcloud-sprite rongcloud-arrow-down\" style=\"cursor: pointer\" ng-click=minbtn()></div></div></div><div class=rongcloud-content><div class=rongcloud-netStatus ng-hide=data.connectionState><div class=rongcloud-sprite></div><span>连接断开,请刷新重连</span></div><div><conversation-item ng-repeat=\"item in conversationListServer._conversationList\" item=item></conversation-item></div></div></div></div>"
  );


  $templateCache.put('./ts/evaluate/evaluate.tpl.html',
    "<div class=rongcloud-layermbox ng-show=display><div class=rongcloud-laymshade></div><div class=rongcloud-layermmain><div class=rongcloud-section><div class=rongcloud-layermchild ng-show=!end><div class=rongcloud-layermcont><div class=rongcloud-type1 ng-show=\"type==1\"><h4>&nbsp;评价客服</h4><div class=rongcloud-layerPanel1><div class=rongcloud-star><span ng-repeat=\"item in stars track by $index\"><span ng-class=\"{'rongcloud-star-on':$index<data.stars,'rongcloud-star-off':$index>=data.stars}\" ng-click=confirm($index+1) ng-mouseenter=mousehover($index+1) ng-mouseleave=mousehover(0)></span></span></div></div></div><div class=rongcloud-type2 ng-show=\"type==2\"><h4>&nbsp;&nbsp;机器人是否解决了您的问题 ？</h4><div class=rongcloud-layerPanel1><a class=\"rongcloud-rong-btn rongcloud-btnY\" ng-class=\"{'rongcloud-cur':data.value===true}\" href=javascript:void(0); ng-click=confirm(true)>是</a> <a class=\"rongcloud-rong-btn rongcloud-btnN\" ng-class=\"{'rongcloud-cur':data.value===false}\" href=javascript:void(0); ng-click=confirm(false)>否</a></div></div><div class=rongcloud-layerPanel2 ng-show=displayDescribe><p>是否有以下情况 ？</p><div class=rongcloud-labels><span ng-repeat=\"item in labels\"><a class=rongcloud-rong-btn ng-class=\"{'rongcloud-cur':item.selected}\" ng-click=\"item.selected=!item.selected\" href=\"\">{{item.display}}</a></span></div><div class=rongcloud-suggestBox><textarea name=\"\" placeholder=欢迎给我们的服务提建议~ ng-model=data.describe></textarea></div><div class=rongcloud-subBox><a class=rongcloud-rong-btn href=\"\" ng-click=commit()>提交评价</a></div></div></div><div class=rongcloud-layermbtn><span ng-click=confirm()>跳过</span><span ng-click=cancle()>取消</span></div></div><div class=\"rongcloud-layermchild rongcloud-feedback\" ng-show=end><div class=rongcloud-layermcont>感谢您的反馈 ^ - ^ ！</div></div></div></div></div>"
  );


  $templateCache.put('./ts/main.tpl.html',
    "<div id=rong-widget-box class=rongcloud-container><div ng-show=main.display><rong-conversation></rong-conversation><rong-conversation-list></rong-conversation-list></div><div id=rong-widget-minbtn class=\"rongcloud-kefuBtnBox rongcloud-blueBg\" ng-show=!main.display&&config.displayMinButton ng-click=showbtn()><a class=rongcloud-kefuBtn href=\"javascript: void(0);\"><div class=\"rongcloud-sprite rongcloud-people\"></div><span class=rongcloud-recent ng-show=\"!data.totalUnreadCount||data.totalUnreadCount==0\">{{config.reminder||\"最近联系人\"}}</span> <span class=rongcloud-recent ng-show=\"data.totalUnreadCount>0\"><span ng-show=twinkle>(有未读消息)</span></span></a></div><div id=rong-widget-minbtn-kefu class=\"rongcloud-kefuBtnBox rongcloud-blueBg\" ng-show=!main.display&&config.displayMinButton ng-click=showbtn()><a class=rongcloud-kefuBtn href=\"javascript: void(0);\"><div class=\"rongcloud-sprite rongcloud-people rongcloud-sprite-kefu\"></div><span class=rongcloud-recent>{{config.reminder||\"联系客服\"}}</span></a></div><audio id=rongcloud-playsound style=\"width: 0px;height: 0px;display: none\" src=\"\" controls></audio></div>"
  );

}]);
