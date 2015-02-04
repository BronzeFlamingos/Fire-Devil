firebaseRef = new Firebase('https://fingerfiesta.firebaseio.com/');

var orderedStorage = {};

// Add user data to storage
firebaseRef.on('value', 
  function(snapshot) {
    originalUserStorage = snapshot.val();
    console.log('allUserStorage', allUserStorage);
  }, function(error) {
  console.log('error', error);
});

// Change human-readable dates to UTC
var toUTC = function(date) {
  return Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
  );
};

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
      if (typeof date === 'string') {
        console.log(date);
        // console.log(new Date(date));
        date = toUTC(date);
      }
      coordinates.push(xData);
      coordinates.push(yData);
      // console.log('orderedStorage[key]', orderedStorage[key]);
      orderedStorage[key][date] = coordinates;
    }
  }
  // console.log('orderedStorage', orderedStorage);
};

orderData(allUserStorage);

// Change UTC to human-readable date
var UTCtoDate = function(utc) {
  var temp = new Date(utc);
  var m_names = ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"];
  var month = m_names[temp.getMonth()];
  // Add + 1 to day to compensate for UTC vs. US time zones.
  var displayDate = '' + month + ' ' + (temp.getDate() + 1) + ', ' + temp.getFullYear();
  return displayDate;
}

// Test if all the swipes in an object occurred in less than a minute
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
  strokes.happy = 0;
  strokes.excited = 0;
  strokes.sad = 0;
  strokes.angry = 0;
  for (var key in obj) {
    if (obj[key][0][obj[key][0].length-1] > 525) {
      if (obj[key][1][obj[key][0].length-1] > 525) {
        strokes.angry += 1;
      } else if (obj[key][1][obj[key][0].length-1] < 75) {
        strokes.excited += 1;
      }
    } else if (obj[key][0][obj[key][0].length-1] < 75) {
      if (obj[key][1][obj[key][0].length-1] > 525) {
        strokes.sad += 1;
      } else if (obj[key][1][obj[key][0].length-1] < 75) {
        strokes.happy += 1;
      }
    }
  }
  return strokes;
};

// Testing stuff:
// firebaseRef = new Firebase('https://fire-devil.firebaseio.com/');
// firebaseRef.on('value', function(snapshot) { console.log(snapshot.val()) });
