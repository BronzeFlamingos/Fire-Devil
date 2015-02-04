/**
 * @ngdoc overview
 * @name fireDevilApp
 * @description
 * # fireDevilApp
 *
 * Main module of the application.
 */
var fireDevil = angular.module('fireDevilApp', ['firebase', 'fireDevilApp.services'])
  .controller('UserDataCtrl', ['$scope', '$firebase', function($scope, $firebase) {
    var originalUserStorage = {};
    var ref = new Firebase('https://fingerfiesta.firebaseio.com/');
    var sync = $firebase(ref);
    var record = sync.$asObject();
    var userSwipes = {};

    // Helper function to calculate user's mood via swipes.
    var getMood = function(userName, xArray, yArray) {
      var lastValX = xArray.length - 1;
      var lastValY = yArray.length - 1;

      // Calculate the difference in x and y values in swipes.
      var dx = xArray[lastValX] - xArray[0];
      var dy = yArray[lastValY] - yArray[1];

      // Use the difference in x and y values to calculate which direction
      // the user swiped in, and determine the feels as a result.
      // if (dy < 0 && dx > 0) {
      //   userSwipes[userName]['mood']['excited'] += 1;
      // } else if (dy < 0 && dx < 0) {
      //   userSwipes[userName]['mood']['happy'] += 1;
      // } else if (dy > 0 && dx < 0) {
      //   userSwipes[userName]['mood']['sad'] += 1;
      // } else {
      //   userSwipes[userName]['mood']['angry'] += 1;
      // }

      console.log('dx:', dx);
      console.log('dy:', dy);
      
    };

    // Helper function for counting swipes.
    var countStrokes = function(userObj, userName) {
      // Create empty object for each user in userSwipes.
      if (userSwipes[userName] === undefined) {
        userSwipes[userName] = {
          utc: undefined,
          mood: {
            happy: 0,
            excited: 0,
            sad: 0,
            angry: 0
          }
        }
      }
      for (var key in userObj) {
        // Add UTC to each user in userSwipes (after checking to make sure it's a valid UTC)
        if (userSwipes['utc'] === undefined) {
          if (typeof userObj[key][2] === 'number') {
            userSwipes[userName]['utc'] = userObj[key][2];
          }
        }
        // Run the getMood function (above) on each uesr's swipe coordinates.
        if (Array.isArray(userObj[key][0])) {
          getMood(userName, userObj[key][0], userObj[key][1]);
        }
      }
    };

    // Using promises to get user data:
    record.$loaded().
      then(function() {
        for (var key in record) {
          if (key[0] !== '$' && key !== 'forEach') {
            originalUserStorage[key] = record[key];
          }
        }
      })
      // Using promises to prepare the userSwipes object for population.
      .then(function() {
        for (var key in originalUserStorage) {
          countStrokes(originalUserStorage[key], key);
        }
        console.log('userSwipes', userSwipes);
        $scope.userSwipes = userSwipes;
      });
}]);
