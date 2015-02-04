//authentication strategy used by passport, see passport docs for more info on strategies
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var gcal = require('google-calendar');
//refactor to promises later
var Promise = require('bluebird');
var Firebase = require('firebase');

// Firebase database referance is structured:
//   for each user there is:
//     - swipeData
//     - calendarData
var ref = new Firebase('https://fingerfiesta.firebaseio.com/');

//serialized a user session,
passport.serializeUser(function(user, done) {
  done(null, user);
});
//used to deserialize user session
passport.deserializeUser(function(user, done) {
  done(null, user);
});
//secret access information which allows protects users from CSFR
passport.use(new GoogleStrategy({
  clientID : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET,
  callbackURL : process.env.CALLBACK_URL
  },
  function(token, refreshToken, profile, done) {
    ref.child('users').set(profile._json.id);
    ref.child('users').child(profile._json.id).set({email: profile._json.email});
    //instantiate new calendar of logged user
    // google_calendar = new gcal.GoogleCalendar(token);
    // var currentUser = profile.displayName;

    // //makes a new firebase directory for the user

    // //google api function to list calendars of user
    // google_calendar.calendarList.list(function(err, calendarList) {
    //   //referance to specific calendar
    //   var calendarId = calendarList.items[0].id;
    //   //object where calendarData will be assembled
    //   var calendarInfo = {};

    //   calendarInfo.user = currentUser;

    //   google_calendar.events.list(calendarId, function(err, calendarList) {
        
    //     //organizes the the data, callback to make sure the data is loaded
    //     //when the project  is scaled
    //     var getStableData = function(cb) {
    //       //'eve' refers to the index number in calendarList.items
    //       for (var calendarEvent in calendarList.items) {
    //         if (calendarList.items[calendarEvent]['summary'] != undefined) {
    //           (function(calendarEvent) {
    //             calendarInfo[calendarEvent] = {};
    //             var happening = calendarList.items[calendarEvent]['summary'];
    //             calendarInfo[calendarEvent]['event'] = happening;
    //             calendarInfo.happening = happening;
    //             calendarInfo[calendarEvent]['start'] = calendarList.items[calendarEvent]['start'];
    //             calendarInfo[calendarEvent]['end'] = calendarList.items[calendarEvent]['end'];
    //             if (calendarList.items[calendarEvent]['recurrence']) {
    //               calendarInfo[calendarEvent]['recurrence'] = calendarList.items[calendarEvent]['recurrence']
    //             }
    //           })(calendarEvent);
    //         }
    //       }
    //       cb();
    //     };
    //     getStableData(function() {
    //       //uploads data to firebase
    //       var userRef = ref.child(currentUser);
    //       var calendarRef = userRef.child('calendarData');
    //       calendarRef.set(calendarInfo);
    //     });
    //   });
    //});
    //at the end of the event loop call the inner callback 
    //http://nodejs.org/api/process.html
    process.nextTick(function() {
      //return profile or false      
      return done(null, profile);
    });
  }
));
