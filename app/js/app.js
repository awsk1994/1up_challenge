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

myApp.controller('View1Controller', function($scope, $location, $http, $window) {
    $scope.cred_type = "local";    // "heroku" or "local" or "term_ie"
    $scope.users = {};
    $scope.create_user_resp = null;
    $scope.cache_access_code = null;
    $scope.system_id_resp = null;
    $scope.access_token = null;
    $scope.refresh_token = null;
    $scope.patient_id = null;
    $scope.get_patient_resp = null;

    $scope.create_patient_err = null;

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

        function retrieve_access_code(code){
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
                retrieve_access_code(code);
            });
        }

        get_auth_code(app_user_id);
    }

    $scope.redirectToEpicLogin = function(){
        // username: fhirjason, pw: epicepic1
        let system_id = 4706;
        let url = "https://quick.1up.health/connect/" + system_id + "?client_id="+get_client_info().client_id+"&access_token=" + $scope.access_token;
        $window.open(url, '_blank');
    };

    $scope.access_client_data = function(){
        let client_info = get_client_info();
        let url = "https://api.1up.health/connect/system/clinical"
        let params = {
            "clientid": client_info.client_id,
            "clientsecret": client_info.client_secret
        }
        $http.get(url, params).then(function(res){
            console.log(res.data);
        })
    }

    $scope.create_patient_data = function(id, gender){
        let url = "https://api.1up.health/fhir/dstu2/Patient";
        let config = {
            "headers": {
                "Authorization": "Bearer " + $scope.access_token
            }
        };
        let data = {
            "resourceType": "Patient",
            "id": id,
            "gender": gender
        }
        $http.post(url, data, config).then(function(res){
            $scope.create_patient_err = null;
            console.log(res.data);
            if(res.data.issue){
                $scope.create_patient_err = res.data.issue[0].details.text
            } else {
                $scope.patient_id = res.data.id;
            }
        })
    };

    $scope.get_patient_data = function(patient_id){
        let url = "https://api.1up.health/fhir/dstu2/Patient/" + patient_id + "/$everything";
        let config = {
            "headers": {
                "Authorization": "Bearer " + $scope.access_token
            }
        }

        $http.get(url, config).then(function(res){
            console.log(res.data);
            $scope.get_patient_resp = res.data;
        })
    }

    $scope.generate_sample_get_patient_data = function(){
        $scope.get_patient_resp = {"resourceType":"Bundle","type":"searchset","total":2,"entry":[{"fullUrl":"https://api.1up.health/fhir/dstu2/Patient/730bea4ff16f","search":{"mode":"match","score":21.654974},"resource":{"gender":"male","meta":{"lastUpdated":"2019-11-11T14:36:44.501Z","versionId":"9000000000000"},"id":"730bea4ff16f","resourceType":"Patient"}},{"fullUrl":"https://api.1up.health/fhir/dstu2/Provenance/730bea4ff16f366cba5e2c85f25d75e1148d35f3b408","search":{"mode":"match","score":26.93042},"resource":{"agent":[{"role":{"system":"http://hl7.org/fhir/provenance-participant-role","code":"author"},"userId":{"system":"https://1up.health/dev/codesystems/user-id","value":"105544"}},{"actor":{"reference":"Device/software"},"role":{"system":"http://hl7.org/fhir/v3/ParticipationType","code":"DEV"},"userId":{"system":"https://1up.health/dev/codesystems/oneup-service-id","value":"fhirapiserver"}}],"activity":{"coding":[{"code":"new","system":"http://hl7.org/fhir/v3/ActStatus","display":"new"}]},"recorded":"2019-11-11T14:36:44.530Z","target":[{"reference":"Patient/730bea4ff16f/_history/9000000000000"}],"meta":{"lastUpdated":"2019-11-11T14:36:44.573Z","versionId":"9000000000000"},"id":"730bea4ff16f366cba5e2c85f25d75e1148d35f3b408","entity":[{"reference":"Patient/730bea4ff16f/_history/9000000000000","role":"source","type":{"code":"Patient","system":"http://hl7.org/fhir/definition-resource-types"}}],"resourceType":"Provenance"}}]}
    }

});

myApp.controller('View2Controller', function($scope, $location) {


});