/* global mario */

mario.service('simulationService', ['$http', '$timeout', 'modifyMap', function ($http, $timeout, modifyMap) {
  let that = this
  let timer

  /* fetch random simulation mock */
  this.fetchSimulation = function (model, flag) {
    $http.get('./mocks/simulations/sim-berlin-' + (Math.round(Math.random() * 3) + 1) + '.json')
      .then(response => that.handleSimulationResponse(model, response, flag))
  }

  /* add simulation data to the map and set configurations for the simulation */
  this.handleSimulationResponse = function (model, response, flag) {
    model.map.markers = []
    model.map.paths = []
    $timeout.cancel(timer)
    model.simulation['metaData'] = response.data.features.shift()
    model.simulation.metaData.properties['index'] = 0
    model.simulation.metaData.properties['frames'] = model.simulation.metaData.properties.totalSimTime / model.simulation.metaData.properties.timePerTick
    model.simulation.metaData.properties['speed'] = 1
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
    that.paintSzenario(model, 0)
    modifyMap.centerOnRoute(false, model.simulation.metaData.geometry.coordinates)
    if (flag) that.control(model, 'play')
  }

  /* handle the click on any of the control buttons */
  this.control = function (model, command) {
    switch (command) {
      case 'next':
        model.simulation.metaData.properties.index = Math.min(++model.simulation.metaData.properties.index, model.simulation.metaData.properties.frames - 1)
        that.paintSzenario(model, model.simulation.metaData.properties.index)
        break
      case 'jumpforward':
        model.simulation.metaData.properties.index = Math.min(model.simulation.metaData.properties.index + 250, model.simulation.metaData.properties.frames - 1)
        that.paintSzenario(model, model.simulation.metaData.properties.index)
        break
      case 'back':
        model.simulation.metaData.properties.index = Math.max(--model.simulation.metaData.properties.index, 0)
        that.paintSzenario(model, model.simulation.metaData.properties.index)
        break
      case 'jumpback':
        model.simulation.metaData.properties.index = Math.max(model.simulation.metaData.properties.index - 250, 0)
        that.paintSzenario(model, model.simulation.metaData.properties.index)
        break
      case 'play':
        that.control(model, 'next')
        model.simulation.metaData.properties.index !== model.simulation.metaData.properties.frames - 1
        ? timer = $timeout(() => that.control(model, 'play'), 50 / model.simulation.metaData.properties.speed)
        : that.fetchSimulation(model, true)
        break
      case 'pause':
        $timeout.cancel(timer)
        break
      case 'slower':
        model.simulation.metaData.properties.speed = Math.max(model.simulation.metaData.properties.speed /= 2, 0.25)
        break
      case 'faster':
        model.simulation.metaData.properties.speed = Math.min(model.simulation.metaData.properties.speed *= 2, 4)
        break
      default:
        console.log(command)
    }
  }

  /* handles the click on the simulation control bar */
  this.jumpTo = function (model, event) {
    model.simulation.metaData.properties.index = Math.round((event.offsetX + 1) * model.simulation.metaData.properties.frames / 175)
    that.paintSzenario(model, model.simulation.metaData.properties.index)
  }

  /* function is called for every new szenario of the simulation. $timeout to start a digest cycle manually */
  this.paintSzenario = function (model, index) {
    $timeout(() => that.paintCars(model, index), 10)
    $timeout(() => that.paintStorms(model, index), 10)
  }

  /* paint cars on the map */
  this.paintCars = function (model, index) {
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
      if (model.map.markers.length > model.simulation.metaData.properties.carCount) model.map.markers.shift()
    })
  }

  /* paint storms on the map */
  this.paintStorms = function (model, index) {
    model.map.paths = []
    for (let i = 0; i < model.simulation.metaData.properties.stormCount; i++) {
      let coord = model.simulation.data.storms[index].geometry.coordinates[i]
      model.map.paths.push({
        type: 'circle',
        radius: model.simulation.data.storms[index].properties.radii[i] * 1000,
        color: '#0033ff',
        opacity: 1,
        weight: 1,
        fillColor: '#0033ff',
        fillOpacity: 0.3,
        latlngs: {
          lat: coord[1],
          lng: coord[0]
        }
      })
    }
  }

  /* remove simulation data */
  this.removeSimulation = function (model) {
    model.simulation = {}
  }
}])
