$(document).ready(function() {
  init();
});

$("#start").click(function(){
  //destroy the board
  $("#wrapper").children().remove();
  //clear the loser message if needed
  $("#announcement").empty();
  init();
  
});

rows = 12;
columns = 12;

function init() {
  //clone army
  var $row = $("<div />", { class: 'row' });
  var $square = $("<div />", { class: 'square' });

  //add columns to the the temp row object
  for (var i = 0; i < columns; i++) {
    $row.append($square.clone().attr("x", i + 1));
  }
  //clone the temp row object with the columns to the wrapper
  for (var i = 0; i < rows; i++) {
    var rowtemp = $row.clone();
    $(rowtemp).find(".square").attr("y", i + 1);
    $("#wrapper").append(rowtemp);
  }

  //number the squares, add attributes
  $(".square").each(function(index) {
    var num = index;
    $(this).attr('data-prop', num);
    $(this).attr('data-risk', 0);
    $(this).addClass("g" + num);
  });

  //get the number of mines
  var mines = Math.floor((rows * columns) / 6);

  //place the mines
  for (var i = 1; i <= mines; i++) {
    var place = Math.floor(Math.random() * (rows * columns));
    $(".g" + place).text("x").addClass("invis");
  }

  //populate risk
  $(".square").each(function() {
    if ($(this).text() === "x") {
      var xx = parseInt($(this).attr("x"));
      var yy = parseInt($(this).attr("y"));

      //left
      // TODO: is there a more efficient way to do this, and is it worth bothering?
      if (xx > 1) {
        var prevrisk = $(".square[x='" + (xx - 1) + "'][y='" + yy + "']").attr('data-risk');
        $(".square[x='" + (xx - 1) + "'][y='" + yy + "']").attr('data-risk', (parseInt(prevrisk) + 1));
      }
      //right
      if (xx < columns) {
        var nextrisk = $(".square[x='" + (xx + 1) + "'][y='" + yy + "']").attr('data-risk');
        $(".square[x='" + (xx + 1) + "'][y='" + yy + "']").attr('data-risk', (parseInt(nextrisk) + 1));
      }
      //top
      if (yy > 1) {
        var toprisk = $(".square[x='" + (xx) + "'][y='" + (yy - 1) + "']").attr('data-risk');
        $(".square[x='" + (xx) + "'][y='" + (yy - 1) + "']").attr('data-risk', (parseInt(toprisk) + 1));
      }
      //bottom
      if (yy < rows) {
        var bottrisk = $(".square[x='" + (xx) + "'][y='" + (yy + 1) + "']").attr('data-risk');
        $(".square[x='" + (xx) + "'][y='" + (yy + 1) + "']").attr('data-risk', (parseInt(bottrisk) + 1));
      }
      //topleft
      if (xx > 1 && yy > 1) {
        var tlrisk = $(".square[x='" + (xx - 1) + "'][y='" + (yy - 1) + "']").attr('data-risk');
        $(".square[x='" + (xx - 1) + "'][y='" + (yy - 1) + "']").attr('data-risk', (parseInt(tlrisk) + 1));
      }
      //topright
      if (yy > 1 && xx < columns) {
        var trrisk = $(".square[x='" + (xx + 1) + "'][y='" + (yy - 1) + "']").attr('data-risk');
        $(".square[x='" + (xx + 1) + "'][y='" + (yy - 1) + "']").attr('data-risk', (parseInt(trrisk) + 1));
      }
      //bottomleft
      if (yy < rows && xx > 1) {
        var blrisk = $(".square[x='" + (xx - 1) + "'][y='" + (yy + 1) + "']").attr('data-risk');
        $(".square[x='" + (xx - 1) + "'][y='" + (yy + 1) + "']").attr('data-risk', (parseInt(blrisk) + 1));
      }
      //bottomright
      if (yy < rows && xx < columns) {
        var brrisk = $(".square[x='" + (xx + 1) + "'][y='" + (yy + 1) + "']").attr('data-risk');
        $(".square[x='" + (xx + 1) + "'][y='" + (yy + 1) + "']").attr('data-risk', (parseInt(brrisk) + 1));
      }
    }

  });

  //PLAY THE GODDAMN GAME
  $(".square").click(function() {
    //safe move
    if ($(this).text() !== "x") {
      if ($(this).attr('data-risk') > 0) {
        $(this).text($(this).attr('data-risk'));
        $(this).addClass("grey");
      };
      var therisk = parseInt($(this).attr('data-risk'));
      var theloc = parseInt($(this).attr('data-prop'));
      //if this is an empty square, floodfill
      if (therisk === 0) {
        filler(theloc);
      }
    }
    //losing move;
    else if ($(this).text() === "x") {
      $(this).addClass("trump");
      //TODO: multiple trump sfx
      var audio = new Audio('https://dl.dropboxusercontent.com/u/31750021/trump.wav');
      audio.play();
      endgame();
    }
  });

};
  
// floodfill recursive function
function filler(dprop) {
  //if the square isn't gray or a trump
  if (!$(".g" + dprop).hasClass("grey") && $(".g" + dprop).text() !== "x") {
    //make it gray
    $(".g" + dprop).addClass("grey");
    //if the square is a border square
    if ($(".g" + dprop).attr('data-risk') > 0) {
      //print it's value and end the loop
      $(".g" + dprop).text($(".g" + dprop).attr('data-risk'));
      return;
    };
    //loop to the right, loop to the left, down and up
    if ($(".g" + dprop).attr("x") != columns) { filler(dprop + 1); }
    if ($(".g" + dprop).attr("x") != 1)       { filler(dprop - 1); }
    if ($(".g" + dprop).attr("y") != rows)    { filler(dprop + columns); }
    if ($(".g" + dprop).attr("y") != 1)       { filler(dprop - columns); }
  }
}

function endgame() {
  $(".square").each(function(){
    //no more clicking!
    $(this).unbind("click");
    //show all the trumps
    if ($(this).text() === "x") { $(this).addClass("trump"); };
    //it's a joke, moron
    $("#announcement").text("Your a loser!");
  });
}