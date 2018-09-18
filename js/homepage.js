var source_img_1 = "";

$(document).ready(function(){
// Search Bar Functionality
	
  $(".fa-search").click(function(){
	  var searchQuery = $("#search-bar").val();
	  window.location.href = 'http://www.google.com/search?q=' + searchQuery;
  });
	
  $("#search-bar").keypress(function(event) {
	var searchQuery = $("#search-bar").val();
    if ( event.which == 13 ) {
    	if (searchQuery[0] == "!"){
			var pos = searchQuery.indexOf(" ");
			var key = searchQuery.slice(0,pos);
			searchQuery = searchQuery.replace(key+" ",'');
			key = key.replace('!','');
			switch(key) {
			    case "a":
			        window.location.href = 'https://www.amazon.it/s/?tag=httpmariec-20&link_code=wsw&_encoding=UTF-8&search-alias=aps&field-keywords=' +searchQuery+ '&Submit.x=0&Submit.y=0&Submit=Go';
			        break;
			    case "y":
			   		window.location.href = 'https://www.youtube.com/results?search_query=' + searchQuery;
			        break;
			    case "w":
			   		window.location.href = 'https://en.wikipedia.org/w/index.php?title=Special:Search&search=' + searchQuery;
			        break;
			    case "m":
			   		window.location.href = 'https://maps.google.com/maps?hl=en&authuser=0&q='+ searchQuery+'&ie=UTF-8';
			        break;
			    case "u":
			   		window.location.href = 'https://ulozto.net/hledej?q='+ searchQuery+'&type=archives';
			        break;
				case "wr":
			   		window.location.href = 'http://www.wordreference.com/enit/'+ searchQuery;
			        break;
			    case "t":
			   		window.location.href = 'https://translate.google.it/#auto/#auto/'+ searchQuery;
			        break;
			    case "ml":
			   		window.location.href = 'https://www.reddit.com/r/megalinks/search?q='+ searchQuery+ '&restrict_sr=on';
			        break;
			    case "rym":
			   		window.location.href = 'https://rateyourmusic.com/search?searchtype=a&searchterm='+ searchQuery;
			        break;
			    default:
			        window.location.href = 'http://www.google.com/search?q=' + searchQuery;
			    }
			}
	    else{
	      window.location.href = 'http://www.google.com/search?q=' + searchQuery;
	    }
    }
  }); // END Keypress Function
	

  	//ADD SUBREDDIT NAME AS PARAMETER AND MODIFY THE TITLE IN CARD WITH THAT VALUE

    function updatepost(subreddit, image, postnum, cardnum, random) {
    	if (random) {
    		var url = 'https://www.reddit.com/r/' + subreddit + '/random.json?';
    	} else {
    		var url = 'https://www.reddit.com/r/' + subreddit + '/.json?';
    	}
    	$.ajax({
      	type: "GET",
      	url: url,
      	async: true,
      	dataType: 'json',
      	success: function(data){ 
      		if (image) {
			try {
				if (subreddit=='Museum') {
					var low_res_img = (data["data"]["children"][postnum]["data"]["preview"]["images"][0]["resolutions"][2]["url"]).replace(/&amp;/g, '&');
					source_img_1 = (data["data"]["children"][postnum]["data"]["preview"]["images"][0]["source"]["url"]).replace(/&amp;/g, '&');
					$('#img-card-' + cardnum).attr("src", low_res_img);	
					$('#img-card-link-' + cardnum).attr("href","https://reddit.com" + data["data"]["children"][postnum]["data"]["permalink"]);
				} else {
					var low_res_img = (data[0]["data"]["children"][postnum]["data"]["preview"]["images"][0]["resolutions"][2]["url"]).replace(/&amp;/g, '&');
					if(cardnum==3) {
						source_img_3 = (data[0]["data"]["children"][postnum]["data"]["preview"]["images"][0]["source"]["url"]).replace(/&amp;/g, '&');
					} else {
						source_img_1 = (data[0]["data"]["children"][postnum]["data"]["preview"]["images"][0]["source"]["url"]).replace(/&amp;/g, '&');
					}
					$('#img-card-' + cardnum).attr("src", low_res_img);	
					$('#img-card-link-' + cardnum).attr("href","https://reddit.com" + data[0]["data"]["children"][postnum]["data"]["permalink"]);
				}
			}
			catch(err) {
				$('#img-card-' + cardnum).remove();
			}
      		} else {
      			$('#img-card-' + cardnum).remove();
      		}
        	var title = data["data"]["children"][postnum]["data"]["title"];
			var score = data["data"]["children"][postnum]["data"]["score"];
				$("#card-subreddit-title-" + cardnum).empty().append('<a href="https://www.reddit.com/r/'+ subreddit +'/" style="color: #000000">/r/'+ subreddit +'</a>');
		  		$("#title-card-" + cardnum).empty().prepend(title);
		  		$("#score-card-" + cardnum).empty().append('<i class="fa fa-heart"> </i>' + ' ' + score);
		  		$("#title-card-link-" + cardnum).attr("href","https://reddit.com" + data["data"]["children"][postnum]["data"]["permalink"]);
      		}, 
      		error: function(errorMessage){
        		alert("Reddit ajax call failed: "+errorMessage.toString());
	  		}
      
    	}); // END ajax call
	}

	function updatepostRandom(subreddit, image, postnum, cardnum, post_text) {
    	var url = 'https://www.reddit.com/r/' + subreddit + '/random.json?';
    	$.ajax({
      	type: "GET",
      	url: url,
      	async: true,
      	dataType: 'json',
      	success: function(data){ 
      		if (image) {
				try {
					var low_res_img = (data[0]["data"]["children"][postnum]["data"]["preview"]["images"][0]["resolutions"][2]["url"]).replace(/&amp;/g, '&');
					if(cardnum==3) {
						source_img_3 = (data[0]["data"]["children"][postnum]["data"]["preview"]["images"][0]["source"]["url"]).replace(/&amp;/g, '&');
					} else {
						source_img_1 = (data[0]["data"]["children"][postnum]["data"]["preview"]["images"][0]["source"]["url"]).replace(/&amp;/g, '&');
					}
	      				$('#img-card-' + cardnum).attr("src", low_res_img);
	      				$('#img-card-link-' + cardnum).attr("href","https://reddit.com" + data[0]["data"]["children"][postnum]["data"]["permalink"]);
	      			}
				catch(err) {
					$('#img-card-' + cardnum).remove();
				}
      		} else {
      			$('#img-card-' + cardnum).remove();
      		}
		if(post_text) {
			var text = data[0]["data"]["children"][postnum]["data"]["selftext"];
			$("#card-subreddit-text-body-" + cardnum).empty().prepend(text);
			$("#toggle-collapse-" + cardnum).show();

		}
        	var title = data[0]["data"]["children"][postnum]["data"]["title"];
			var score = data[0]["data"]["children"][postnum]["data"]["score"];
				$("#card-subreddit-title-" + cardnum).empty().append('<a href="https://www.reddit.com/r/'+ subreddit +'/" style="color: #000000">/r/'+ subreddit +'</a>');
		  		$("#title-card-" + cardnum).empty().prepend(title);
		  		$("#score-card-" + cardnum).empty().append('<i class="fa fa-heart"> </i>' + ' ' + score);
		  		$("#title-card-link-" + cardnum).attr("href","https://reddit.com" + data[0]["data"]["children"][postnum]["data"]["permalink"]);
      		}, 
      		error: function(errorMessage){
        		alert("Reddit ajax call failed: "+errorMessage.toString());
	  		}
      
    	}); // END ajax call
	}

	var rand = Math.floor((Math.random() * 6) + 1);
	var subreddit1 = "EarthPorn";
	var postnum1 = 1;
	switch (rand) {
		case 1: 
			subreddit1 = "ITookAPicture";
			postnum1 = 2;
			break;
		case 2: 
			subreddit1 = "EarthPorn";
			postnum1 = 1;
			break;
		case 3:
			subreddit1 = "Museum";
			postnum1 = 0;
			break;
		case 4:
			subreddit1 = "ArtPorn";
			postnum1 = 1;
			break;
		case 5:
			subreddit1 = "Food";
			postnum1 = 1;
			break;
		case 6:
			subreddit1 = "FoodPorn";
			postnum1 = 1;
			break;
		default: 
			subreddit1 = "EarthPorn";
			postnum1 = 1;
			break;
	}

	if (subreddit1=="Museum") {
		updatepost(subreddit1, true, postnum1, 1, false);
		$("#next-post-" + 1).click(function(){
			postnum1 = postnum1+1;
			updatepost(subreddit1, true, postnum1, 1, false);
		});
	} else {
		postnum1 = 0;
		updatepostRandom(subreddit1, true, postnum1, 1, false);
		$("#next-post-" + 1).click(function(){
			//postnum1 = postnum1+1;
			updatepostRandom(subreddit1, true, postnum1, 1, false);
		});
	}

   	var rand = Math.floor((Math.random() * 3) + 1);
	var subreddit2 = "Confession";
	var postnum2 = 0;
	var textBody = false;
	switch (rand) {
		case 1: 
			subreddit2 = "Confession";
			postnum2 = 0;
			break;
		case 2: 
			subreddit2 = "Showerthoughts";
			postnum2 = 0;
			break;
		case 3: 
			subreddit2 = "Jokes";
			postnum2 = 0;
			textBody = true;
			break;
		default: 
			subreddit2 = "Confession";
			postnum2 = 0;
			break;
	}

    updatepostRandom(subreddit2, false, postnum2, 2, textBody);
	$("#next-post-" + 2).click(function(){
		//postnum2 = postnum2+1;
		updatepostRandom(subreddit2, false, postnum2, 2, textBody);
	});

	var rand = Math.floor((Math.random() * 2) + 1);
	var subreddit3 = "News";
	var postnum3 = 0;
	switch (rand) {
		case 1: 
			subreddit3 = "News";
			postnum3 = 0;
			break;
		case 2: 
			subreddit3 = "Italy";
			postnum3 = 0;
			break;
		case 3:
			subreddit3 = "HackerNews";
			postnum3 = 0;
			break;
		default: 
			subreddit3 = "News";
			postnum3 = 0;
			break;
	}

	if (subreddit3=="News" || subreddit3=="HackerNews") {
		updatepost(subreddit3, false, postnum3, 3, false);
		$("#next-post-" + 3).click(function(){
			postnum3 = postnum3+1;
			updatepost(subreddit3, false, postnum3, 3, false);
		});
	} else {
	    updatepostRandom(subreddit3, true, postnum3, 3, false);
	    $("#next-post-" + 3).click(function(){
			//postnum3 = postnum3+1;
			updatepostRandom(subreddit3, true, postnum3, 3, false);
		});
	}
	
var date = new Date();
var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var weekday = weekdays[date.getDay()];
var month = date.getMonth();
var monthday = date.getDate();
var year = date.getYear();	
$('#weekday').html(weekday);
	
switch (monthday) {
	case 1:
	case 21: 
	case 31:
    	var affix = "st";
		$('#month-date').html(months[month] + ", " + monthday + affix);
    	break;
	case 2: 
	case 22:
    	var affix = "nd";
		$('#month-date').html(months[month] + ", " + monthday + affix);
    	break;
	case 3: 
	case 23:
     	var affix = "rd";
		$('#month-date').html(months[month] + ", " + monthday + affix);
   	break;
	case 4: 
	case 5: 
	case 6: 
	case 7: 
	case 8: 
	case 9: 
	case 10: 
	case 11: 
	case 12: 
	case 13: 
	case 14: 
	case 15: 
	case 16: 
	case 17: 
	case 18: 
	case 19: 
	case 20: 
	case 24: 
	case 25: 
	case 26: 
	case 27: 
	case 28: 
	case 29:
	case 30:
   	var affix = "th";
		$('#month-date').html(months[month] + ", " + monthday + affix);
}
$('#year').html(year + 1900);
// Gets Current BTC Price
function btcprice() {
var currency = "USD";
var apiurl = 'https://api.coindesk.com/v1/bpi/currentprice/' + currency + '.json';
    
$.ajax({
  type: "GET",
  url: apiurl,
  async: true,
  dataType: 'json',
  success: function(data){ 
    var price = data["bpi"][currency]["rate_float"];
	  var priceRounded = Math.round(price);
	  $("#btc-price").append("$" + priceRounded + " " + currency);
    }, 
  error: function(errorMessage){
      alert("ajax call failed");
    }  
}); // END ajax call	
}
btcprice();
}); // END document ready function

function openModal_1() {
    $('#modal-img-container').html("<img src='" + source_img_1 + "' alt='description' style='max-width: 1200;' />");
    $('#imagemodal').modal('show');
}

function openModal_3() {
    $('#modal-img-container').html("<img src='" + source_img_3 + "' alt='description' style='max-width: 1200;' />");
    $('#imagemodal').modal('show');
}
