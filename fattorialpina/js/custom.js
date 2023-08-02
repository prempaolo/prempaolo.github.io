
var products = [];

function addProduct(product) {
	products.push(product);
	swal("Ottimo!", product+" e' stato correttamente inserito nel carrello!", "success");
}

function getProducts() {
	return products.toString();
}

$(document).ready(function(){
	$("#footer").load("footer.html")

	$( "#shop-icon" ).on( "mouseover", function() {
		var element = $( "#shop-icon-child" );
		if (element.children().length > 0) {
				element.empty();	
				if (products.length == 0) {
					element.append( "<table border=\"1\"><thead><tr><th>Nessun prodotto nel carrello</th></tr></thead></table>" );
				} else {
					for (p in products) {
						element.append( "<table border=\"1\"><thead><tr><th>"+products[p]+"</th></tr></thead></table>" );
					}
				}
		} else {
				element.append( "<table border=\"1\"><thead><tr><th>Nessun prodotto nel carrello</th></tr></thead></table>" );
		}
	} );

	$( "#shop-icon" ).on( "click", function() {
		window.location.href = "mailto:step@sblep.sblep?subject="+getProducts();
	} );
});
