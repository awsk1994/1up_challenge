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
    $scope.cred_type = "term_ie";    // "heroku" or "local" or "term_ie"
    $scope.users = {};
    $scope.create_user_resp = null;
    $scope.cache_access_code = null;
    $scope.system_id_resp = null;
    $scope.access_token = null;
    $scope.refresh_token = null;


    // TODO: Should store client_id and secret in encrypted or hashed version
    $scope.localhost_cred = {
        "client_id": "21da48f1c1ba449b969dd74c1e25580c",
        "client_secret": "d1zyctsjb5qM4yoLGDCBYlmdWVa9FHfZ"
    }

    $scope.heroku_cred = {
        "client_id": "e490a14752f340f4bdc1b2fa20c3b0c3",
        "client_secret": "6ttx89UOq6k5wBOcVbO0N5gcbGGK9FtG"
    }

    $scope.term_ie_cred = {
        "client_id": "01269e69c8d844268c06c4cad1107291",
        "client_secret": "hPWvy0ly5isYaoJNHxEWemA02XiRN26Z"
    }

    function get_client_info(){
        let client_info = {
            "client_id": null,
            "client_secret": null
        }
        if($scope.cred_type == "heroku"){
            client_info = $scope.heroku_cred;
        } else if ($scope.cred_type == "local") {
            client_info = $scope.localhost_cred;
        } else if ($scope.cred_type == "term_ie"){
            client_info = $scope.term_ie_cred;
        }

        return client_info;
    }

    $scope.create_user = function(app_user_id){
        // Set client_id and client_secret
        let client_id, client_secret;
        let cred_type = $scope.cred_type;

        let client_info = get_client_info();

        // POST request
        let data = {
            "app_user_id": app_user_id,
            "client_id": client_info.client_id,
            "client_secret": client_info.client_secret
        };
        $http({
            method: 'POST',
            url: "https://api.1up.health/user-management/v1/user",
            data: data,
        }).then(function(res){
            $scope.create_user_resp = res.data;
            $scope.cache_access_code = res.data.code;
        });
    };

    $scope.get_users = function(){
        console.log("get user");
        let url = "https://api.1up.health/user-management/v1/user";
        let client_info = get_client_info();
        let data = {
            "params": {
                "client_id": client_info.client_id,
                "client_secret": client_info.client_secret
            }
        }
        $http.get(url, data).then(function(res){
            $scope.users = res.data.entry;
        })
    }

    $scope.get_system_id = function(){
        let url = "https://api.1up.health/connect/system/clinical";
        let client_info = get_client_info();
        let data = {
            "params": {
                "client_id": client_info.client_id,
                "client_secret": client_info.client_secret
            }
        }
        $http.get(url, data).then(function(res){
            console.log(res.data);
            $scope.system_id_resp = "Got system id (in console). Len = " + res.data.length;
        })
    }

    // TODO: https://1up.health/dev/doc/intro-fhir-api-oauth-query
    $scope.get_access_token = function(app_user_id){
        let client_info = get_client_info();

        function get_access_code(code){
            let url = "https://api.1up.health/fhir/oauth2/token";
            let data = {
                "client_id": client_info.client_id,
                "client_secret": client_info.client_secret,
                "code": code,
                "grant_type": "authorization_code"
            }
            $http.post(url, {}, {"params": data}).then(function(res){
                console.log(res.data);
                $scope.access_token = res.data.access_token;
                $scope.refresh_token = res.data.refresh_token;
            });
        }

        function get_auth_code(app_user_id){
            let url = "https://api.1up.health/user-management/v1/user/auth-code";
            let data = {
                "app_user_id": app_user_id,
                "client_id": client_info.client_id,
                "client_secret": client_info.client_secret
            };

            $http.post(url, {}, {"params": data}).then(function(res){
                let code = res.data.code
                get_access_code(code);
            });
        }

        get_auth_code(app_user_id);
    }
});

myApp.controller('View2Controller', function($scope, $location) {


});