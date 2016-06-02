/* global mario */

mario.service('simulationService', ['$http', '$timeout', 'modifyMap', function ($http, $timeout, modifyMap) {
  let that = this

  this.fetchSimulation = function (model) {
    $http.get('./mocks/simulations/sim2.json')
      .then(response => that.handleSimulationResponse(model, response))
  }

  this.handleSimulationResponse = function (model, response) {
    model.simulation['metaData'] = response.data.features.shift()
    model.simulation.metaData.properties['index'] = 0
    model.simulation.metaData.properties['frames'] = model.simulation.metaData.properties.totalSimTime / model.simulation.metaData.properties.timePerTick
    model.simulation['data'] = {
      cars: [],
      storms: []
    }

    for (let feature of response.data.features) {
      if (feature.properties.name === 'cars') {
        model.simulation.data.cars.push(feature)
      }
    }
    for (let feature of response.data.features) {
      if (feature.properties.name === 'storms') {
        model.simulation.data.storms.push(feature)
      }
    }
    that.paintSzenarios(model, 0)
    $timeout(() => modifyMap.centerOnRoute(false, model.simulation.metaData.geometry.coordinates), 100)
  }

  this.control = function (model, command, play) {
    switch (command) {
      case 'next':
        model.simulation.metaData.properties.index = (model.simulation.metaData.properties.index + 1) % model.simulation.metaData.properties.frames
        that.paintSzenarios(model, model.simulation.metaData.properties.index)
        break
      case 'back':
        model.simulation.metaData.properties.index > 0 ? model.simulation.metaData.properties.index-- : model.simulation.metaData.properties.index = model.simulation.metaData.properties.frames - 1
        that.paintSzenarios(model, model.simulation.metaData.properties.index)
        break
      case 'play':
        that.control(model, 'next')
        $timeout(() => that.control(model, 'play'), 500)
        break
      default:
        console.log(command)
    }
  }

  this.paintSzenarios = function (model, index) {
    that.paintCars(model, index)
    $timeout(() => that.paintStorms(model, index), 10)
  }

  this.paintCars = function (model, index) {
    model.map.markers = []
    model.simulation.data.cars[index].geometry.coordinates.map(coord => {
      model.map.markers.push({
        lat: coord[1],
        lng: coord[0],
        draggable: false,
        icon: {
          iconUrl: 'resources/car-marker.png',
          iconSize: [27, 21],
          iconAnchor: [13, 10]
        }
      })
    })
  }

  this.paintStorms = function (model, index) {
    model.map.paths = {}
    model.simulation.data.storms[index].geometry.coordinates.map(coord => {
      model.map.paths[coord[0] + coord[1]] = {
        type: 'circle',
        radius: 4000,
        color: '#68c631',
        opacity: 1,
        weight: 1,
        fillColor: '#68c631',
        fillOpacity: 0.3,
        latlngs: {
          lat: coord[1],
          lng: coord[0]
        }
      }
    })
  }
}])
