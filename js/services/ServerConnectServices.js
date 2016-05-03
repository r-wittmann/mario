/* global angular mario*/

/**
 * all requests to the server will be handled here
 **/

mario.service('handleServerRequest', ['$http', 'handleServerResponse', function ($http, handleServerResponse) {
  const baseUrl = 'http://129.187.228.18:8080/restservices_'

  this.calculateIntermodal = function (model) {
    let startTarget = {
      'start': {
        'lat': model.map.markers[0].lat,
        'lon': model.map.markers[0].lng
      },
      'target': {
        'lat': model.map.markers[1].lat,
        'lon': model.map.markers[1].lng
      },
      'departure': ('0' + model.date.days).slice(-2) + '.' + ('0' + model.date.months).slice(-2) + '.' + model.date.years + ' ' + ('0' + model.date.hours).slice(-2) + ':' + ('0' + model.date.minutes).slice(-2) + ':00',
      'range': 5.0,
      'maxTransfers': 2147483647,
      'maxChanges': 2147483647
    }
    angular.toJson(startTarget)
    $http.post(baseUrl + 'inter/webresources/intermodal?', startTarget).then(function (response) {
      handleServerResponse.interRouteResponse(model, response)
    })
    /*
    $http.get('./mocks/geoJsonMock.geo.json').then(function (response) {
      handleServerResponse.interRouteResponse(model, response)
    })
    */
  }
}])

/**
 * all responses from the server will be handled here
 **/

mario.service('handleServerResponse', [ 'modifyMap', 'algorithmCost', function (modifyMap, algorithmCost) {
  this.interRouteResponse = function (model, response) {
    modifyMap.addRoute(model, response, true)
    model.usedAlgorithm = 'Intermodal'
  }
}])
