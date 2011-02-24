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
			jQuery('#news21republish_title_byline').html('byline not being pulled in yet...'); // d['byline']
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
			jQuery('#news21republish_overlay').html('<div class="news21republish_title"><h3 class="news21republish_title_link" id="news21republish_title_headline"></h3><p class="news21republish_byline" id="news21republish_title_byline"></p></div><div style="height:150px;overflow:scroll;" id="news21republish_overlay_body"></div><div style="height:140px;" id="news21republish_overlay_info"></div><div class="news21republish_footer"><img src="http://assets.news21.com/2010/logo_news21.png" alt="News21 Logo" width="120" height="21"><span style="padding:0px 70px 0px 70px;font-size:10px;color: gray;padding-bottom:10px;vertical-align:middle;">&nbsp;Copyright News21.com 2006-2010. All rights reserved.</span> <img src="http://assets.news21.com/2010/logo_carnegie.png" alt="Carnegie Corporation of New York Logo" width="95" height="45" style="padding-right:20px;" /> <img src="http://assets.news21.com/2010/logo_knightfoundation.png" alt="Knight Foundation Logo" width="152" height="26" /></div>');
			jQuery.news21ams.makeCall(jQuery.news21ams.amsURL()+'/story_ec/'+story_id+'/?callback=?',jQuery.news21ams.news21republishcallback,'getStoryRepublish');
		}
	}
})(jQuery);
