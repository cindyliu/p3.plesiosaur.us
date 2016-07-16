/*
 *  imgsearch.js
 *
 *  Javascript code to implement the image-handling functions of the game.
 *
 *  Functions in this file (located at the end):
 *
 *    doImageSearch()
 *    displayResults(page_num)
 *    setupBoard(game_img)
 *
 *  ### This script must be loaded BEFORE puzzle.js ###
 */

// This was an attempt to clear the search input field when the page is
// refreshed, but it didn't work and I eventually gave up trying to fix it.
//$('#image-search-box').val('');

// Do not display "Start puzzle!" button or difficulty dropdown until image picked
$('#difficulty').hide();
$('#game-controls').hide();

// Listener for user keypresses in the search input text box
$('#image-search-box').keyup(function() {

	var max_chars = 20;   // don't allow very long queries
	var num_chars = $(this).val().length;  // length of current user input

	// When user has reached the maximum number of characters, display warning message.
	// Otherwise, display usual message informing user of max number of characters.
	if(num_chars == max_chars) {
		$('#search-warning').css('color', 'red');
		$('#search-warning').html('<small>You have reached the maximum of ' + max_chars + ' characters.</small>');
	}
	else {
		$('#search-warning').css('color', 'black');
		$('#search-warning').html('<small>Maximum ' + max_chars + ' characters.</small>');
	}

	// When a key is pressed, clear out any existing error messages
	$('#search-error').html('');

});

// Listener for user clicking the "Search" button.
$('#image-search-button').click(function() {
	doImageSearch();
});
// Listener for user pressing "Enter" while in input field.
// Mimics form submit behavior/clicking the "Search" button.
$('#image-search-box').keypress(function(event) {
	if(event.which == 13) {
		doImageSearch();
	}
});

// Listener for user selecting a new "page" of search results
$('#image-search-pages').on('click', '.unselected-page-number', function() {

	$('#image-search-pages').children().removeClass('selected-page-number').addClass('unselected-page-number');

	$(this).removeClass('unselected-page-number').addClass('selected-page-number');

	displayResults(parseInt($(this).text()));

});

// Listener for user making a valid click on an image result
// Loads the clicked image onto the game board
// (Valid click means there is no game currently in progress)
$('#image-search-results').on('click', '.image-result', function() {

	if(!game_on) {
		var image_selected = $(this).clone();
		image_selected.attr('id', 'image-selected').removeClass('image-result');
		readyBoard(image_selected);
	}

});

// Listener for user requesting random cat picture because Google Image
// Search has exceeded the 100-request daily limit, honestly Google why
$('#rand-cat-pic').click(function() {

console.log("Clicked for random cat pic");

	if(!game_on) {
		var randImgSize = Math.floor(Math.random()*1000) + 1;
		var imageURL = "http://www.placekitten.com/" + randImgSize + "/" + randImgSize;
		var image_selected = "<img class='image-result' src='" + imageURL + "'>";
		readyBoard(image_selected);
	}
})


/**************************** FUNCTIONS ****************************/

function readyBoard(image_selected) {
	$('#start-button').val('Start puzzle!');
	$('#difficulty').show();
	$('#game-controls').show();
	setupBoard(image_selected);
}

// Boy, I'm really creative with my function names.
function doImageSearch() {

	// Grab user's search input
	search_term = $.trim($('#image-search-box').val());

	// Make sure it is not nothing
	if(search_term == '') {
		$('#search-error').html('<small>Search field cannot be blank.</small>');
		return;
	}

	// Do the search and display the results
	displayResults(1);

	// Forms the little menu at the bottom that lets you "scroll" between
	// "pages" of results
	$('#image-search-pages').html('');
	$.each(SEARCH_PAGE_NUMBERS, function(key, value) {

		if(value == 1) {
			var class_to_add = 'selected-page-number';
		}
		else {
			var class_to_add = 'unselected-page-number';
		}

		$('#image-search-pages').append('<span class="' + class_to_add + '">' + value + '</span>');

		if(value == 8) {
			$('#image-search-pages').append('');
		}
		else {
			$('#image-search-pages').append(' | ');
		}
	});

}

// Does the image search and displays results based on the page number passed to it
function displayResults(page_num) {

	// Bit of instruction because this was apparently not immediately apparent to all
	$('#image-search-results').html('<small id=\'tip\'>Click on an image below to get started!</small><br>');

	// Which results index to start displaying at
	var start_index = (page_num - 1) * 4;

	/***************************** BEGIN CLASS CODE *****************************/
	// I basically kept everything the same.
	var search_url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&as_filetype=jpg&imgsz=medium&start=' + start_index + '&q=' + search_term + '&callback=?';

	$.getJSON(search_url, function(data){

		// This line will basically parse the data we get back from Google into a nice array we can work with
	    var images = data.responseData.results;

		// Only attempt to do the following if we had images...I.e there was more than 0 images
	    if(images.length > 0){

			// .each() is a jQuery method that lets us loop through a set of data.
			// So here our data set is images
			// Essentially we're unpacking our images we got back from Google
	        $.each(images, function(key, image) {

	        	// Create a new image element
	        	var new_image_element = "<img class='image-result' src='" + image.url + "'>";

	        	// Now put the new image in our results div
	            $('#image-search-results').append(new_image_element);

	            // This was added to prevent broken images from appearing.
	            // Code was suggested by Dan Schultz.
	            $('img').error(function() {
	            	$(this).hide();
	            });

	        });
	    }
	});
}

// Initializes the board so that there aren't any tiles or error
// messages still floating around
function setupBoard(game_img, cbfunc) {		// self 3 years later: why is cbfunc here?

	$('.tile').fadeOut(function() {
		$(this).remove();
	});
	$('.grid').remove();

	$('#message').html('');

	$('#board-canvas').html(game_img);

}
