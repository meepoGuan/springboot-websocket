var demo = angular.module("demo", ["RongWebIMWidget"]);

demo.controller("main", ["$scope", "$http", "RongCustomerService", function($scope, $http, RongCustomerService) {

    RongCustomerService.init({
        appkey: "3argexb6r934e",
        token: "I8zRoTYOdtHug+ox4s7HapUnU/cREmEFuMhOJuGv5bP+dl6CkOlF+WuQPPbm30kCrX6ygPNSBvlJzwuiv72NPw==",
        customerServiceId: "KEFU145914839332836",
        reminder: "在线咨询",
        position: RongCustomerService.Position.right,
        style: {
            width: 320
        },
        onSuccess: function(e) {
            console.log('连接成功');
        },
        onError: function(e) {
            console.log('连接失败');
        }
    });

    $scope.show = function() {
        RongCustomerService.show();
    };

    $scope.hidden = function() {
        RongCustomerService.hidden();
    };

}]);