/* global mario */

mario.service('directRouteService', [ '$http', 'modifyMap', function ($http, modifyMap) {
  let that = this
  const baseUrl = 'http://129.187.228.18:8080/restservices_path/webresources/easyev?'

  /* mocks the requesting of algorithm data from the server and saves the response to the scope */
  this.getInitialInformation = function (model) {
    $http.get('mocks/algorithms.json')
      .then(response => {
        model['algorithms'] = response.data.Routing_Algorithms
        model.selected['algorithm'] = model.algorithms[0]
        model.selected['costs'] = [model.selected.algorithm.criteria[0]]
      })
  }

  /* fetchDirect builds the request JSON, sends it to the server and handles the response */
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
      'algo': model.selected.algorithm.algorithm/*,
      'cost': model.selected.costs --- not implemented yet */
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

  /* add route to map of a single route algorithm and set route instructions to the scope */
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

  /* add route to the map of a multiple route algorithm */
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

  /* add charging route to the map with charging marker and delegate the rest to singleRouteResponse */
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
        iconSize: [30, 50],
        iconAnchor: [15, 50]
      }
    })
    that.singleRouteResponse(model, geojson)
  }

  /* removes route from the map and deletes used algorithm and route info */
  this.removeRoute = function (model) {
    model.map.geojson = []
    model.usedAlgorithm = undefined
    model.map.routeInfo = undefined
  }

  /* handles the selection of the algorithm */
  this.selectAlgo = function (model, algorithm) {
    model.selected.algorithm = algorithm
    model.selected.costs = [model.selected.algorithm.criteria[0]]
  }

  /* handles the selection of the algorithms costs */
  this.selectCost = function (model, cost) {
    let selected = model.selected
    if (selected.algorithm.max_criteria === 1) selected.costs = [cost]
    else {
      if (selected.costs.indexOf(cost) === -1) selected.costs.push(cost)
      else selected.costs.splice(selected.costs.indexOf(cost), 1)
    }
  }
}])
