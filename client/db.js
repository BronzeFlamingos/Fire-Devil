var swipesToDB = function(){
  var firebaseRef = new Firebase('https://fingerfiesta.firebaseio.com/');
  // var swipesRef = firebaseRef.child('swipeData');
  var userRef = firebaseRef.child(window.localStorage.touchUser);
  console.log('username:', window.localStorage.touchUser);
  var swipesRef = userRef.child('swipeData');
  // localStorage is JSON object with numbered index for each swipe
  // JSON.parse(localStorage[0]) is array with 3, last is date

  // TO DO: local storage has other stuff in it.
  var swipeData = JSON.parse(window.localStorage['swipeData']);
  console.log('swipeData:', swipeData);

  // pushes to db if more than 10 swipes recorded
  if ( Object.keys(swipeData).length > 3 ) {
    for ( var key in swipeData ) {
      swipesRef.push(swipeData[key]);
    }
    console.log('stuff pushed');
    window.localStorage.swipeData = JSON.stringify({});
    console.log('localStorage.swipeData cleared');
  }
}
// swipesToDB();

// TODO: fix this, I'm assuming user is gonna enter their name under 60 seconds
// otherwise, line 3 where userRef is defined could error
setInterval(function(){
  swipesToDB();
}, 5000)
