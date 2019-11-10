'use strict';

var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider, $locationProvider, $httpProvider){
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
        // to avoid CORS
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
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
        };
        let headers = {
            "Access-Control-Allow-Origin": "https://oneup-challenge-t1.herokuapp.com/view1"
        };

        console.log("Create user");

        $http({
            method: 'POST',
            url: url,
            headers: headers,
            data: data
        }).then(function(res){
            console.log("response");
            console.log(res);
        });
    };



    $scope.test_post = function(){
        let url = 'https://jsonplaceholder.typicode.com/posts';
        let data = {
            title: 'foo',
            body: 'bar',
            userId: 1
        };
        let config = {
            "headers": {"Content-type": "application/json; charset=UTF-8"}
        };

        $http.post(url, data, config).then(function(res){
            console.log("res");
            console.log(res);
        })
    }

    //$scope.test_post();
    $scope.create_user(0, $scope.client_id, $scope.client_secret);
});

myApp.controller('View2Controller', function($scope, $location) {


});