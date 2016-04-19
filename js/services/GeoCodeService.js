/* global angular mario */

mario.service('reverseGeocode', [ '$http', function ($http) {
  this.reverseMarker = function (model, index) {
    $http.get('http://nominatim.openstreetmap.org/reverse?format=json&lat=' +
      model.map.markers[index].lat + '&lon=' + model.map.markers[index].lng + '&zoom=18&addressdetails=1')
    .then(function (response) {
      let address = response.data.address

      model.infoDrop = true

      angular.extend(model.map.markers[index], {
        street: `${address.road ? address.road : address.path ? address.path : address.cycleway ? address.cycleway : address.footway}`,
        streetNumber: address.house_number,
        postalCode: address.postcode,
        city: `${address.city ? address.city : address.town ? address.town : address.village ? address.village : address.state}`
      })
    })
  }

  this.reverseBatch = function (model) {
    /* not implemented yet */
  }
}])
