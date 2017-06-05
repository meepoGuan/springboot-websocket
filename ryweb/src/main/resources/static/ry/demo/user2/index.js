var demo = angular.module("demo", ["RongWebIMWidget"]);

demo.controller("main", ["$scope", "WebIMWidget", function($scope, WebIMWidget) {

    $scope.targetType = 1; //1：私聊 更多会话类型查看http://www.rongcloud.cn/docs/api/js/global.html#ConversationType
    $scope.targetId = 'aa';

    var config = {
        appkey: '3argexb6r934e',
        token: '2eg8Ji6h+yogIydGYyAZgHryPPkHsvRwWZV8SVI5ICdaNPahtVMiWMCJhI1JMB9njzkH9uHxCkg=',
        style:{
            left:3,
            bottom:3,
            width:430
        },
        displayConversationList: true,
        onSuccess: function(id) {
            $scope.user = id;
            document.title = '用户：' + id;
            console.log('连接成功：' + id);
        },
        onError: function(error) {
            console.log("连接失败：" + error);
        }
    };

    RongDemo.common(WebIMWidget, config, $scope);

}]);