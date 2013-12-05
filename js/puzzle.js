
$('#image-search-box').keyup(function() {

	var max_chars = 50;
	var num_chars = $(this).val().length;

	if(num_chars == max_chars) {
		$('#search-warning').css('color', 'red');
		$('#search-warning').html('<small>You have reached the maximum of ' + max_chars + ' characters.</small>');
	}
	else {
		$('#search-warning').css('color', 'black');
		$('#search-warning').html('<small>Maximum ' + max_chars + ' characters.</small>');
	}

});

$('#image-search-pages').on('click', '.unselected-page-number', function() {

	$('#image-search-pages').children().removeClass('selected-page-number').addClass('unselected-page-number');

	$(this).removeClass('unselected-page-number').addClass('selected-page-number');

	console.log($(this).text() + ' was clicked');

});

$('#image-search-button').click(function() {

	$('#image-search-results').html('');

	var search_term = $('#image-search-box').val();

	console.log(search_term);

	var search_url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=medium&q=' + search_term + '&callback=?';

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
	            $('#image-search-results').prepend(new_image_element);
	
	        });
	    }

	var search_page_numbers = ['1','2','3','4','5','6','7','8'];

	console.log(search_page_numbers);

	$('#image-search-pages').html('<-');
	$.each(search_page_numbers, function(key, value) {

		$('#image-search-pages').append('<span class="unselected-page-number"> ' + value + ' </span>');
		if(value == 8) {
			$('#image-search-pages').append('->');
		}
		else {
			$('#image-search-pages').append('-');	
		}

	});

	});
});

