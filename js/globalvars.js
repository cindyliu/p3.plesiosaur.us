var SEARCH_PAGE_NUMBERS = ['1','2','3','4','5','6','7','8'];
var CANVAS_SIZE = 420; // this size was chosen because 420 is the lowest common multiple of 3, 4, 5, 6, and 7

var search_term = null;

var board_size = 5; // 5x5 board; hoping to eventually have option to pick board size of 3x3, 4x4, 5x5, 6x6, or 7x7
var tiles_done = 0;
var board = Array();
var game_on = false;
