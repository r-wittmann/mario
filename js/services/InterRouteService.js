/* global angular mario */

mario.service('interRouteService', [ '$http', 'modifyMap', 'reverseGeocode', function ($http, modifyMap, reverseGeocode) {
  let that = this
  const baseUrl = 'http://129.187.228.18:8080/restservices_inter/webresources/intermodal?'

  this.calculateIntermodal = function (model, range) {
    let startTarget = {
      'start': {
        'lat': model.map.markers[0].lat,
        'lon': model.map.markers[0].lng
      },
      'target': {
        'lat': model.map.markers[1].lat,
        'lon': model.map.markers[1].lng
      },
      'departure': ('0' + model.date.days).slice(-2) + '.' + ('0' + model.date.months).slice(-2) + '.' + model.date.years + ' ' + ('0' + model.date.hours).slice(-2) + ':' + ('0' + model.date.minutes).slice(-2) + ':00',
      'range': range,
      'maxTransfers': 2147483647,
      'maxChanges': 2147483647
    }
    angular.toJson(startTarget)
    $http.post(baseUrl, startTarget)
      .then(response => {
        that.addInterRoute(model, response)
        model.usedAlgorithm = 'Intermodal'
      })
  }

  this.addInterRoute = function (model, geojson) {
    for (let i = 0; i < geojson.data.features.length; i++) {
      geojson.data.features[i].properties['index'] = i
    }
    geojson.data.features[0].properties.instructions[0] = model.map.markers[0].formattedAddress[0]
    geojson.data.features[geojson.data.features.length - 2].properties.instructions[1] = model.map.markers[1].formattedAddress[0]
    model.map.geojson = geojson
    model.map.geojson['style'] = {
      opacity: 1
    }

    model.map['routeInfo'] = geojson.data.features.pop().properties['routeInfo']
    modifyMap.centerOnRoute(model)
    reverseGeocode.reverseInstructions(model)
  }

  this.modelDate = function (model, newDate) {
    if (!newDate) newDate = new Date()
    model.date = {
      hours: newDate.getHours(),
      minutes: newDate.getMinutes(),
      days: newDate.getDate(),
      months: newDate.getMonth() + 1,
      years: newDate.getFullYear()}
  }

  this.changeDate = function (model, index, direction) {
    let oldDate = model.date
    let newDate = new Date(
      index === 4 ? oldDate.years + direction : oldDate.years,
      index === 3 ? oldDate.months + direction : oldDate.months - 1,
      index === 2 ? oldDate.days + direction : oldDate.days,
      index === 0 ? oldDate.hours + direction : oldDate.hours,
      index === 1 ? oldDate.minutes + direction : oldDate.minutes)
    that.modelDate(model, newDate)
  }
}])
