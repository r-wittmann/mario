/* global mario */

mario.service('directRouteService', [ '$http', 'modifyMap', function ($http, modifyMap) {
  let that = this
  const baseUrl = 'http://129.187.228.18:8080/restservices_path/webresources/easyev?'

  this.getInitialInformation = function (model) {
    $http.get('mocks/algorithms.json')
      .then(response => {
        model['algorithms'] = response.data.Routing_Algorithms
        model.selected['algorithm'] = model.algorithms[1]
        model.selected['costs'] = [model.selected.algorithm.criteria[0]]
      })
  }

  this.fetchDirect = function (model) {
    let markers = model.map.markers
    let startTarget = {
      'start': {
        'lat': markers[0].lat,
        'lon': markers[0].lng
      },
      'target': {
        'lat': markers[1].lat,
        'lon': markers[1].lng
      },
      'algo': model.selected.algorithm.algorithm
      /* 'cost': scope.selected.cost --- not implemented on server yet*/
    }

    $http.post(baseUrl, startTarget)
      .then(response => {
        that.addDirect(model, response)
        model['usedAlgorithm'] = model.selected.algorithm.algorithm
      })
  }

  this.addDirect = function (model, geojson) {
    geojson.data.features[0].properties['instructions'] = [model.map.markers[0].formattedAddress[0], model.map.markers[1].formattedAddress[0]]
    geojson.data.features[0].properties['index'] = 0
    model.map.geojson = geojson
    model.map.geojson['style'] = {
      opacity: 1
    }

    model.map['routeInfo'] = geojson.data.features[0].properties['costs']
    modifyMap.centerOnRoute(model)
  }

  this.removeRoute = function (model) {
    model.map.geojson = []
    model.usedAlgorithm = undefined
    model.map.routeInfo = undefined
  }

  this.selectAlgo = function (model, algorithm) {
    model.selected.algorithm = algorithm
    model.selected.costs = [model.selected.algorithm.criteria[0]]
  }

  this.selectCost = function (model, cost) {
    let selected = model.selected
    if (selected.algorithm.max_criteria === 1) selected.costs = [cost]
    else {
      if (selected.costs.indexOf(cost) === -1) selected.costs.push(cost)
      else selected.costs.splice(selected.costs.indexOf(cost), 1)
    }
  }
}])
