/* global angular mario*/

/**
 * all requests to the server will be handled here
 **/

mario.service('handleServerRequest', ['$http', 'handleServerResponse', function ($http, handleServerResponse) {
  let baseUrl = 'http://129.187.228.18:8080/restservices_'
  let App_Id = 'WmIkt7vA4CQCMLSXEmOf'
  let App_Code = 'LBj3S0_CED-_JWWO4VvUcg'

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
    if (model.selected.poi.poi) {
      this.fetchPoi(model)
    }
  }

  this.fetchPoi = function (model) {
    $http.get('https://places.cit.api.here.com/places/v1/discover/explore?at=' +
      model.map.markers[0].lat + ',' + model.map.markers[0].lng +
      '&app_id=' + App_Id + '&app_code' + App_Code +
      '&tf=plain&pretty=true')
      .then(function (response) {
        console.log(response)
        /* not implemented yet, error in request*/
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
}])
