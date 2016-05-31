/* global mario */

mario.service('simulationService', ['$http', function ($http) {
  let that = this

  this.fetchSimulation = function (model) {
    $http.get('./mocks/sim1-mod.geo.json')
      .then(response => {
        that.handleSimulationResponse(model, response)
      })
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
  }
}])
