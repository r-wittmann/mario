/* global mario */

mario.service('reverseGeocode', [ '$http', 'addToScope', function ($http, addToScope) {
  this.reverseMarker = function ($scope, index) {
    $http.get('http://nominatim.openstreetmap.org/reverse?format=json&lat=' +
      $scope.markers[index].lat + '&lon=' + $scope.markers[index].lng + '&zoom=18&addressdetails=1')
    .then(function (response) {
      addToScope.addAddress($scope, index, response.data.address)
    })
  }
}])
