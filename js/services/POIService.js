/* global mario */

mario.service('poiService', [ '$http', 'modifyMap', function ($http, modifyMap) {
  let that = this

  /* handles the selection of poi categories */
  this.selectPoi = function (model, category) {
    if (model.selected.poi.indexOf(category) === -1) model.selected.poi.push(category)
    else model.selected.poi.splice(model.selected.poi.indexOf(category), 1)
  }

  /* build the request Json, request pois from HERE-API and handle response*/
  this.fetchPoi = function (model, url) {
    if (model.map.markers.length === 2) model.map.markers.shift()
    model.map.geojson = []
    model.map.routeInfo = undefined
    model.usedAlgorithm = undefined

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
          that.addPoi(model, response.data.results.items, response.data.results.next)
        })
    } else {
      $http.get(url)
        .then(response => {
          if (response.data.next) that.fetchPoi(model, response.data.next)
          that.addPoi(model, response.data.items, response.data.next)
        })
    }
  }

  /* add POIs to the map */
  this.addPoi = function (model, items, next) {
    items.map(item => {
      model.map.paths.push({
        type: 'circleMarker',
        radius: 4,
        color: '#262826',
        opacity: 1,
        weight: 2,
        fillColor: '#68c631',
        fillOpacity: 1,
        message: ('<b>' + item.title + '</b><br/>' + item.category.title + '<br/>' + item.vicinity),
        latlngs: {
          lat: item.position[0],
          lng: item.position[1]
        }
      })
    })
    if (!items[0]) return
    else if (!next) modifyMap.centerOnRoute(model)
  }

  /* remove POIs from the map */
  this.removePoi = function (model) {
    model.map.paths = []
  }
}])
