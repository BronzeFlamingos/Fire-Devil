firebaseRef = new Firebase('https://fingerfiesta.firebaseio.com/');

var test = function(val) {
  console.log(val);
};

// Creating global objects to store user data
var originalUserStorage = {};
var orderedStorage = {};

// Add user data to storage from Firebase
firebaseRef.on('value',
  function(snapshot) {
    originalUserStorage = snapshot.val();
  }, function(error) {
  console.log('error', error);
});

// Get unordered user data from the DB into ordered format in the orderedStorage object
var orderData = function(obj) {
  for (var key in obj) {
    for (var innerKey in obj[key]) {
      var coordinates = [];
      var xData = [];
      var yData = [];

      xData = obj[key][innerKey][0];
      yData = obj[key][innerKey][1];
      var date = obj[key][innerKey][2];

      coordinates.push(xData);
      coordinates.push(yData);
      if (orderedStorage[key] === undefined) {
        orderedStorage[key] = {};
      }
      orderedStorage[key][date] = coordinates;
    }
  }
  // console.log('orderedStorage', orderedStorage);
  return orderedStorage;
};

// Change UTC to human-readable date.
// Not sure if we'll need this.
var UTCtoDate = function(utc) {
  var temp = new Date(utc);
  var m_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var month = m_names[temp.getMonth()];
  // Add + 1 to day to compensate for UTC vs. US time zones.
  var displayDate = '' + month + ' ' + (temp.getDate() + 1) + ', ' + temp.getFullYear();
  return displayDate;
}

// Test if all the swipes in an object occurred in less than a minute.
var isOneSet = function(obj) {
  var endTime;
  var startTime;
  var totalTime;
  for (var key in obj) {
    if (key < startTime || startTime === undefined) {
      startTime = key;
    }
    if (key > endTime || endTime === undefined) {
      endTime = key;
    }
  }
  // Is the total length of time for this series of swipes less than one minute?
  totalTime = endTime - startTime;
  return totalTime < 60000;
};

// Takes the storage object and returns an object showing total # of swipes for happy/sad/etc.
var countStrokes = function(obj) {
  var strokes = {};
  for (var key in obj) {
    // strokes[key] is each user in the object.
    if (strokes[key] === undefined) {
      strokes[key] = {};
    }
    // Add keys for each mood for each user's empty object.
    strokes[key]['happy'] = 0;
    strokes[key]['excited'] = 0;
    strokes[key]['sad'] = 0;
    strokes[key]['angry'] = 0;
  }

  // Go thorugh each user and parse through their data.
  for (var innerKey in obj[key]) {
    var user = obj[key];
    var lastVal0 = user[innerKey][0].length - 1;
    var lastVal1 = user[innerKey][1].length - 1;

    // Calculate the difference in x and y values in swipes.
    var dx = user[innerKey][0][lastVal0] - user[innerKey][0][0];
    var dy = user[innerKey][1][lastVal1] - user[innerKey][1][1];

    // Use the difference in x and y values to calculate which direction
    // the user swiped in, and determine the feels as a result.
    if (dy < 0 && dx > 0) {
      strokes[key]['excited'] += 1;
    } else if (dy < 0 && dx < 0) {
      strokes[key]['happy'] += 1;
    } else if (dy > 0 && dx < 0) {
      strokes[key]['sad'] += 1;
    } else {
      strokes[key]['angry'] += 1;
    }
  }
  // console.log('strokes', strokes);
  return strokes;
};

orderData(originalUserStorage);
countStrokes(orderedStorage);
