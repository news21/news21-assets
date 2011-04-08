jQuery(function( $ ){
	//borrowed from jQuery easing plugin
	//http://gsgd.co.uk/sandbox/jquery.easing.php
	$.easing.elasout = function(x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	};
	
	// Reset the screen to (0,0)
	$.scrollTo(0);
	
	var current_page = 1;
	var ams_api_uri = 'http://ams.news21.com/api';
	var ams_api_key = '14e8378b7b806e820ec8f8a4ecc9a156282';
	var ams_api_version = 'v2';
	
	
	//
	//
	//
	
	
	$('a.page-nav').click(function(e){
		e.preventDefault();
		var link = e.target;
		link.blur();
		
		// make json call to ams api to get content ... then populate page with 
		current_page = jQuery(this).attr('data-pageid');
		
		switch(jQuery('div#page'+current_page).attr('data-template')){
			case 'newsroombios':
				jQuery('div#page'+current_page).css('background-image','none');
				getNewsroomBios(10);
			break;
			case 'organization':
				jQuery('div#page'+current_page).css('background-image','none');
				getOrganization(1);
			break;
			case 'newsrooms':
				jQuery('div#page'+current_page).css('background-image','none');
				getNewsrooms();
			break;
			case 'placements':
				jQuery('div#page'+current_page).css('background-image','none');
				getPlacements();
			break;
			case 'projects':
				jQuery('div#page'+current_page).css('background-image','none');
				getProjects();
			break;
			case 'categories':
				jQuery('div#page'+current_page).css('background-image','none');
				getCategories();
			break;
		}
		
		// scroll to new page
		$.scrollTo( jQuery('div#page'+current_page),800, {offset:-50} );
	});
	
	
	//
	//
	//
	
	
	var getNewsroomBiosCallback = function(data){
		$.each(data.categories, function(i,item){
			console.log(item.id.toLowerCase());
		});
	};
	var getNewsroomBios = function(n){
		jQuery.getJSON(ams_api_uri+"/"+ams_api_version+"/"+ams_api_key+"/categories/?callback=?", getNewsroomBiosCallback );
	};
	
	var getOrganizationCallback = function(data){
		var page = '';
		page = ' '+data.name.toLowerCase()+' '
		jQuery('div#page'+current_page).append(page);
	};
	var getOrganization = function(n){
		jQuery.getJSON(ams_api_uri+"/"+ams_api_version+"/"+ams_api_key+"/organization/"+n+"/?callback=?", getOrganizationCallback );
	};
	
	var getCategoriesCallback = function(data){
		jQuery('div#page'+current_page).append('<br/><br/>');
		$.each(data.categories, function(i,item){
			jQuery('div#page'+current_page).append(' '+item.id.toLowerCase()+' ');
		});
	};
	var getCategories = function(){
		jQuery.getJSON(ams_api_uri+"/"+ams_api_version+"/"+ams_api_key+"/categories/?callback=?", getCategoriesCallback );
	};
	
	var getNewsroomsCallback = function(data){
		jQuery('div#page'+current_page).append('<br/><br/>');
		$.each(data.newsrooms, function(i,item){
			jQuery('div#page'+current_page).append(' '+item.slug.toLowerCase()+' ');
		});
	};
	var getNewsrooms = function(){
		jQuery.getJSON(ams_api_uri+"/"+ams_api_version+"/"+ams_api_key+"/newsrooms/?callback=?", getNewsroomsCallback );
	};
	
	var getProjectsCallback = function(data){
		jQuery('div#page'+current_page).append('<br/><br/>');
		$.each(data.projects, function(i,item){
			jQuery('div#page'+current_page).append('<div><p><img style="padding: 0px 10px 10px 0px;" title="'+item.name.toLowerCase()+'" src="'+item.screenshot.toLowerCase()+'" alt="'+item.name.toLowerCase()+'" width="200" height="127" align="left"></p><h2><a href="">'+item.name.toLowerCase()+'</a></h2><p>'+item.description.toLowerCase()+'</p></div><div class="clear"></div>');
		});
	};
	var getProjects = function(){
		jQuery.getJSON(ams_api_uri+"/"+ams_api_version+"/"+ams_api_key+"/projects/?callback=?", getProjectsCallback );
	};
	
	var getPlacementsCallback = function(data){
		jQuery('div#page'+current_page).append('<br/><br/>');
		$.each(data.placements, function(i,item){
			jQuery('div#page'+current_page).append('<div><a href="'+item.partner_url.toLowerCase()+'">'+item.partner.toLowerCase()+'</a>: <a href="'+item.url.toLowerCase()+'">'+item.partner_headline.toLowerCase()+'</a>, '+item.date_ran.toLowerCase()+' <a href="'+item.screengrab_url.toLowerCase()+'" target="_blank">(screengrab)<a/> </div><div class="clear"></div>');
		});
	};
	var getPlacements = function(){
		jQuery.getJSON(ams_api_uri+"/"+ams_api_version+"/"+ams_api_key+"/placements/?callback=?", getPlacementsCallback );
	};
	
});