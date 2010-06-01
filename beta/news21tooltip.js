var initN21Tooltip = function() {

	$("#news21-header-about").html('<div class="news21-header-trigger"><a href="http://news21.com/about/" id="news21-header-aboutlink"><img src="http://assets.news21.com/transparent-1x1.gif" id="news21-header-aboutlink" border="0" /></a><div class="rounded" id="news21-header-popup" style="opacity: 0; display: none;"><div id="news21-header-popup-inner"><span class="news21-header-toolTiphead">What\'s News21?</span> It\'s an umbrella organization that showcases student projects from an alliance of 12 top journalism schools. Click the logo to visit the news21.com parent site.</div></div></div>');
	
	$("#news21-header-about").each(function () {
		var distance  = 10;
	    var time 	  = 250;
	    var hideDelay = 500;

	    var hideDelayTimer = null;

	    var beingShown = false;
	    var shown 	   = false;
	    var trigger    = $('.news21-header-trigger');
	    var info 	   = $('#news21-header-popup').css('opacity', 0);

	    $([trigger.get(0), info.get(0)]).mouseover(function () {
	    		
	    	if (hideDelayTimer) {
				clearTimeout(hideDelayTimer);
			}
	        if (beingShown || shown) {
				// don't trigger the animation again
	         	return;
	        } else {
	        	// reset position of info box
	            beingShown = true;
	            
	            info.css({
	            	"top": 39,
	                "left": 390,
	                "display": "block"
	            }).animate({
	                 "top": "-=" + distance + "px",
	                 "opacity": 1
	            }, time, "swing", function() {
	             	 beingShown = false;
	                 shown 	   = true;
	            });
	        }

	        return false;
	    }).mouseout(function () {
	    	if (hideDelayTimer) {
				clearTimeout(hideDelayTimer);
			}
			
	        hideDelayTimer = setTimeout(function () {
	        	hideDelayTimer = null;
	        	
	        	info.animate({
	        		"top": "-=" + distance + "px",
	            	"opacity": 0
	        	}, time, "swing", function () {
	        		shown = false;
	            	info.css('display', 'none');
	        	});

	        }, hideDelay);
	        return false;
	    });
	});
	
}; 
