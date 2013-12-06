function Tile(size, t_id) {

	var tile = document.createElement('div');
	
	tile.style.height = size;
	tile.style.width = size;
	tile.id = t_id;

	this.setTileImage = setTileImage;

	function setTileImage(img_src, x_pos, y_pos) {
		tile.style.backgroundImage = img_src;
		//tile.style.backgroundPosition = -x_pos + 'px ' + -y_pos + 'px';
	}
}

var t = new Tile(100, 'tid');

$('#board').append(t);

t.setTileImage($('#pic').attr('src'), 50, 50);

console.log($('#pic').attr('src'));