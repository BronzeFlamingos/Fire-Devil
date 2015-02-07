var totalScore = 0;
console.log('FROM SCORE METHODS', levels[level]['minScore'])
var minScore = levels[level]['minScore'];
var scoreMethods = {
    // score: 0,
    addScore: function() {
      console.log('this is score', totalScore)
      totalScore += 5;
       $('h1').text("Score: " + ""+totalScore+""+"/"+""+minScore+"");
       if (totalScore === minScore) {
        $('.progressBar').prop("value", 0);
       } else {
        $('.progressBar').prop("value", totalScore);
       }
       $('.progressBar').prop("max", minScore);
      if (this.checkScore() === true) {
        var didYouWin = true;
        endLevel(didYouWin);

      }
    },
    subtractScore: function() {
      $('h1').text("Score: " + ""+totalScore+""+"/"+""+minScore+"");
      totalScore -= 5;
    },
    checkScore: function() {
      return totalScore >= minScore;
    }
}


 