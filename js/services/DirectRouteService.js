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
      'algo': model.selected.algorithm
      /* 'cost': scope.selected.cost not implemented on server yet*/
    }
    angular.toJson(startTarget)

    $http.post(baseUrl + 'path/webresources/easyev?', startTarget)
    .then(function (response) {
      that.directRouteResponse(model, response)
    })
  }

  this.directRouteResponse = function (model, response) {
    modifyMap.addRoute(model, response, false)
    model.usedAlgorithm = model.selected.algorithm
  }

  this.getInitialInformation = function (model) {
    /* this file should be fetched from the server as well */
    $http.get('mocks/algorithms.json').then(function (response) {
      that.initialSave(model, response)
    })
  }

  this.initialSave = function (model, response) {
    angular.extend(model, response.data)
    model.selected.algorithm = response.data.algorithms[1]
    model.selected.costs = [response.data.algorithmCosts[0]]
  }

  this.selectAlgo = function (model, algorithm) {
    model.selected.costs = [model.selected.costs[0]]
  }

  this.selectCost = function (model, cost) {
    if (model.selected.algorithm.indexOf('skyline') >= 0) {
      if (model.selected.costs.length <= 1 && model.selected.costs[0] === cost) {
        return
      } else if (model.selected.costs.indexOf(cost) === -1) {
        model.selected.costs.push(cost)
      } else {
        model.selected.costs.splice(model.selected.costs.indexOf(cost), 1)
      }
    } else {
      model.selected.costs.pop()
      model.selected.costs.push(cost)
    }
  }
}])
