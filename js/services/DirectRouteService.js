/* global angular mario */

mario.service('directRouteService', [ '$http', 'modifyMap', function ($http, modifyMap) {
  let that = this
  const baseUrl = 'http://129.187.228.18:8080/restservices_'

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
      'algo': model.selected.algorithm.algorithm
      /* 'cost': scope.selected.cost not implemented on server yet*/
    }
    angular.toJson(startTarget)

    $http.post(baseUrl + 'path/webresources/easyev?', startTarget)
    .then(function (response) {
      that.directRouteResponse(model, response)
    })
  }

  this.directRouteResponse = function (model, response) {
    modifyMap.addDirectRoute(model, response)
    model.usedAlgorithm = model.selected.algorithm.algorithm
  }

  this.getInitialInformation = function (model) {
    /* this file should be fetched from the server as well */
    $http.get('mocks/algorithms.json').then(function (response) {
      that.initialSave(model, response)
    })
  }

  this.initialSave = function (model, response) {
    model['algorithms'] = response.data.Routing_Algorithms
    model.selected.algorithm = model.algorithms[1]
    model.selected.costs = [model.selected.algorithm.criteria[0]]
  }

  this.selectAlgo = function (model, algorithm) {
    model.selected.algorithm = algorithm
    model.selected.costs = [model.selected.algorithm.criteria[0]]
  }

  this.selectCost = function (model, cost) {
    if (model.selected.algorithm.max_criteria === 1) model.selected.costs = [cost]
    else {
      if (model.selected.costs.indexOf(cost) === -1) model.selected.costs.push(cost)
      else model.selected.costs.splice(model.selected.costs.indexOf(cost), 1)
    }
  }
}])
