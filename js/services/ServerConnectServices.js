/* global angular mario*/

/**
 * all requests to the server will be handled here
 **/

mario.service('handleServerRequest', ['$http', 'handleServerResponse', function ($http, handleServerResponse) {
  let baseUrl = 'http://129.187.228.18:8080/restservices_'

  this.getInitialInformation = function (model) {
    /* this file should be fetched from the server as well */
    $http.get('mocks/algorithms.json').then(function (response) {
      handleServerResponse.mockAlgorithms(model, response)
    })
  }

  this.calculateRoute = function (model) {
    let startTarget = {
      'start': {
        'lat': model.map.markers[0].lat,
        'lon': model.map.markers[0].lng
      },
      'target': {
        'lat': model.map.markers[1].lat,
        'lon': model.map.markers[1].lng
      },
      'algo': model.selected.algorithm
      /* 'cost': scope.selected.cost not implemented on server yet*/
    }
    angular.toJson(startTarget)
    $http.post(baseUrl + 'path/webresources/easyev?', startTarget).then(function (response) {
      handleServerResponse.directRouteResponse(model, response)
    })
  }

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
      'departure': model.date.days + '.' + model.date.months + '.' + model.date.years + ' ' + model.date.hours + ':' + model.date.minutes + ':00',
      'range': 5.0,
      'maxTransfers': 2147483647,
      'maxChanges': 2147483647
    }
    angular.toJson(startTarget)
    $http.post(baseUrl + 'inter/websources/intermodal?', startTarget).then(function (response) {
      console.log(response)
    })
  }
}])

/**
 * all responses from the server will be handled here
 **/

mario.service('handleServerResponse', [ 'modifyMap', function (modifyMap) {
  this.mockAlgorithms = function (model, response) {
    angular.extend(model, response.data)
    model.selected = {
      'algorithm': response.data.algorithms[1],
      'cost': response.data.algorithmCosts[0]
    }
  }

  this.directRouteResponse = function (model, response) {
    modifyMap.addRoute(model, response)
    model.usedAlgorithm = model.selected.algorithm
  }
}])
