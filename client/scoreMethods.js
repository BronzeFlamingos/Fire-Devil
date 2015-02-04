var totalScore = 0;
var scoreMethods = {
    // score: 0,
    addScore: function() {
      totalScore += 5;
      $('h1').text("Score: " + ""+totalScore+"")
    },
    subtractScore: function() {
      $('h1').text("Score: " + ""+totalScore+"")
      totalScore -= 5;
    },
    getScore: function() {
      return totalScore;
    }
}


 