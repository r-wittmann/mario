/* global mario*/

/**
 * all requests to the server will be handled here
 **/

mario.service('handleServerRequest', ['$http', 'handleServerResponse', function ($http, handleServerResponse) {
  this.getMock = function ($scope) {
    $http.get('mocks/geoJsonMock.geo.json').then(function (response) {
      handleServerResponse.mockResponse($scope, response)
    })
  }

  this.calculateMockRoute = function ($scope) {
    let geojson = {
      data: {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [$scope.markers[0].lng, $scope.markers[0].lat],
              [$scope.markers[0].lng, $scope.markers[1].lat],
              [$scope.markers[1].lng, $scope.markers[1].lat]]
          }
        }]
      }
    }
    handleServerResponse.mockRoute($scope, geojson)
  }
}])

/**
 * all responses from the server will be handled here
 **/

mario.service('handleServerResponse', [ 'modifyMap', function (modifyMap) {
  this.mockResponse = function ($scope, response) {
    modifyMap.addRoute($scope, response)
  }
  this.mockRoute = function ($scope, geojson) {
    modifyMap.addRoute($scope, geojson)
  }
}])
