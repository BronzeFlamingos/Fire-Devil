

var startup = function() {
  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchleave", handleEnd, false);
  el.addEventListener("touchmove", handleMove, false);
  window.localStorage.touchUser = prompt("What's your name?");
  //log("initialized.");

  //Put text on the canvas
  var c = document.getElementById("canvas");
  var ctx = c.getContext("2d");

    ctx.rect(40,40, 100,100);
    ctx.stroke();

    var finalCountDown = addRect(ctx);
    setInterval(finalCountDown,33);
    // ctx.fillText("Happy", 10, 50);
    // ctx.fillText("Angry", 450, 550);
    // ctx.fillText("Excited", 450, 50);
    // ctx.fillText("Sad", 10, 550);
    // ctx.fillText("Thumb", 250, 300);
  }

var ongoingTouches = [];

//Create storage arrays
var touchesStoreX = [];
var touchesStoreY = [];

//Create a counter for each swipe event
var swipeData = {};
var swipeCount = 0;
var swipeSummary = {};

// Get user name to correlate with swipeData


window.onload = function() {
  startup();
};

var heldboxes = [];

var addRect = function(ctx){
  var count = 30;
  var inner = function(){    
    var rand = Math.floor(Math.random()*count);
    if (rand===3){
      var x = 25 + Math.floor(Math.random()*900);
      var y = 25 + Math.floor(Math.random()*1500);
      var flag = true;
      for(var i=0; i<heldboxes.length; i++){
        if(Math.abs(heldboxes[i][0]-x)<50&&Math.abs(heldboxes[i][1]-y)<50){
          flag = false;
        }
      }
      if(flag){        
        if (count>5){
          count--;
        }
        heldboxes.push([x,y]);
        ctx.fillRect(x,y,50,50);
      }
    }
  }
  return inner;
}

var handleStart = function(evt) {

  evt.preventDefault();
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

  //empty touches storage arrays on start
  touchesStoreX = [];
  touchesStoreY = [];

  for (var i=0; i < touches.length; i++) {
    ongoingTouches.push(copyTouch(touches[i]));
    var color = colorForTouch(touches[i]);
    ctx.beginPath();
    console.log("STARTED! " + el.offsetLeft);
    ctx.arc(touches[i].pageX - el.offsetLeft, touches[i].pageY - el.offsetTop, 4, 0,2*Math.PI, false);  // a circle at the start
    ctx.fillStyle = color;
    ctx.fill();
  }

};

var handleMove = function(evt) {
  evt.preventDefault();
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

  for (var i=0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      //store touches to array on movement (as integer values)
      touchesStoreX.push(Math.floor(ongoingTouches[idx].pageX - el.offsetLeft));
      touchesStoreY.push(Math.floor(ongoingTouches[idx].pageY - el.offsetTop));
      // var beginX = touchesStoreX[0];
      // var beginY = touchesStoreY[0];
      // var endX = touchesStoreX[touchesStoreX.length-1];
      // var endY = touchesStoreY[touchesStoreX.length-1];

      // var slope = -(endX-beginX)/(endY-beginY);
      // console.log('SLOPE', slope);

      // var maxHeight = 900;
      // var minHeight = 700;
      // var mustBeLeftOf = 375;
      // var mustBeRightOf = 625;



      //check if line passes min length test

      //check to see if line is within x and y coordinates

      
      ctx.beginPath();
      //log("ctx.moveTo("+ongoingTouches[idx].pageX+", "+ongoingTouches[idx].pageY+");");
      ctx.moveTo(ongoingTouches[idx].pageX - el.offsetLeft, ongoingTouches[idx].pageY - el.offsetTop);
      //log("ctx.lineTo("+touches[i].pageX+", "+touches[i].pageY+");");
      ctx.lineTo(touches[i].pageX - el.offsetLeft, touches[i].pageY - el.offsetTop);
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();

      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
    } else {
      //log("can't figure out which touch to continue");
    }
  }
}

