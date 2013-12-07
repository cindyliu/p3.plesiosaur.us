

var board_size = 3;


$('#game-controls').on('click', '#start-button', function() {

	if(($('#board-canvas').html()) != '') {
		game_on = true;

		$('#difficulty').hide();
		$('#game-controls').html('<input type="button" id="quit-button" value="Quit this game">');
		$('#message').html('');

		board_size = $('#difficulty').children().val();
		startGame();
	}
	else {
		$('#message').css('color', '#f36');
		$('#message').html('You must pick an image before you can start the puzzle!');
	}

});

$('#game-controls').on('click', '#quit-button', function() {

	if(!game_on) {
		alert('Error: Please reload the page to start over. (clicked quit when game off)');
	}

	game_on = false;

	var game_img = $('#image-selected');
	game_img.fadeIn(setupBoard(game_img));
	
	$('#difficulty').show();
	$('#game-controls').html('<input type="button" id="start-button" value="Start puzzle!">');

	if($('#message').html() == 0) {
		$('#message').html('<span id="quit">Game over.</span>');
	}

});

/* Divides the image on the board into x identical square pieces,
 *   where x = board_size * board_size;
 */
function startGame() {

	var game_img = $('#image-selected');
	game_img.fadeOut(doTiles(game_img));

}

function doTiles(bg) {

	var piece_size = CANVAS_SIZE / board_size;
	var right_border = ((($('#puzzle-board-wrapper').width()) - ($('#board-canvas').width()))/2) - piece_size;
	var bottom_border = $('#puzzle-board-wrapper').height() - piece_size - 100;
	var right_side_offset = right_border + piece_size + CANVAS_SIZE;
	var tile_num = 0;
	var x, y, bgx, bgy;
	tiles_done = 0;

	for(var row = 0; row < board_size; row++) {
		for(var col = 0; col < board_size; col++) {
			var grid = '<div class=\'grid\' id=\'g' + tile_num + '\'></div>';
			$('#board-canvas').append(grid)
			$('.grid').css({ 'height': piece_size, 'width': piece_size });
			var tile = '<div class=\'tile\' id=\'t' + tile_num + '\' hidden></div>';
			$('#puzzle-board-wrapper').append(tile);
			$('#t' + tile_num).css({ 'height': piece_size, 'width': piece_size });
			x = Math.floor(Math.random() * right_border) + (Math.round(Math.random()) * right_side_offset);
			y = Math.floor(Math.random() * bottom_border) + 100;
			$('#t' + tile_num).css({ top: y + 'px', left: x + 'px'});
			bgx = -1 * (col * piece_size);
			bgy = -1 * (row * piece_size);
			doTileImage($('#t' + tile_num), bg.attr('src'), bgx, bgy);
			$('#t' + tile_num).fadeIn();
			tile_num++;
		}
	}

	if(tile_num != (board_size * board_size)) {
		alert('Error: Please reload the page to start over. (final tile_num != board_size^2)')
		console.log(tile_num, board_size);
	}

	$('.grid').droppable({
		accept: '.tile',
		drop: function(event, ui) {
			var grid_num = parseInt($(this).attr('id').slice(1));
			var tile_num = parseInt($(ui.draggable).attr('id').slice(1));
			if(grid_num == tile_num) {
				ui.draggable.draggable('widget').offset($(this).droppable('widget').offset());
				ui.draggable.draggable('option', 'disabled', true);
				ui.draggable.draggable('widget').css('border', 'none');
				$(this).droppable('option', 'disabled', true);
				tiles_done++;
			}

			if(tiles_done == (board_size * board_size)) {
				doPuzzleSolved();
			}
		}
	});
	$('.tile').draggable({
		containment: '#puzzle-board-wrapper',
		cursor: 'crosshair',
		snap: '.grid',
		snapMode: 'inner',
		stack: '.tile'
	});

}


function doTileImage(tile, bg_src, bg_x_pos, bg_y_pos) {
	var bg_url = 'url(\'' + bg_src + '\')';

	tile.css('background-position', bg_x_pos + 'px ' + bg_y_pos + 'px');
	tile.css('background-image', bg_url);
//	tile.css('filter', IE_BGSIZE_HEAD + bg_src + IE_BGSIZE_TAIL);
//	tile.css('-ms-filter', '\'' + IE_BGSIZE_HEAD + bg_src + IE_BGSIZE_TAIL + '\'');
}

function doPuzzleSolved() {
	var game_img = $('#image-selected');
	game_img.fadeIn(setupBoard(game_img));
	$('#difficulty').show();
	$('#game-controls').html('<input type="button" id="start-button" value="Play again!">');
	$('#message').html('<span id="success">' + SUCCESS_MESSAGE + '</span>');
	game_on = false;
//	alert(SUCCESS_MESSAGE);
}
