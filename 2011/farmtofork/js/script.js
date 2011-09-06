/* Author: Mark Ng / Kyle Bruggeman

*/

$(document).ready(function() {
	// hide the back/forward arrows - with opacity - makes it clear they're not available for use yet.
	$('a.type_arrow').css('opacity', '0');
	// only show the first - hide all first so we don't do it in the stylesheet in case JS doesn't load.
	$('div.food_type div.detail').hide();
	var food_types = $('div.food_type');
	for (var i=0; i < food_types.length; i++) {
		$($(food_types[i]).find('div.detail')[0]).show();
	};
	$('div.food_type').hide();
	var active_food_type = '#'+$($('div.food_type')[0]).attr('id');
	show_food_type(active_food_type, 'left');
	
	// main slider event handlers
	$('nav ul li a').click(function(event) {
		show_food_type($(this).attr('href'), 'left');
		event.preventDefault();
	});
	$('a.type_arrow').click(function(event) {
		if ($(this).hasClass('type_back')) { 
			var direction = 'right';
		} else {
			var direction = 'left';
		};
		show_food_type($(this).attr('href'), direction);
		event.preventDefault();
	});
	
	// inner slider (detail) event handlers
	$('div.food_type_inner_menu ul li a').click(function(event) {
		show_food_detail('#'+find_food_type_parent($(this)).attr('id'), $(this).attr('href'), 'left');
		event.preventDefault();
	});
	$('a.detail_nav').click(function(event) {
		if ($(this).hasClass('detail_nav_back')) { 
			var direction = 'right';
		} else {
			var direction = 'left';
		};
		show_food_detail('#'+find_food_type_parent($(this)).attr('id'), $(this).attr('href'), direction);
		event.preventDefault();
	});
	
});


function show_food_type (food_type_name, direction) {
	if (direction == 'left') {
		var opposite_direction = 'right';
	} else {
		var opposite_direction = 'left';
	}
	if (!$('div.food_type:visible').length) {
		// in case we end up with nothing shown / when the page initialises
		$('div'+food_type_name).show("slide", { direction : opposite_direction }, 500, function(event) {
			$('div'+food_type_name+' a.type_arrow').animate({ opacity: 1 }, 200);
		});
	} else {
		$('div.food_type:visible a.type_back').animate({ opacity: 0 }, 200, function(event){
			$('div.food_type:visible').hide("slide",{ direction : direction }, 500, function(event) {
				$('div'+food_type_name).show("slide", { direction : opposite_direction }, 500, function(event){
					$('div'+food_type_name+' a.type_arrow').animate({ opacity: 1 }, 200);
				});
			});
		});
		$('div.food_type:visible a.type_forward').animate({ opacity: 0 }, 200);
	}
	// make the right menu entry "active"
	$('nav a.active').removeClass('active');
  $("nav a[href='"+food_type_name+"']").addClass('active');
}

function show_food_detail (food_type_name, food_detail_name, direction) {
	if (direction == 'left') {
		var opposite_direction = 'right';
	} else {
		var opposite_direction = 'left';
	}
	var food_detail = $('div'+food_detail_name)
	var visibles = $('div'+food_type_name+' div.detail:visible');
	if (!visibles.length) {
		food_detail.show("slide", { direction : opposite_direction }, 500, function(event) {
			
		});
	} else {
		visibles.hide("slide",{ direction : direction }, 500, function(event) {
			food_detail.show("slide", { direction : opposite_direction }, 500, function(event){
			});
		});
	};
	// make the right menu entry "active"
	$('div'+food_type_name+' div.food_type_inner_menu a.active').removeClass('active');
	$("a[href='"+food_detail_name+"']").addClass('active');
}

function find_food_type_parent (node) {
	var parents = $(node).parents();
	for (var i=0; i < parents.length; i++) {
		if ($(parents[i]).hasClass('food_type')) {
			return $(parents[i]);
		}
	};
}



















