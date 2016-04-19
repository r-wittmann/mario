/* global mario L */

/**
 * all map modification will be in this service
 **/

mario.service('modifyMap', ['leafletData', 'reverseGeocode', function (leafletData, reverseGeocode) {
  this.addMarker = function (model, event, args, update) {
    if (update) {
      model.map.markers[args.modelName].lat = args.model.lat
      model.map.markers[args.modelName].lng = args.model.lng
      reverseGeocode.reverseMarker(model, args.modelName)
    } else if (model.map.markers.length < 2) {
      model.map.markers.push({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
        draggable: true,
        message: model.map.markers.length === 0 ? 'Start' : 'Ziel',
        focus: true
      })
      reverseGeocode.reverseMarker(model, model.map.markers.length - 1)
    }
  }

  this.removeMarker = function (model) {
    model.map.markers = []
  }

  this.addRoute = function (model, geojson) {
    model.map.geojson = geojson
    this.centerOnRoute(model)
  }

  this.removeRoute = function (model) {
    model.map.geojson = []
  }

  this.centerOnRoute = function (model) {
    leafletData.getMap().then(function (map) {
      let latlngs = []
      if (model.map.markers[0]) {
        for (let i in model.map.markers) {
          let coord = [model.map.markers[i].lng, model.map.markers[i].lat]
          latlngs.push(L.GeoJSON.coordsToLatLng(coord))
        }
      }
      if (latlngs[0]) {
        map.fitBounds(latlngs)
      }
    })
  }
}])
