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
    model['usedAlgorithm'] = model.selected.algorithm.algorithm

    $http.post(baseUrl, startTarget)
      .then(response => {
        switch (model.usedAlgorithm) {
          case 'Dijkstra':
            that.singleRouteResponse(model, response)
            break
          case 'A_Star':
            that.singleRouteResponse(model, response)
            break
          case 'A_Star_with_Charging':
            that.chargingRouteResponse(model, response)
            break
          case 'Linear_Path_Skyline':
            that.multipleRouteResponse(model, response)
            break
          case 'Path_Skyline':
            that.multipleRouteResponse(model, response)
            break
        }
      })
  }

  this.singleRouteResponse = function (model, geojson) {
    model['algorithmKind'] = 'single'
    geojson.data.features[0].properties['instructions'] = [model.map.markers[0].formattedAddress[0], model.map.markers[1].formattedAddress[0]]
    geojson.data.features[0].properties['index'] = 0
    model.map.geojson = geojson
    model.map.geojson['style'] = {
      opacity: 1
    }

    model.map['routeInfo'] = geojson.data.features[0].properties.costs
    modifyMap.centerOnRoute(model)
  }

  this.multipleRouteResponse = function (model, geojson) {
    model['algorithmKind'] = 'multiple'
    model.map.routeInfo = undefined
    for (let i = 0; i < geojson.data.features.length; i++) {
      geojson.data.features[i].properties['index'] = i
    }
    model.map.geojson = geojson
    model.map.geojson['style'] = {
      opacity: 1
    }
  }

  this.chargingRouteResponse = function (model, geojson) {
    model['algorithmKind'] = 'charging'
    let chargingStation = geojson.data.features.shift()
    model.map.markers.push({
      lat: chargingStation.geometry.coordinates[1],
      lng: chargingStation.geometry.coordinates[0],
      draggable: false,
      focus: true,
      icon: {
        iconUrl: 'resources/charging.png',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
      }
    })
    that.singleRouteResponse(model, geojson)
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
