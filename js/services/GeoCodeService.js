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
      model.map.markers[index].lng + ',1000&app_id=' + App_Id + '&app_code=' + App_Code +
      '&mode=retrieveAddresses&gen=9&language=en&maxresults=5')
    .then(function (response) {
      let i = 0
      if (response.data.Response.View[0].Result[0]['MatchLevel'] === 'houseNumber') i = 0
      else if (response.data.Response.View[0].Result.length >= 2 && response.data.Response.View[0].Result[1].Location.Address.Street) i = 1
      model.map.markers[index].formattedAddress = response.data.Response.View[0].Result[i].Location.Address.Label.split(', ')
      model.map.markers[index].formattedAddress.pop()
      model.infoDrop = true
    })
  }

  this.reverseInstructions = function (model) {
    for (let feature of model.map.geojson.data.features) {
      for (let index in feature.properties.instructions) {
        if (feature.properties.instructions[index] instanceof Array) {
          $http.get(hereUrl + 'prox=' +
            feature.properties.instructions[index]['0'] + ',' +
            feature.properties.instructions[index]['1'] + ',1000&app_id=' + App_Id + '&app_code=' + App_Code +
            '&mode=retrieveAddresses&gen=9&language=en&maxresults=5')
          .then(function (response) {
            let i = 0
            if (response.data.Response.View[0].Result[0]['MatchLevel'] === 'houseNumber') i = 0
            else if (response.data.Response.View[0].Result.length >= 2) i = 1
            feature.properties.instructions[index] = response.data.Response.View[0].Result[i].Location.Address.Label.split(', ')
            feature.properties.instructions[index] = feature.properties.instructions[index][0]
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
