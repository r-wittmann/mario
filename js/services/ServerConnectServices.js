/* global angular mario*/

/**
 * all requests to the server will be handled here
 **/

mario.service('handleServerRequest', ['$http', 'handleServerResponse', function ($http, handleServerResponse) {
  const baseUrl = 'http://129.187.228.18:8080/restservices_'
  const hereUrl = 'https://places.api.here.com/places/v1/discover/explore?'
  const App_Id = 'WmIkt7vA4CQCMLSXEmOf'
  const App_Code = 'LBj3S0_CED-_JWWO4VvUcg'

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

    $http.post(baseUrl + 'path/webresources/easyev?', startTarget)
    .then(function (response) {
      handleServerResponse.directRouteResponse(model, response)
    })
  }

  this.fetchPoi = function (model) {
    let attributes = 'in=' + model.map.markers[0].lat + ',' + model.map.markers[0].lng + ';r=1000&cat=sights-museums,leisure-outdoor,natural-geographical&tf=plain' + '&app_id=' + App_Id + '&app_code=' + App_Code

    $http.get(hereUrl + attributes)
      .then(function (response) {
        handleServerResponse.addPoi(model, response)
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
  this.mockAlgorithms = function (model, response) {
    algorithmCost.initialSave(model, response)
  }

  this.directRouteResponse = function (model, response) {
    modifyMap.addRoute(model, response, false)
    model.usedAlgorithm = model.selected.algorithm
  }
  this.interRouteResponse = function (model, response) {
    modifyMap.addRoute(model, response, true)
    model.usedAlgorithm = 'Intermodal'
  }
  this.addPoi = function (model, response) {
    modifyMap.addPoi(model, response)
  }
}])
