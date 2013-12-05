$('.colors').click(function() {
	var color_clicked = $(this).css('background-color');
	$('#canvas').css('background-color', color_clicked);
	$('.textures').css('background-color', color_clicked);
});

$('.textures').click(function() {
	var texture_clicked = $(this).css('background-image');
	$('#canvas').css('background-image', texture_clicked);
})

$('input[name=message]').click(function() {
	var label = $(this).next();
	var message = label.html();
	$('#message-output').html(message);
});

$('#recipient').keyup(function() {
	var max_chars = 14;
	var value = $(this).val();
	var num_chars = value.length;
	var num_left = max_chars - num_chars;
	if(num_left == 0) {
		$('#recipient-warning').css('color', 'red');
	}
	else if(num_left <= 5) {
		$('#recipient-warning').css('color', 'orange');
	}
	else {
		$('#recipient-warning').css('color', 'black');
	}

	$('#recipient-warning').html('You have ' + num_left + ' characters left.')
	$('#recipient-output').html(value);
});

$('#controls').on('click', '.sticker', function() {
/*
	var sticker_clicked = $(this).();
	var add_image = '<img src=\'' + sticker_clicked + '\'></img>';
	$('#canvas').html(add_image);
*/
	var new_image = $(this).clone();
	
	new_image.addClass('card_sticker');

	$('#canvas').prepend(new_image);

	$('.card_sticker').draggable({ containment: '#canvas' });
});






/*-------------------------------------------------------------------------------------------------
Sticker search with Ajax!
https://developers.google.com/image-search/v1/jsondevguide#using_json
http://api.jquery.com/jQuery.getJSON/
-------------------------------------------------------------------------------------------------*/
$('#sticker-search-btn').click(function() {

	// First, clear out the results div in case we've already done a search
	// FYI- The results div is where the new stickers go...so if we've done this search before, it wouldn't be empty
	$('#sticker-search-results').html('');

	// What search term did the user enter?
	var search_term = $('#sticker-search').val();
		
	// This is the URL for Google Image Search that we'll make the Ajax call to
	var google_url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=medium&q=' + search_term + '&callback=?';	
		
	// getJSON is a Ajax method provided to us by jQuery
	// It's going to make a call to the url we built above, and let us work with the results that Google sends back
	// Everthing in the function below is what will occur when getJSON is done and sends us the results back from Google
	$.getJSON(google_url, function(data){
	
		// This line will basically parse the data we get back from Google into a nice array we can work with
	    var images = data.responseData.results;
	
		// Only attempt to do the following if we had images...I.e there was more than 0 images
	    if(images.length > 0){
			
			// .each() is a jQuery method that lets us loop through a set of data. 
			// So here our data set is images
			// Essentially we're unpacking our images we got back from Google
	        $.each(images, function(key, image) {
	        
	        	// Create a new image element
	        	var new_image_element = "<img class='sticker circular' src='" + image.url + "'>";
	        	
	        	// Now put the new image in our results div
	            $('#sticker-search-results').prepend(new_image_element);
	
	        });
	    }	   
	});			
});