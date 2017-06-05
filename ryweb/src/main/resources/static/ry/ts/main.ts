module RongWebIMWidget {

    runApp.$inject = ["$http", "WebIMWidget", "WidgetConfig", "RongCustomerService"];

    function runApp($http: ng.IHttpService,
        WebIMWidget: RongWebIMWidget.WebIMWidget,
        WidgetConfig: RongWebIMWidget.WidgetConfig,
        RongCustomerService: RongWebIMWidget.RongCustomerService) {
            
    }

    class rongWidget {
        restrict: string = "E";
        scope: {};
        templateUrl: string = "./ts/main.tpl.html";
        controller: string = "rongWidgetController";
    }

    class rongWidgetController {
        static $inject: string[] = ["$scope",
            "$interval",
            "WebIMWidget",
            "WidgetConfig",
            "ProviderData",
            "ConversationServer",
            "ConversationListServer",
            "RongIMSDKServer"
        ]

        constructor(
            private $scope: any,
            private $interval: ng.IIntervalService,
            private WebIMWidget: RongWebIMWidget.WebIMWidget,
            private WidgetConfig: RongWebIMWidget.WidgetConfig,
            private providerdata: RongWebIMWidget.ProviderData,
            private conversationServer: RongWebIMWidget.conversation.IConversationService,
            private conversationListServer: RongWebIMWidget.conversationlist.IConversationListServer,
            private RongIMSDKServer: RongWebIMWidget.RongIMSDKServer
        ) {
            $scope.main = WebIMWidget;
            $scope.config = WidgetConfig;
            $scope.data = providerdata;



            var voicecookie = RongWebIMWidget.Helper.CookieHelper.getCookie("rongcloud.voiceSound");
            providerdata.voiceSound = voicecookie ? (voicecookie == "true") : true;
            $scope.$watch("data.voiceSound", function(newVal, oldVal) {
                if (newVal === oldVal)
                    return;
                RongWebIMWidget.Helper.CookieHelper.setCookie("rongcloud.voiceSound", newVal);
            })


            var interval = null;
            $scope.$watch("data.totalUnreadCount", function(newVal, oldVal) {
                if (newVal > 0) {
                    interval && $interval.cancel(interval);
                    interval = $interval(function() {
                        $scope.twinkle = !$scope.twinkle;
                    }, 1000);
                } else {
                    $interval.cancel(interval);
                }
            });

            $scope.$watch("main.display", function() {
                if (conversationServer.current && conversationServer.current.targetId && WebIMWidget.display) {
                    RongIMSDKServer.getConversation(conversationServer.current.targetType, conversationServer.current.targetId).then(function(conv) {
                        if (conv && conv.unreadMessageCount > 0) {
                            RongIMSDKServer.clearUnreadCount(conversationServer.current.targetType, conversationServer.current.targetId);
                            RongIMSDKServer.sendReadReceiptMessage(conversationServer.current.targetId, conversationServer.current.targetType);
                            conversationListServer.updateConversations().then(function() { });
                        }
                    })
                }
            })

            WebIMWidget.show = function() {
                WebIMWidget.display = true;
                WebIMWidget.fullScreen = false;
                WebIMWidget.onShow && WebIMWidget.onShow();
                setTimeout(function() {
                    $scope.$apply();
                });
            }

            WebIMWidget.hidden = function() {
                WebIMWidget.display = false;
                setTimeout(function() {
                    $scope.$apply();
                });
            }

            $scope.showbtn = function() {
                WebIMWidget.display = true;
                WebIMWidget.onShow && WebIMWidget.onShow();
            }
        }

    }


    angular.module("RongWebIMWidget").run(runApp)
        .directive("rongWidget", RongWebIMWidget.DirectiveFactory.GetFactoryFor(rongWidget))
        .controller("rongWidgetController", rongWidgetController);;

}
