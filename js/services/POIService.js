/* global mario */

mario.service('poiService', [ '$http', 'modifyMap', function ($http, modifyMap) {
  let that = this
  const hereUrl = 'https://places.api.here.com/places/v1/discover/explore?'
  const App_Id = 'WmIkt7vA4CQCMLSXEmOf'
  const App_Code = 'LBj3S0_CED-_JWWO4VvUcg'

  this.selectPoi = function (model, category) {
    model.selected.poi = model.selected.poi.filter(i => i !== 'parking')
    if (model.selected.poi.indexOf(category) === -1) model.selected.poi.push(category)
    else model.selected.poi.splice(model.selected.poi.indexOf(category), 1)
  }

  this.fetchPoi = function (model, url) {
    if (model.map.markers.length === 2) model.map.markers.shift()
    modifyMap.removeRoute(model)

    if (!url) {
      let attributes = 'in=' + model.map.markers[0].lat + ',' + model.map.markers[0].lng + ';r=750&cat=' + model.selected.poi.join(',') + '&tf=plain&app_id=' + App_Id + '&app_code=' + App_Code
      $http.get(hereUrl + attributes)
        .then(function (response) {
          if (response.data.results.next) that.fetchPoi(model, response.data.results.next)
          modifyMap.addPoi(model, response.data.results.items, response.data.results.next)
        })
    } else {
      $http.get(url).then(function (response) {
        if (response.data.next) that.fetchPoi(model, response.data.next)
        modifyMap.addPoi(model, response.data.items, response.data.next)
      })
    }
  }

  this.removePoi = function (model) {
    model.map.paths = {}
  }
}])
