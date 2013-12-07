/*
 *  globalvars.js
 *
 *  Global variables used in the puzzle game implementation.
 *  Separated into its own file so that it can be loaded in the
 *    HTML header rather than the body.
 */

// The array of page number labels to "scroll" through search results
var SEARCH_PAGE_NUMBERS = ['1','2','3','4','5','6','7','8'];

// Size of playing board. This size was chosen because 420 is
// the lowest common multiple of 3, 4, 5, 6, and 7
var CANVAS_SIZE = 420;

// To ease workaround for getting element background image scaling
// to work in IE8 and earlier
var IE_BGSIZE_HEAD = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='
var IE_BGSIZE_TAIL = ', sizingMethod=\'scale\');'

// What to display to the user when they've solved the puzzle
var SUCCESS_MESSAGE = 'Congratulations! You solved the puzzle!!';

// Holds the user input from the search text box
var search_term = null;

// 5x5 board; hoping to eventually have option to pick
// board size of 3x3, 4x4, 5x5, 6x6, or 7x7
var board_size = 3;

// Stores the number of tiles that have been correctly placed
var tiles_done = 0;

// State of game: is one in progress or not?
var game_on = false;
