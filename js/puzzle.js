var CANVAS_SIZE = 420; // this size was chosen because 420 is the lowest common multiple of 3, 4, 5, 6, and 7

var board_size = 5; // 5x5 board; hoping to eventually have option to pick board size of 3x3, 4x4, 5x5, 6x6, or 7x7

$('#game-controls').on('click', '#start-button', function() {
	
	if(($('#board-canvas').html()) != '') {
		game_on = true;
	
		$('#game-controls').html('<input type="button" id="quit-button" value="Quit this game">'
								+'<input type="button" id="reset-button" value="Reset puzzle">');
	
		console.log('Puzzle started');
	}

});

$('#game-controls').on('click', '#quit-button', function() {
	console.log('clicked stop button');
	if(!game_on) {
		alert('Error: Please reload the page to start over. (clicked quit when game off)');
	}

	game_on = false;

	$('#game-controls').html('<input type="button" id="start-button" value="Start puzzle!">');

	console.log('Puzzle stopped');

});

$('#game-controls').on('click', '#reset-button', function () {
	console.log('reset button was clicked');
});


/* Divides the image on the board into x identical square pieces,
 *   where x = board_size * board_size;
 */
function makeBoardGrid() {
	var tile_num = 0;

	var piece_size = CANVAS_SIZE / board_size;

	console.log('Piece size = ' + piece_size);

	for(var i = 0; i < board_size; i++) {
		for(var j = 0; j < board_size; j++) {
			var piece = new Image();
			piece.attr('id', 'grid-' + tile_num);
			piece.droppable( { accept: 'tile-' + tile_num } );
			tile_num++;
		}
	}

	if(tile_num != (board_size * board_size)) {
		alert('Error: Please reload the page to start over. (final tile_num != board_size^2)')
	}

}

