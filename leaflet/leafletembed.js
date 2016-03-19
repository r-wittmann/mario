var map

function initmap () {
	// set up the map
  map = new L.Map('map')

	// create the tile layer with correct attribution
  var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>'
  var osm = new L.TileLayer(osmUrl, {minZoom: 5, attribution: osmAttrib})

	// start the map in South-East England
  map.setView(new L.LatLng(48.137, 11.575), 11)
  map.addLayer(osm)
}
