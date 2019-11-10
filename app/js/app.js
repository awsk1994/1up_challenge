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
    });

myApp.controller('View1Controller', function($scope, $location, $http) {
    $scope.localhost_cred = {
        "client_id": "21da48f1c1ba449b969dd74c1e25580c",
        "client_secret": "d1zyctsjb5qM4yoLGDCBYlmdWVa9FHfZ"
    }

    $scope.heroku_cred = {
        "client_id": "21da48f1c1ba449b969dd74c1e25580c",
        "client_secret": "d1zyctsjb5qM4yoLGDCBYlmdWVa9FHfZ"
    }

    $scope.create_user = function(app_user_id){
        // Set client_id and client_secret
        let client_id, client_secret;
        let cred_type = $scope.cred_type;
        if(cred_type == "heroku"){
            client_id = $scope.heroku_cred.client_id;
            client_secret = $scope.heroku_cred.client_secret;
        } else {
            client_id = $scope.localhost_cred.client_id;
            client_secret = $scope.localhost_cred.client_secret;
        }

        // POST request
        let data = {
            "app_user_id": app_user_id,
            "client_id": client_id,
            "client_secret": client_secret
        };
        $http({
            method: 'POST',
            url: "https://api.1up.health/user-management/v1/user",
            headers: {"Content-type": "multipart/form-data"},
            data: data,
        }).then(function(res){
            console.log("response");
            console.log(res);
        });
    };
});

myApp.controller('View2Controller', function($scope, $location) {


});