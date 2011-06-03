(function($) {
	
	jQuery.fn.news21ams = function(settings) {
		settings = jQuery.extend({
			ams_url: 'http://ams.news21.com/api',
			api_version: 'v2',
			api_key: 'none'
		}, settings);
		jQuery.news21ams.settings = settings;
	};
	
	jQuery.news21ams = {
		news21republishcallback : function(d){
			jQuery('#news21republish_overlay_body').html('body not being pulled in yet ... here is the summary : '+d['summary']); // d['body']
			jQuery('#news21republish_title_headline').html(d['headline']);
			var byline = "";
			jQuery.each(d['bios'], function(key, value) { 
				byline = (byline == '')?value.name:byline+', '+value.name; 
			});
			jQuery('#news21republish_title_byline').html('Byline '+byline);
			jQuery('.news21republishlink').overlay({mask: '#000',load: true});
		},
		
		amsURL : function(){
			return jQuery.news21ams.settings.ams_url+'/'+jQuery.news21ams.settings.api_version+'/'+jQuery.news21ams.settings.api_key;
		},
		makeCall : function(url,callback,rmethod){
			$.getJSON(url, function(data) {
				if (callback)	{
					callback(data);
				} else	{
					if(window.console) {
						console.debug('Call Success: '+rmethod+' ... Please Specify Callback')
					}
				}
			});
		},
		getCategories : function(callback){
			jQuery.news21ams.makeCall(jQuery.news21ams.amsURL()+'/categories/?callback=?',callback,'getCategories');
		},
		getCategoryStories : function(category_id,callback){
			jQuery.news21ams.makeCall(jQuery.news21ams.amsURL()+'/category/'+category_id+'/stories/?callback=?',callback,'getCategoryStories');
		},
		getStory : function(story_id,callback){
			jQuery.news21ams.makeCall(jQuery.news21ams.amsURL()+'/story/'+story_id+'/?callback=?',callback,'getStory');
		},
		getStoryEC : function(story_id,callback){
			jQuery.news21ams.makeCall(jQuery.news21ams.amsURL()+'/story_ec/'+story_id+'/?callback=?',callback,'getStoryEC');
		},
		getNewsrooms : function(callback){
			jQuery.news21ams.makeCall(jQuery.news21ams.amsURL()+'/newsrooms/?callback=?',callback,'getNewsrooms');
		},
		getNewsroomBios : function(newsroom_id,callback){
			jQuery.news21ams.makeCall(jQuery.news21ams.amsURL()+'/newsroom/'+newsroom_id+'/bios/?callback=?',callback,'getNewsroomBios');
		},
		getMedia : function(media_id,callback){
			jQuery.news21ams.makeCall(jQuery.news21ams.amsURL()+'/categories/?callback=?',callback,'getMedia');
		},
		getStoryPlacements : function(story_id,callback){
			jQuery.news21ams.makeCall(jQuery.news21ams.amsURL()+'/story_ec/'+story_id+'/?callback=?',callback,'getStoryPlacements');
		},
		getStoryRepublish : function(story_id){
			jQuery('#news21republish_overlay').html('<div class="news21republish_title"><h3 class="news21republish_title_link" id="news21republish_title_headline"></h3><p class="news21republish_byline" id="news21republish_title_byline"></p></div><div style="height:235px;" id="news21republish_overlay_info"><span id="news21republish_overlay_info_title">In-Depth News21 Stories Free to Use</span><br/>Thank you for your interest in News21.<br/><br/>News21 is a national initiative led by 12 of America\' s leading universities whose in-depth journalism can be used for free by any site as long as you gve credit to Carnegie-Knight News21 under Creative Commons.<br/><br/>You may use our material with the following restrictions<ol><li>You can make minor editors for time elements, location and style only.</li><li>When republishing online, ensure a link to News21, either in the byline or footer credit.</li><li>You cannot sell News21 material.</li><li>You can use associated photos available from our Asset Management System</li><li>Credit is required: Preferred style is " Author Name, Carnegie-Knight News21" or " Author Name, News21.com"</li><li>An API key may be available; please contact news@news21.com</li></ol>News21 logos can be found here and here</div><div style="height:80px;overflow:none;" id="news21republish_overlay_body"></div><div class="clearfix"></div><div id="news21republish_overlay_clipboard"><a onclick="jQuery.news21ams.selectAllRepublish(\'news21republish_overlay_body\')">Select All Text</a></div><div class="news21republish_footer"><img src="http://assets.news21.com/2010/logo_news21.png" alt="News21 Logo" width="120" height="21"><span style="padding:0px 70px 0px 70px;font-size:10px;color: gray;padding-bottom:10px;vertical-align:middle;">&nbsp;Copyright News21.com 2006-2011. All rights reserved.</span> <img src="http://assets.news21.com/2010/logo_carnegie.png" alt="Carnegie Corporation of New York Logo" width="95" height="45" style="padding-right:20px;" /> <img src="http://assets.news21.com/2010/logo_knightfoundation.png" alt="Knight Foundation Logo" width="152" height="26" /></div>');
			jQuery.news21ams.makeCall(jQuery.news21ams.amsURL()+'/story_ec/'+story_id+'/?callback=?',jQuery.news21ams.news21republishcallback,'getStoryRepublish');
		},
		selectAllRepublish : function (elid) {
			//http://stackoverflow.com/questions/4578398/selecting-all-text-within-a-div-on-a-single-left-click-with-javascript
			el = document.getElementById(elid);
			if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
				var range = document.createRange();
				range.selectNodeContents(el);
				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} else if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
				var textRange = document.body.createTextRange();
				textRange.moveToElementText(el);
				textRange.select();
			}
		}
	}
})(jQuery);