var handleEnd = function(evt) {
  evt.preventDefault();

  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

    //check to see if line is within x and y coordinates
  checkline(touchesStoreX, touchesStoreY, ctx)//ctx



  for (var i=0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);
    console.log("idx", idx);
    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX - el.offsetLeft, ongoingTouches[idx].pageY - el.offsetTop);

      //On end, store the touches arrays on local storage, with UTC as the 3rd array value
      //Using swipecount defined globally
      swipeData[swipeCount] = [touchesStoreX, touchesStoreY, new Date().getTime()];

      swipeCount+=1;





      //Print local storage
      ctx.lineTo(touches[i].pageX - el.offsetLeft , touches[i].pageY - el.offsetTop);
      ctx.fillRect(touches[i].pageX-4 - el.offsetLeft, touches[i].pageY-4 - el.offsetTop, 8, 8);  // and a square at the end
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
      //log("can't figure out which touch to end");
    }
  }

  //VVVV   analyze line here   VVVV
  var beginX = touchesStoreX[0];
  var beginY = touchesStoreY[0];
  var endX = touchesStoreX[touchesStoreX.length-1];
  var endY = touchesStoreY[touchesStoreX.length-1];

  var slope = -(endX-beginX)/(endY-beginY);
  console.log('SLOPE', slope);

  var maxHeight = 900;
  var minHeight = 700;
  var mustBeLeftOf = 375;
  var mustBeRightOf = 625;


  //check if line passes min length test

  //check to see if line is within x and y coordinates
  myFunc();
  if(beginX<=mustBeLeftOf && endX>=mustBeRightOf){
    for(var i = 0; i < touchesStoreY.length; i++){
      // console.log(i, touchesStoreY[i])
      if(touchesStoreY[i] < maxHeight && touchesStoreY[i] > minHeight){
        console.log("YAY!!!");
        //below clears the line 
        ctx.clearRect(0,0,canvas.width,canvas.height);
        //check if line hits square HERE
        //ctx.clearRect(square.x,square.y,square.w,square.h);
      }
    }
  }




  window.localStorage['swipeData'] = JSON.stringify(swipeData);
}

var handleCancel = function(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i=0; i < touches.length; i++) {
    ongoingTouches.splice(i, 1);  // remove it; we're done
  }
}

//TODO: Find out why this doesn't work for Chrome on Android
var colorForTouch = function(touch) {
  var r = touch.identifier % 16;
  var g = Math.floor(touch.identifier / 3) % 16;
  var b = Math.floor(touch.identifier / 7) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  var color = "#" + r + g + b;
  //log("color for touch with identifier " + touch.identifier + " = " + color);
  return color;
}

var copyTouch = function(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

var ongoingTouchIndexById = function(idToFind) {
  for (var i=0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    //Do we want `===` here?
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

var log = function(msg) {
  var p = document.getElementById('log');
  p.innerHTML = msg + "\n" + p.innerHTML;
}

var printLocalStorage = function() {
  console.dir(window.localStorage);
  log("printing");

  //LOCAL STORAGE IS ALL STRINGS
  //DON'T FORGET TO PARSE!
  for (var keys in window.localStorage) {
    JSON.parse(window.localStorage[keys]);

    var swipe = JSON.parse(window.localStorage[keys])
    var swipeX = swipe[0];
    var swipeY = swipe[1];
    var lenX = swipeX.length;
    var lenY = swipeY.length;

    //dx and dy are the difference between the end and start
    var dx = swipeX[lenX - 1] - swipeX[0];

    var dy = swipeY[lenY - 1] - swipeY[0];
    var slope = dy/dx;

    swipeSummary[keys] = [dx, dy, slope];

    //Did I get closer to the top right corner?
    if (dx > 0 && dy < 0) {
      log("EXCITED :D at " + swipe[2]);
    }

    //Did I get closer to the bottom right corner?
    if (dx > 0 && dy > 0) {
      log("ANGRY >:( at " + swipe[2]);
    }
    //Did I get closer to the top left corner?
    if (dx < 0 && dy < 0) {
      log("HAPPY :) at " + swipe[2]);
    }

    //Did I get closer to the bottom left corner?
    if (dx < 0 && dy > 0) {
      log("SAD :( at " + swipe[2]);
    }
  }
};
