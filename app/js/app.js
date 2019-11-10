'use strict';

var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider, $locationProvider){
       $routeProvider.when('/main',
           {
               templateUrl: 'templates/main.html'
           });
        $routeProvider.when('/view1',
            {
                templateUrl: 'templates/view1.html',
                controller: 'View1Controller'
            });
        $routeProvider.when('/view2',
            {
                templateUrl: 'templates/view2.html',
                controller: 'View2Controller'
            });
        $routeProvider.otherwise({redirectTo: '/main'});
        $locationProvider.html5Mode(true);
    });

myApp.controller('View1Controller', function($scope, $location, $http) {
    $scope.client_id = "f8d5957efd46e181c27676ae340c74";
    $scope.client_secret = "Wfonj5RqcKZIsEu3fnJVXajkMsTJp4mN";

    $scope.create_user = function(app_user_id, client_id, client_secret){
        let url = "https://api.1up.health/user-management/v1/user"
        let data = {
            "app_user_id": app_user_id,
            "client_id": client_id,
            "client_secret": client_secret
        }

        $http.post(url, data).then(function(res){
            console.log("response");
            console.log(res);
        });
    };

    $scope.create_user(0, $scope.client_id, $scope.client_secret);
});

myApp.controller('View2Controller', function($scope, $location) {


});