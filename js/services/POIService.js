/* global mario */

mario.service('poiService', [ '$http', 'modifyMap', function ($http, modifyMap) {
  let that = this

  this.selectPoi = function (model, category) {
    if (model.selected.poi.indexOf(category) === -1) model.selected.poi.push(category)
    else model.selected.poi.splice(model.selected.poi.indexOf(category), 1)
  }

  this.fetchPoi = function (model, url) {
    if (model.map.markers.length === 2) model.map.markers.shift()
    modifyMap.removeRoute(model)

    let hereUrl = 'https://places.api.here.com/places/v1/discover/explore?'
    let appId = 'WmIkt7vA4CQCMLSXEmOf'
    let appCode = 'LBj3S0_CED-_JWWO4VvUcg'
    let auth = '&app_id=' + appId + '&app_code=' + appCode
    let pos = 'in=' + model.map.markers[0].lat + ',' + model.map.markers[0].lng + ';r=750'
    let attributes = '&cat=' + model.selected.poi.join(',') + '&tf=plain'

    if (!url) {
      $http.get(hereUrl + pos + attributes + auth)
        .then(response => {
          if (response.data.results.next) that.fetchPoi(model, response.data.results.next)
          modifyMap.addPoi(model, response.data.results.items, response.data.results.next)
        })
    } else {
      $http.get(url)
        .then(response => {
          if (response.data.next) that.fetchPoi(model, response.data.next)
          modifyMap.addPoi(model, response.data.items, response.data.next)
        })
    }
  }

  this.removePoi = function (model) {
    model.map.paths = {}
  }
}])
