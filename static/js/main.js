console.log("main.js connected")



$(window).scroll(function() {
	if($(this).scrollTop()) {
		$('nav').addClass('shadow');
	} else {
		$('nav').removeClass('shadow');
	}
});
