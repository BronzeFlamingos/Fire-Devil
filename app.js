var express = require('express');
var app = require('./server/server.js');
var googleCal = require('./googleCal.js');
var passport = require('passport');
// module.export = username = 

// app.use('/',express.static(__dirname + '/client'));
// app.use(express.static(__dirname + '/client'));

app.use(passport.initialize());
app.use(passport.session());
app.use('/swipez',express.static(__dirname + '/client'));

app.use('/data-view',express.static(__dirname +'/app'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/app/views/main.html');
});

//asks google for permissions of specific items defined in scopes
app.get('/login',
  passport.authenticate('google', 
    { scope: ['https://www.googleapis.com/auth/userinfo.profile',
              'https://www.googleapis.com/auth/userinfo.email',
              'https://www.googleapis.com/auth/calendar.readonly'] }),
  function(req, res){
    // console.log(req);
    console.log('inside passport function')
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

app.use('google-cal',express.static(__dirname + '/google-cal'));

//callback defined in project, goes here to authenticate after route to login
app.get('/data-view/callback',
  passport.authenticate('google', { failureRedirect: '/data-view' }),
  function(req, res) {
    console.log(req.user._json.name)
    res.redirect('/swipez');
  });
  //DOES NOT WORK, issue #63 in waffle.io
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


app.set('port', (process.env.PORT || 8000));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

