'use strict';

myApp.controller('View1Controller',
    function ProjectsController($scope, $location) {
        $scope.test = "test1";
        console.log("test is " + $scope.test);

});