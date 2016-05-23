/* global mario */

mario.service('reverseGeocode', [ '$http', function ($http) {
  let that = this
  const hereUrl = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?'
  const App_Id = 'WmIkt7vA4CQCMLSXEmOf'
  const App_Code = 'LBj3S0_CED-_JWWO4VvUcg'

  this.reverseMarker = function (model, index) {
    // $http.get('https://api.opencagedata.com/geocode/v1/json?q=' +
    //   model.map.markers[index].lat + ',' +
    //   model.map.markers[index].lng + '&key=8491dc280f0d8bfe17780388b16fe177')
    // .then(function (response) {
    //   model.map.markers[index].formattedAddress = response.data.results[0].formatted.split(', ')
    //   model.map.markers[index].formattedAddress.pop()
    //   model.infoDrop = true
    // })
    $http.get(hereUrl + 'prox=' +
      model.map.markers[index].lat + ',' +
      model.map.markers[index].lng + ',500&app_id=' + App_Id + '&app_code=' + App_Code +
      '&mode=retrieveAddresses&gen=9&language=en&maxresults=1')
    .then(function (response) {
      model.map.markers[index].formattedAddress = response.data.Response.View[0].Result[0].Location.Address.Label.split(', ')
      model.map.markers[index].formattedAddress.pop()
      model.infoDrop = true
    })
  }

  this.reverseInstructions = function (model) {
    for (let feature of model.map.geojson.data.features) {
      for (let i in feature.properties.instructions) {
        if (feature.properties.instructions[i] instanceof Array) {
          $http.get(hereUrl + 'prox=' +
            feature.properties.instructions[i]['0'] + ',' +
            feature.properties.instructions[i]['1'] + ',500&app_id=' + App_Id + '&app_code=' + App_Code +
            '&mode=retrieveAddresses&gen=9&language=en&maxresults=1')
          .then(function (response) {
            feature.properties.instructions[i] = response.data.Response.View[0].Result[0].Location.Address.Label.split(', ')
            console.log(feature.properties.instructions[i][0])
            feature.properties.instructions[i] = feature.properties.instructions[i][0]
          })
        }
      }
    }
    // $http.get('https://api.opencagedata.com/geocode/v1/json?q=' +
    //   latlng[0] + ',' +
    //   latlng[1] + '&key=8491dc280f0d8bfe17780388b16fe177')
    // .then(function (response) {
    //   console.log(response.data.results[0].formatted)
    //   return response.data.results[0].formatted
    // })
  }
  this.reverseBatch = function (model) {
    /* not implemented yet */
  }
}])
