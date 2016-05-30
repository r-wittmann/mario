/* global mario */

mario.service('simulationService', ['$http', function ($http) {
  this.fetchSimulation = function (model) {
    $http.get('./mocks/sim1-mod.geo.json')
      .then(response => {
        model.map.geojson = response
      })
  }
}])
