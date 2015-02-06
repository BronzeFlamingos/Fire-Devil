var timeUp = false;
var level = 0;
var levels = [
{minScore: 20, color: "purple", timer: 5000},
{minscore: 40, color: "green", timer: 3000}
]
var time = 30;
var didYouWin = true;

var getTime = function(){
  $('h2').text("Time: " + time);
  time--;
  if(time === 0){
    didYouWin = false;
    endLevel(didYouWin);
    //stop timer
  }
}


var timer = function () {
  setInterval(getTime, 1000);
};

var endLevel = function (didYouWin) {
  //render something depending on win state
  //clear screen
  if(didYouWin){
    // alert('You Win! Get ready for the next level!');
    var nextLevel = level++;
    //startup();;
  }else{
    // alert('You Lose! Back to Level 1');
    level = 0;
    //startup();
  }
};


var initLevel = function (ctx, level) {
  timer();
  var finalCountDown = addRect(ctx, level.color, level.timer);
  setInterval(finalCountDown,33);
};






