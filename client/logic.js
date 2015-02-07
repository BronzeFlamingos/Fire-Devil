var timeUp = false;
var level = 0;
var levels = [
{minScore: 20, color: "violet", timer: 5000, backgroundUrl: "img/swerve.gif", id: 1},
{minscore: 40, color: "indigo", timer: 4500, backgroundUrl: "img/star.gif", id: 2},
{minScore: 40, color: "blue", timer: 4000, backgroundUrl: "img/pixels.gif", id: 3},
{minScore: 50, color: "#39FF14", timer: 3500, id:4},
{minScore: 60, color: "yellow", timer: 3000, id:5},
{minScore: 70, color: "orange", timer: 2500, id:6},
{minScore: 80, color: "red", timer: 2000, id:7}
]
var time = 120;
var didYouWin = true;

// var getTime = function(){
//   $('h2').text("Time: " + time);
//   time--;
//   if(time === 0){
//     didYouWin = false;
//     endLevel(didYouWin);
//     //stop timer
//   }
// }


// var timer = function () {
//   setInterval(getTime, 1000);
// };

var endLevel = function (didYouWin) {
  //render something depending on win state
  //clear screen
  if(didYouWin){
    //alert('You Win! Get ready for the next level!');
    level++;
    var nextLevel = level;
    console.log(nextLevel);
    console.log(levels[nextLevel]);
    startup(levels[nextLevel]);
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








