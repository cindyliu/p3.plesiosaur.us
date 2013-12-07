/*
 *  puzzle.js
 *
 *  Javascript code to implement the actual puzzle game.
 *
 *  Functions in this file (located at the end):
 *
 *    startGame()
 *    doTiles(bg)
 *    doTileImage(tile, bg_src, bg_x_pos, bg_y_pos)
 *    doPuzzleSolved()
 *
 *  ### This script must be loaded AFTER imgsearch.js ###
 */

// Many functions in this script rely on this variable so I just made it global (ish)
var board_size = 3;

// Listener for user clicking the Start button.
// Starts the game. Basically.
$('#game-controls').on('click', '#start-button', function() {

	// Make sure there's a picture on the board or don't start
	if(($('#board-canvas').html()) != '') {
		// Prevent image search result clicks from replacing the current game image
		game_on = true;

		// Changing board layouts
		$('#difficulty').hide();
		$('#game-controls').html('<input type="button" id="quit-button" value="Quit this game">');
		$('#message').html('');

		// Set board size and go!
		board_size = $('#difficulty').children().val();
		startGame();
	}
	else {
		$('#message').css('color', '#f36');
		$('#message').html('You must pick an image before you can start the puzzle!');
	}

});

// Listener for user clicking the Quit button.
// Ends the game and prepares the board for a new game.
$('#game-controls').on('click', '#quit-button', function() {

	// This should never happen
	if(!game_on) {
		alert('Error: Please reload the page to start over. (clicked quit when game off)');
	}

	// Allow clicking image search results to load a picture onto the board
	game_on = false;

	// Clears the board by using its initialize function
	var game_img = $('#image-selected');
	game_img.fadeIn(setupBoard(game_img));
	
	// Replace board layout objects for game initiation
	$('#difficulty').show();
	$('#game-controls').html('<input type="button" id="start-button" value="Start puzzle!">');

	// Display a message informing the user of his/her action
	if($('#message').html() == 0) {
		$('#message').html('<span id="quit">Game over.</span>');
	}

});

// Wrapper function really. I think it used to have more stuff in it.
function startGame() {

	// Get the puzzle picture, then split it into tiles scattered at random
	var game_img = $('#image-selected');
	game_img.fadeOut(doTiles(game_img));

}

