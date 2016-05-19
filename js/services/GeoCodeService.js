/* global mario */

mario.service('reverseGeocode', [ '$http', function ($http) {
  let that = this
  const hereUrl = 'https://places.api.here.com/places/v1/discover/explore?'
  const App_Id = 'WmIkt7vA4CQCMLSXEmOf'
  const App_Code = 'LBj3S0_CED-_JWWO4VvUcg'

  this.reverseMarker = function (model, index) {
    $http.get('https://api.opencagedata.com/geocode/v1/json?q=' +
      model.map.markers[index].lat + ',' +
      model.map.markers[index].lng + '&key=8491dc280f0d8bfe17780388b16fe177')
    .then(function (response) {
      model.map.markers[index].formattedAddress = response.data.results[0].formatted.split(', ')
      model.map.markers[index].formattedAddress.pop()
      model.infoDrop = true
    })
    $http.get('https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=' +
      model.map.markers[index].lat + ',' + model.map.markers[index].lng +
      ',100&mode=retrieveAddresses&app_id=' + App_Id + '&app_code=' + App_Code + '&gen=9' +
      '&language=en' +
      '&maxresults=1')
    .then(function (response) {
      console.log(response)
    })
  }

  this.reverseInstructions = function (model) {
    
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
