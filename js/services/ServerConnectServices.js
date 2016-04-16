/* global angular mario*/

/**
 * all requests to the server will be handled here
 **/

mario.service('handleServerRequest', ['$http', 'handleServerResponse', function ($http, handleServerResponse) {
  let baseUrl = 'http://129.187.228.18:8080/restservices_path/webresources/'

  this.getInitialInformation = function (scope) {
    /* this file should be fetched from the server as well */
    $http.get('mocks/algorithms.json').then(function (response) {
      handleServerResponse.mockAlgorithms(scope, response)
    })
  }

  this.calculateRoute = function (scope) {
    let startTarget = {
      'start': {
        'lat': scope.map.markers[0].lat,
        'lon': scope.map.markers[0].lng
      },
      'target': {
        'lat': scope.map.markers[1].lat,
        'lon': scope.map.markers[1].lng
      },
      'algo': scope.selected.algorithm
      /* 'cost': scope.selected.cost */
    }
    angular.toJson(startTarget)
    $http.post(baseUrl + 'easyev?', startTarget).then(function (response) {
      handleServerResponse.directRouteResponse(scope, response)
    })
  }

  this.calculateIntermodal = function (scope) {
    console.log('called calculateIntermodal(scope), not implemented yet')
    console.log('start:', scope.map.markers[0], '\ntarget:', scope.map.markers[1])
  }
}])

/**
 * all responses from the server will be handled here
 **/

mario.service('handleServerResponse', [ 'modifyMap', function (modifyMap) {
  this.mockAlgorithms = function (scope, response) {
    angular.extend(scope, response.data)
    scope.selected = {
      'algorithm': response.data.algorithms[1],
      'cost': response.data.algorithmCosts[0]
    }
  }

  this.directRouteResponse = function (scope, response) {
    modifyMap.addRoute(scope, response)
  }
}])
