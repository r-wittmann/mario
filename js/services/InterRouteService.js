/* global angular mario */

mario.service('interRouteService', [ '$http', 'modifyMap', function ($http, modifyMap) {
  let that = this
  const baseUrl = 'http://129.187.228.18:8080/restservices_'

  this.calculateIntermodal = function (model) {
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
      'range': 5.0,
      'maxTransfers': 2147483647,
      'maxChanges': 2147483647
    }
    angular.toJson(startTarget)
    $http.post(baseUrl + 'inter/webresources/intermodal?', startTarget).then(function (response) {
      that.interRouteResponse(model, response)
    })
    /*
    $http.get('./mocks/geoJsonMock.geo.json').then(function (response) {
      that.interRouteResponse(model, response)
    })
    */
  }

  this.interRouteResponse = function (model, response) {
    modifyMap.addRoute(model, response, true)
    model.usedAlgorithm = 'Intermodal'
  }

  this.modelDate = function (model, newDate) {
    model.date = {
      hours: newDate.getHours(),
      minutes: newDate.getMinutes(),
      days: newDate.getDate(),
      months: newDate.getMonth() + 1,
      years: newDate.getFullYear()}
  }

  this.updateDate = function (model) {
    let newDate = new Date()
    that.modelDate(model, newDate)
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
