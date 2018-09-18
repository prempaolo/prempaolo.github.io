$(document).ready(function(){

	var card_num = 1;

	function createCard(column){
		var parent;
		switch(column) {
			case 1:
				parent = document.getElementById('first-column');
				var first_child_1 = false;
				break;
			case 2:
				parent = document.getElementById('second-column');
				var first_child_2 = false;
				break;
			case 3:
				parent = document.getElementById('third-column');
				var first_child_3 = false;
				break;
			default:
				//TODO: raise error and continue with the other card
				break;
		}

		var divOuter = document.createElement("div");
		if(parent.innerHTML=="") {
			divOuter.setAttribute("class", "card");
		} else {
    		divOuter.setAttribute("class", "card card-child");
    	}

    	//Img
    	var title_img_link = document.createElement("a");
    	title_img_link.setAttribute("id", "img-card-link-" + card_num);
    	var img = document.createElement("img");
    	img.setAttribute("id", "img-card-" + card_num);
    	img.setAttribute("class", "card-img-top");
    	title_img_link.appendChild(img);
    	divOuter.appendChild(title_img_link);

    	//Body
    	var body = document.createElement("div");
    	body.setAttribute("class", "card-body");

    	var subreddit_title = document.createElement("div");
    	subreddit_title.setAttribute("id", "card-subreddit-title-" + card_num);
    	body.appendChild(subreddit_title);

    	var title_link = document.createElement("a");
    	title_link.setAttribute("id", "title-card-link-" + card_num);
    	var title_link_content = document.createElement("p");
    	title_link_content.setAttribute("id", "title-card-" + card_num);
    	title_link.appendChild(title_link_content);
    	body.appendChild(title_link);

		var score_p_class = document.createElement("p");
		score_p_class.setAttribute("class", "score");
		score_p_class.setAttribute("id", "score-card-" + card_num);
		var font_awe = document.createElement("i");
		font_awe.setAttribute("class", "fa fa-heart");
		score_p_class.appendChild(font_awe);
		body.appendChild(score_p_class);

		var arrow_p_class = document.createElement("p");
		arrow_p_class.setAttribute("style", "cursor: pointer;");
		arrow_p_class.setAttribute("id", "next-post-" + card_num);
		arrow_p_class.innerHTML = "Next Post ";
		var font_awe1 = document.createElement("i");
		font_awe1.setAttribute("class", "fa fa-arrow-right");
		arrow_p_class.appendChild(font_awe1);
		body.appendChild(arrow_p_class);
		divOuter.appendChild(body);

		parent.appendChild(divOuter);

		card_num = card_num + 1;
	}

	createCard(1);
	createCard(3);
	createCard(3);
});