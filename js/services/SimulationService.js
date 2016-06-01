/* global mario */

mario.service('simulationService', ['$http', '$timeout', function ($http, $timeout) {
  let that = this

  this.fetchSimulation = function (model) {
    $http.get('./mocks/sim1-mod.geo.json')
      .then(response => that.handleSimulationResponse(model, response))
  }

  this.handleSimulationResponse = function (model, response) {
    model.simulation['metaData'] = response.data.features.shift()
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
  }

  this.paintSzenarios = function (model, index) {
    that.paintCars(model, 0)
    $timeout(() => that.paintStorms(model, 0), 10)
  }

  this.paintCars = function (model, index) {
    console.log('paintCars')
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
    console.log('paintStorms')
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

  this.control = function (model, command) {
    console.log(model.map.paths)
  }
}])
