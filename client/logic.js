var timeUp = false;
var level = 0;
var levels = [
{minScore: 20, color: "violet", timer: 5000, id: 1},
{minScore: 40, color: "indigo", timer: 4500, backgroundUrl: "img/star.gif", id: 2},
{minScore: 50, color: "blue", timer: 4000, backgroundUrl: "img/tunnel.gif", id: 3},
{minScore: 60, color: "#39FF14", timer: 3500, backgroundUrl: "img/swerve.gif", id:4},
{minScore: 70, color: "yellow", timer: 3000, backgroundUrl: "img/computers.gif", id:5},
{minScore: 80, color: "orange", timer: 2500, backgroundUrl: "img/pizza.gif", id:6},
{minScore: 90, color: "red", timer: 2000, backgroundUrl: "img/pixels.gif", id:7},
{minScore: 100, color: "#1D79F2", timer: 2000, backgroundUrl: "img/eating.gif", id:8},
{minScore: 110, color: "#4EBFD9", timer: 1900, backgroundUrl: "img/dance.gif", id:9},
{minScore: 120, color: "#63F279", timer: 1800, backgroundUrl: "img/swerve.gif", id:10},
{minScore: 130, color: "#F28705", timer: 1800, backgroundUrl: "img/colbert.gif", id:11},
{minScore: 140, color: "#F20505", timer: 1800, backgroundUrl: "img/disco.gif", id:12},
{minScore: 150, color: "#B202F2", timer: 1800, backgroundUrl: "img/tunnel.gif", id:13},
{minScore: 160, color: "#D86DF2", timer: 1800, backgroundUrl: "img/pixels.gif", id:14}
]
var time = 120;
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
    //alert('You Win! Get ready for the next level!');
    level++;
    var nextLevel = level;
    console.log(nextLevel);
    console.log(levels[nextLevel]);
    startup(levels[nextLevel]);
  }else{
    // alert('You Lose! Back to Level 1');
    level = 0;
    // startup();
  }
};

var initLevel = function (ctx, level) {
  timer();
  var finalCountDown = addRect(ctx, level.color, level.timer);
  setInterval(finalCountDown,33);
};

myAudio = new Audio('audio/techloop.ogg'); 
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
myAudio.play();






