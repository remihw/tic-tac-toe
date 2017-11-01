var user;
var comp;
var startingPlayer;
var startNum;
var board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
var acceptInput = "false";

$("#symbol-o, #symbol-x").on("click", function() {
  $("#select-symbol").hide();
  $("#select-difficulty").show();
  if ($(this).attr("id") === "symbol-o") {
    user = "o";
    comp = "x";
    startingPlayer = comp;
    firstMoveComp();
  } else {
    user = "x";
    comp = "o";
    startingPlayer = user;
    acceptInput = "true";
  }
});

$(".difficulty-options").on("click", function() {
  $("#select-difficulty").hide();
  $("#game").show();
  if ($(this).attr("id") === "easy") {
    $("#txt-difficulty span").text("Easy");
    startNum = 1;
  } else if ($(this).attr("id") === "normal") {
    $("#txt-difficulty span").text("Normal");
    startNum = 5;
  } else {
    $("#txt-difficulty span").text("Impossible");
    startNum = 10;
  }
});

//when the computer goes first it will start with a random move
//after that the minimax algorithm is used
var firstMoveComp = function() {
  var randomNum = Math.floor(Math.random() * 8);
  board[randomNum] = comp;
  $("#" + randomNum).html(comp);
  $("#" + randomNum).removeClass("js-hover");
  acceptInput = "true";
};

var placeSymbol = function(player, num) {
  board[num] = player;
  $("#" + num).html(player);
  $("#" + num).removeClass("js-hover");
  var str = board.join();
  if (checkResult(player, board)) {
    if (player === user) {
      addWin("user");
    } else {
      addWin("comp");
    }
    setTimeout(function() {
      startNextGame();
    }, 1500);
  } else if (str.match(/\s/) === null) {
    setTimeout(function() {
      startNextGame();
    }, 1500);
  } else {
    if (player === user) {
      setTimeout(function() {
        placeSymbol(comp, miniMax(comp, -1, board));
      }, 500);
    } else {
      acceptInput = "true";
    }
  }
};

var checkResult = function(player, board) {
  if ((board[0] === player && board[1] === player && board[2] === player) ||
      (board[3] === player && board[4] === player && board[5] === player) ||
      (board[6] === player && board[7] === player && board[8] === player) ||
      (board[0] === player && board[3] === player && board[6] === player) ||
      (board[1] === player && board[4] === player && board[7] === player) ||
      (board[2] === player && board[5] === player && board[8] === player) ||
      (board[0] === player && board[4] === player && board[8] === player) ||
      (board[2] === player && board[4] === player && board[6] === player)) {
    return true;
  } else {
    return false;
  }
};

var addWin = function(player) {
  var num = parseInt($("#score-" + player).html()) + 1;
  $("#score-" + player).html(num);
};

var startNextGame = function() {
  resetBoard();
  if (startingPlayer === user) {
    setTimeout(function() {
      firstMoveComp();
    }, 200);
    startingPlayer = comp;
  } else {
    acceptInput = "true";
    startingPlayer = user;
  }
};

var resetGame = function() {
  resetBoard();
  $("#score-user").html("0");
  $("#score-comp").html("0");
};

var resetBoard = function() {
  board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  for (var i = 0; i < 9; i++) {
    $("#" + i).html("");
    $("#" + i).css("color","#f4f4f4");
  }
};

var miniMax = function(player, depth, board) {
  var values = [];
  var moves = [];
  var str = board.join();
  if (checkResult(comp, board)) {
    return startNum - depth;
  } else if (checkResult(user, board)) {
    return depth - startNum;
  } else if (str.match(/\s/) === null) {
    return 0;
  }
  for (var i = 0; i < board.length; i++) {
    var nextBoard = board.slice();
    var nextDepth = depth;
    var value;
    if (nextBoard[i] === " ") {
      nextBoard[i] = player;
      nextDepth += 1;
      if (nextDepth === 0) {
        moves.push(i);
      }
      if (player === comp) {
        value = miniMax(user, nextDepth, nextBoard);
      } else {
        value = miniMax(comp, nextDepth, nextBoard);
      }
      values.push(value);
    }
  }
  if (player === comp) {
    bestValue = Math.max.apply(Math, values);
  } else {
    bestValue = Math.min.apply(Math, values);
  }
  if (values.length === moves.length) {
    var index = values.indexOf(Math.max.apply(Math, values));
    return moves[index];
  } 
  return bestValue;
};

$(".game-board-tile").on("click", function() {
  if (acceptInput === "true" && board[$(this).attr("id")] === " ") {
    acceptInput = "false";
    $(this).css("color", "#e7bd64");
    placeSymbol(user, $(this).attr("id"));
  }
});

$(".game-board-tile").mouseover(function() {
  if (acceptInput === "true" && board[$(this).attr("id")] === " ") {
    $(this).addClass("js-hover");
  }
});

$("#btn-reset").on("click", function() {
  acceptInput = "false";
  resetGame();
  $("#game").hide();
  $("#select-symbol").show();
});