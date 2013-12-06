
$('#game-controls').on('click', '#start-button', function() {
	
	if(($('#board-canvas').html()) != '') {
		game_on = true;
	
		$('#game-controls').html('<input type="button" id="quit-button" value="Quit this game">'
								+'<input type="button" id="reset-button" value="Reset puzzle">');

		startGame();
	
		console.log('Puzzle started');
	}
	else {
		$('#message').css('color', 'red');
		$('#message').html('You must pick an image before you can start the puzzle!');
	}

});

$('#game-controls').on('click', '#quit-button', function() {
	console.log('clicked stop button');
	if(!game_on) {
		alert('Error: Please reload the page to start over. (clicked quit when game off)');
	}

	game_on = false;

	$('#game-controls').html('<input type="button" id="start-button" value="Start puzzle!">');

	$('#message').html('Game over!');

});

$('#game-controls').on('click', '#reset-button', function () {
	$('#message').html('Puzzle reset!');
});


$('.grid').on('drop', function(ui) {
	var grid_num = parseInt($(this).attr('id').slice(1));
	var tile_num = parseInt($(ui.draggable).attr('id').slice(1));
	if(grid_num == tile_num) {
		ui.draggable.draggable('option', 'disabled', true);
		ui.draggable.css('border', '');
		tiles_done++;
	}

	if(tiles_done == (board_size * board_size)) {
		doPuzzleSolved();
	}
});


/* Divides the image on the board into x identical square pieces,
 *   where x = board_size * board_size;
 */
function startGame() {

	var game_img = $('#image-selected');

	setupBoard(game_img);

	game_img.fadeOut(doTiles(game_img));

}

function doTiles(bg) {

	var piece_size = CANVAS_SIZE / board_size;
	var right_border = ((($('#puzzle-board-wrapper').width()) - ($('#board-canvas').width()))/2) - piece_size;
	var bottom_border = $('#puzzle-board-wrapper').height() - piece_size - 100;
	var right_side_offset = right_border + piece_size + CANVAS_SIZE;
	var bg_url = 'url(' + bg.attr('src') + ')';
	var tile_num = 0;
	var x, y, bgx, bgy;
	
	console.log('Piece size = ' + piece_size);

	for(var row = 0; row < board_size; row++) {
		for(var col = 0; col < board_size; col++) {
			var grid = '<div class=\'grid\' id=\'g' + tile_num + '\'></div>';
			$('#board-canvas').append(grid)
			$('.grid').css({ 'height': piece_size, 'width': piece_size });
			var tile = '<div class=\'tile\' id=\'t' + tile_num + '\'></div>';
			$('#puzzle-board-wrapper').append(tile);
			$('#t' + tile_num).css({ 'height': piece_size, 'width': piece_size });
			x = Math.floor(Math.random() * right_border) + (Math.round(Math.random()) * right_side_offset);
			y = Math.floor(Math.random() * bottom_border) + 100;
			$('#t' + tile_num).css({ top: y + 'px', left: x + 'px'});
			bgx = -1 * (col * piece_size);
			bgy = -1 * (row * piece_size);
			$('#t' + tile_num).css('background-position', bgx + 'px ' + bgy + 'px');
			$('#t' + tile_num).css('background-image', bg_url);
			tile_num++;
		}
	}

	if(tile_num != (board_size * board_size)) {
		alert('Error: Please reload the page to start over. (final tile_num != board_size^2)')
	}

	$('.grid').droppable({ accept: '.tile',  });
	$('.tile').draggable({ containment: '#puzzle-board-wrapper', cursor: 'crosshair', snap: '.grid', snapMode: 'inner' });

}



function doPuzzleSolved() {
	$('#message').html('Congratulations, you solved the puzzle!');
}
