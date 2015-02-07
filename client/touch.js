
var neon = ["#ff00ff","#00ffff","#00ff00","#ffff00","#ff0000","#83f52c","#FD0987","#FF3300"];

var ongoingTouches = [];

//Create storage arrays
var touchesStoreX = [];
var touchesStoreY = [];

//Create a counter for each swipe event
var swipeData = {};
var swipeCount = 0;
var swipeSummary = {};

// Get user name to correlate with swipeData



var heldboxes = [];
var boxcount = 0;

var CreateBox = function(x, y, timer, ctx){
  this.xPosition = x;
  this.yPosition = y;
  this.place = boxcount;
  boxcount++;
  setTimeout(this.killSelf.bind(this), timer, ctx);
};

CreateBox.prototype.killSelf = function(ctx){
  //var nextColor = neon[Math.floor(Math.random()*8)]
  ctx.clearRect(this.xPosition,this.yPosition,100,100); 
  for (var i=0; i<heldboxes.length; i++){
    if(heldboxes[i].place===this.place){
      heldboxes.splice(i,1);
    }
  }
};

var addRect = function(ctx, level){
  var count = 15;
  var color = level.color;
  var inner = function(){    
    var rand = Math.floor(Math.random()*count);
    if (rand===3 && heldboxes.length<11){
      var x = 25 + Math.floor(Math.random()*850);
      var y = 25 + Math.floor(Math.random()*1450);
      var flag = true;
      for(var i=0; i<heldboxes.length; i++){
        if(Math.abs(heldboxes[i].xPosition-x)<100&&Math.abs(heldboxes[i].yPosition-y)<100){
          flag = false;
        }
      }
      if(flag){        
        // if (count>15){
        //   count--;
        // }
        heldboxes.push(new CreateBox(x,y,level.timer,ctx));
        ctx.fillStyle = color;
        ctx.fillRect(x,y,100,100);
      }
    }
  }
  return inner;
}

var checkline = function(touchesStoreX, touchesStoreY, ctx){
  var beginX = touchesStoreX[0];
  var beginY = touchesStoreY[0];
  var endX = touchesStoreX[touchesStoreX.length-1];
  var endY = touchesStoreY[touchesStoreX.length-1];
  var slope = -(endX-beginX)/(endY-beginY);

  for (var j=0; j<heldboxes.length; j++){  
    var maxHeight = heldboxes[j].yPosition+100;
    var minHeight = heldboxes[j].yPosition;
    var mustBeLeftOf = heldboxes[j].xPosition;
    var mustBeRightOf = heldboxes[j].xPosition+100;
    if((beginX<=mustBeLeftOf && endX>=mustBeRightOf) || (beginX>=mustBeLeftOf && endX<=mustBeRightOf)){
      var touchOccurs = false;
      var staysIn = true
      for(var i = 0; i < touchesStoreY.length; i++){
        // console.log(i, touchesStoreY[i])
        if(touchesStoreY[i] < maxHeight && touchesStoreY[i] > minHeight){
          touchOccurs = true;
        }
        if(touchesStoreY[i] > maxHeight || touchesStoreY[i] < minHeight){
          staysIn=false;
        }
      }
      //below clears the line 
      if(touchOccurs&&staysIn){
        scoreMethods.addScore();
        ctx.fillStyle = 'green';
        ctx.fillRect(heldboxes[j].xPosition,heldboxes[j].yPosition,100,100);
        var clearSoon = function(ctx, x, y){
          console.log("CLEARING");
          ctx.clearRect(x,y,100,100);
        } 
        setTimeout(clearSoon, 200, ctx, heldboxes[j].xPosition, heldboxes[j].yPosition);
        heldboxes.splice(j,1);
        flag = false;
      }
      //check if line hits square HERE
      //ctx.clearRect(square.x,square.y,square.w,square.h);
        
    }
  }

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

  var maxHeight = 900;
  var minHeight = 700;
  var mustBeLeftOf = 375;
  var mustBeRightOf = 625;


  //check if line passes min length test

  //check to see if line is within x and y coordinates
  if(beginX<=mustBeLeftOf && endX>=mustBeRightOf){
    for(var i = 0; i < touchesStoreY.length; i++){
      // console.log(i, touchesStoreY[i])
      if(touchesStoreY[i] < maxHeight && touchesStoreY[i] > minHeight){
        
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

      }
};

var startup = function(level) {
  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchleave", handleEnd, false);
  el.addEventListener("touchmove", handleMove, false);
  var c = document.getElementById("canvas");
  var ctx = c.getContext("2d");
  totalScore = 0;
  console.log('boxes', heldboxes);
  for (var i = 0; i < heldboxes.length; i++){
        ctx.clearRect(heldboxes[i].xPosition,heldboxes[i].yPosition,100,100);
  }
  // heldboxes = [];
  console.log('thisisthelevels', level.minScore)
  minScore = level.minScore;
  $('h1').text("Score: " + ""+totalScore+""+"/"+""+minScore+"");
  $('#lvl').addClass('newLevel');
  $('.gameboard').css('background-image', 'url('+level.backgroundUrl+')')
  
  setTimeout(function() {
    $('#lvl').removeClass('newLevel');
  }, 2000);
  
  console.log('starting at level: ', level);
  var finalCountDown = addRect(ctx, level);
  setInterval(finalCountDown,33);
};

window.onload = function() {
  if (confirm('Are you ready?')){

    startup(levels[0]);
  }else{
    if (confirm('Are you ready?')){
      startup(levels[0]);
    }
  }
};

