
var a = $("#section2").offset();

$(window).scroll(function(){
    if($(window).scrollTop() + $('.fixednavbar').height() > a.top) {   

    	$('.fixednavbar').css('visibility', 'visible');
    } else {
    	$('.fixednavbar').css('visibility', 'none');
    }
});