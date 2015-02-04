angular.module('d3', [])
  .factory('d3Service', [function(){
    var d3;
    d3.select("body").select("svg").append("rect")
      .attr("rx",500)
      .attr("ry",500)
      .attr("x",1000)
      .attr("y",1000)
      .attr("width",100)
      .attr("height",100)
      .attr("stroke","black")
      .attr("fill","red");
    return d3;
  }];