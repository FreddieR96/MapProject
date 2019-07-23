var londonMap;
var marker;
var markers = [];
var centralLondon;
var searchForm = document.getElementById("searchform");
var mcdcheck;
var searchQuery;
var contentBox = document.getElementById("content-column");
var searched = false;


function initMap() {
centralLondon = new google.maps.LatLng(51.509, -0.118);
londonMap = new google.maps.Map(document.getElementById('firstmap'), {
	center: centralLondon,
	zoom: 13,
	zoomControl: false,
	mapTypeControl: false,
	streetViewControl: false
});
var searchMcD = {
	location: centralLondon,
	radius: '600',
	name: "McDonald's"
};


mcdcheck = new google.maps.places.PlacesService(londonMap);
mcdcheck.nearbySearch(searchMcD, callback);
};



function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
	else {
	noResults("There aren't any McDonald's in this area");
	searched = true;
	}
}

function createMarker(thePlace) {
	marker = new google.maps.Marker({
		map: londonMap,
		position: thePlace.geometry.location
	});
	var placeName = thePlace.name;
	addWindow(marker, placeName);
	markers.push(marker);
};

function addWindow(marker, windowcontent) {
		var infoWindow = new google.maps.InfoWindow({
			content: windowcontent
		});
		google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(londonMap, marker);
		});
};

function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}

function handleSearch() {
if (searched == true) {
removeNoResults();
}
var searchRequest = {
	query: searchQuery,
	fields: ['geometry'],
};
mcdcheck.findPlaceFromQuery(searchRequest, function(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
	clearMarkers();
	londonMap.setCenter(results[0].geometry.location);
	var searchMcD = {
	location: results[0].geometry.location,
	radius: '600',
	name: "McDonald's"
};
	mcdcheck.nearbySearch(searchMcD, callback);
	searched = false;
	}
	else {
	noResults("This location is not accessible, please try again");
	searched = true;
	}
	});
};

function noResults(resultsType) {
	
	var errorBox = document.createElement('div');
	errorBox.className = "errorbox";
	var errorText = document.createTextNode(resultsType);
	errorBox.appendChild(errorText);
	contentBox.appendChild(errorBox);
}

function removeNoResults() {
	var removeBox = document.getElementsByClassName('errorbox')[0];
	contentBox.removeChild(removeBox);
}
searchForm.addEventListener('submit', function(event){
	event.preventDefault();
	searchQuery = document.querySelector("#searchbar").value;
	handleSearch();
});