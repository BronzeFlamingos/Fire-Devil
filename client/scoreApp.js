// 'use strict';
var scoreApp = angular.module('scoreApp', [])
  .controller('scoreCtrl', function($scope) {
  $scope.score = 0;
  $scope.addScore = function() {};
  $scope.subtractScore = function() {};
});