// This is the heavy lifting function. It basically has all the major game
// code as well as game logic and some formatting and stuff.
// -Takes the image argument and "breaks" it into draggable tiles. The number
// of tiles is based on the user-specified variable board_size.
// -Also creates an invisible droppable grid ready to accept the tiles.
// -I realize this may not be the most efficient code ever, but frankly, it
// was the only way I managed to get everything working.
function doTiles(bg) {

	/***** Declare ALL the variables!!!! *****/
	// Calculates size of puzzle tile piece based on user-specified difficulty level
	var piece_size = CANVAS_SIZE / board_size;

	// Defines regions on the playing area where the tiles can be scattered,
	// since I didn't want them to scatter on top of buttons or headings or anything
	var right_border = ((($('#puzzle-board-wrapper').width()) - ($('#board-canvas').width()))/2) - piece_size;
	var bottom_border = $('#puzzle-board-wrapper').height() - piece_size - 100;
	var right_side_offset = right_border + piece_size + CANVAS_SIZE;

	// How we're going to know when we're done making tiles and when the puzzle is solved
	var tile_num = 0;
	tiles_done = 0;

	// Positioning elements. Yay.
	var x, y, bgx, bgy;
	/***** End of variable declarations *****/

	// This is the central loop that generates all the grid pieces and tile pieces,
	// makes them droppable/draggable, and associates one to the other so that
	// the game has a way of determining where a puzzle tile goes and is able
	// to detect when the player has correctly placed a puzzle tile.
	for(var row = 0; row < board_size; row++) {
		for(var col = 0; col < board_size; col++) {
			// Make grid element and add it to the board
			var grid = '<div class=\'grid\' id=\'g' + tile_num + '\'></div>';
			$('#board-canvas').append(grid)
			$('.grid').css({ 'height': piece_size, 'width': piece_size });

			// Make tile element and add it to the playing area
			var tile = '<div class=\'tile\' id=\'t' + tile_num + '\' hidden></div>';
			$('#puzzle-board-wrapper').append(tile);
			$('#t' + tile_num).css({ 'height': piece_size, 'width': piece_size });

			// Determines a randomized location for each tile to appear, but
			// within the boundaries of specific regions to either side of the board
			x = Math.floor(Math.random() * right_border) + (Math.round(Math.random()) * right_side_offset);
			y = Math.floor(Math.random() * bottom_border) + 100;
			$('#t' + tile_num).css({ top: y + 'px', left: x + 'px'});
			bgx = -1 * (col * piece_size);
			bgy = -1 * (row * piece_size);

			// Put the image onto the tile so that it can be identified for play
			doTileImage($('#t' + tile_num), bg.attr('src'), bgx, bgy);

			// Finally make the tile appear
			$('#t' + tile_num).fadeIn();

			// Update tile tally
			tile_num++;
		}
	}

	// This should never happen either, but it helped me catch some bugs anyway....
	if(tile_num != (board_size * board_size)) {
		alert('Error: Please reload the page to start over. (final tile_num != board_size^2)')
		console.log(tile_num, board_size);
	}

	/********** DRAGGABLE AND DROPPABLE SETTINGS **********/
	// Make grid elements droppable and ready to receive tiles.
	// Provide them with a way of recognizing when the correct tile is dropped onto it.
	// And check for puzzle completion on every drop event.
	$('.grid').droppable({
		accept: '.tile',
		drop: function(event, ui) {
			// Get the grid and tile id numbers
			var grid_num = parseInt($(this).attr('id').slice(1));
			var tile_num = parseInt($(ui.draggable).attr('id').slice(1));
			
			// If they match, "snap" the tile into place and prevent it from being
			// able to be dragged any further. Also remove grid element's droppability.
			if(grid_num == tile_num) {
				ui.draggable.draggable('widget').offset($(this).droppable('widget').offset());
				ui.draggable.draggable('option', 'disabled', true);
				ui.draggable.draggable('widget').css('border', 'none');
				ui.draggable.draggable('widget').css('z-index', '0');
				$(this).droppable('option', 'disabled', true);

				// And keep track of the player's progress!
				tiles_done++;
			}

			// Are we there yet?
			if(tiles_done == (board_size * board_size)) {
				doPuzzleSolved();
			}
		}
	});

	// Make tile elements draggable and more obviously so.
	// Set them to line up to the grid elements to help the player see
	// where the pieces can go. Also make the piece being dragged go on top.
	$('.tile').draggable({
		containment: '#puzzle-board-wrapper',
		cursor: 'crosshair',
		snap: '.grid',
		snapMode: 'inner',
		stack: '.tile'
	});

}

// This may not be the most efficient way of "tiling" the image, but it was
// the only way I could find. Basically you generate a bunch of tile elements
// that are the same size as the grid elements, then you put the puzzle image
// as the background image of each tile. But each tile has the background image
// positioned differently so that only the part that that tile represents is showing.
// The positional calculations are done in doTiles(), above.
function doTileImage(tile, bg_src, bg_x_pos, bg_y_pos) {
	
	var bg_url = 'url(\'' + bg_src + '\')';

	tile.css('background-position', bg_x_pos + 'px ' + bg_y_pos + 'px');
	tile.css('background-image', bg_url);

	// Back when I was still trying to get image scaling to work in IE8 - HA!
	//tile.css('filter', IE_BGSIZE_HEAD + bg_src + IE_BGSIZE_TAIL);
	//tile.css('-ms-filter', '\'' + IE_BGSIZE_HEAD + bg_src + IE_BGSIZE_TAIL + '\'');

}

// What do we do when we get there?
function doPuzzleSolved() {

	// Fade out the completed tiled board and fade in the original image.
	// Produces a nice "pulse" effect to let the player know they're done.
	var game_img = $('#image-selected');
	game_img.fadeIn(setupBoard(game_img));

	// Replace all the game-starting layout elements
	$('#difficulty').show();
	$('#game-controls').html('<input type="button" id="start-button" value="Play again!">');

	// Congratulate the player so s/he feels good about him/herself
	$('#message').html('<span id="success">' + SUCCESS_MESSAGE + '</span>');
	
	// Allow new images to be loaded onto the board
	game_on = false;

	// I eventually decided this was annoying so I took it out.
	//alert(SUCCESS_MESSAGE);

}
