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
}])

/**
 * all responses from the server will be handled here
 **/

mario.service('handleServerResponse', [ 'modifyMap', function (modifyMap) {
  this.mockResponse = function ($scope, response) {
    modifyMap.addRoute($scope, response)
  }
}])
