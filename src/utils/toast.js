function toast(tips) {
	let $body = $('body'),
		$tipbody = $('<div class="toast"></div>');
    $tipbody = $tipbody.appendTo( $body );
    $tipbody.html(tips)
    let t_w = -($tipbody.width()/2) + 'px'
    $tipbody.css({'margin-left': t_w})
    setTimeout( function(){
       	$tipbody.remove();
    }, 2000 )
}
export {
	toast
}