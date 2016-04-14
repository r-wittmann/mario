/* global angular mario */

mario.service('reverseGeocode', [ '$http', function ($http) {
  this.reverseMarker = function (scope, index) {
    $http.get('http://nominatim.openstreetmap.org/reverse?format=json&lat=' +
      scope.markers[index].lat + '&lon=' + scope.markers[index].lng + '&zoom=18&addressdetails=1')
    .then(function (response) {
      let address = response.data.address

      angular.extend(scope.markers[index], {
        street: `${address.road ? address.road : address.cycleway}`,
        streetNumber: address.house_number,
        postalCode: address.postcode,
        city: `${address.city ? address.city : address.town ? address.town : address.village ? address.village : address.state}`
      })
    })
  }

  this.reverseBatch = function ($scope) {
    /* not implemented yet */
  }
}])
