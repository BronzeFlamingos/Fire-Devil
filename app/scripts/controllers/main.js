'use strict';

/**
 * @ngdoc function
 * @name fireDevilApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fireDevilApp
 */
angular.module('fireDevilApp')
  .controller('MainCtrl',['$scope', '$firebase',
  	function ($scope, $firebase) {
    //came with the yoeman, package
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  	var ref = new Firebase("https://fingerfiesta.firebaseio.com/christine");

    // create an AngularFire reference to the data
    var sync = $firebase(ref).$asObject();
    // download the data into a local object
    // console.log('before on loaded')
   	$scope.data = [];
   	sync.$loaded().then(function(){
   		console.log('Loaded record: ',sync.$id, sync)
   	angular.forEach(sync, function(key, item){

		$scope.data.push({'x' : key[0], 'y':key[1],'time':key[2]})

   		})

   	})
   //  $scope.data.$on('loaded', function(){
   //   console.log('On 29')

   //  // if( sync.hasOwnProperty('christine') ) {
   //    // note that we just grab it by key; not $child!
   //    // var userRecord = usersRef[userId];
   //   console.log(Object.keys($scope.data))

   // })

    // console.dir($scope.data)
  	  	// for (var i in $scope.data.$id){
  		// console.log($scope.data.$id[i])
  	// }

  	// console.dir($scope.data)

  }
 ]);
