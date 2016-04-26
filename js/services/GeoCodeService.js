/* global mario */

mario.service('reverseGeocode', [ '$http', function ($http) {
  this.reverseMarker = function (model, index) {
    $http.get('https://api.opencagedata.com/geocode/v1/json?q=' +
      model.map.markers[index].lat + ',' +
      model.map.markers[index].lng + '&key=8491dc280f0d8bfe17780388b16fe177')
    .then(function (response) {
      model.map.markers[index].formattedAddress = response.data.results[0].formatted.split(', ')
      model.map.markers[index].formattedAddress.pop()
      model.infoDrop = true
    })
  }
  this.reverseBatch = function (model) {
    /* not implemented yet */
  }
}])
