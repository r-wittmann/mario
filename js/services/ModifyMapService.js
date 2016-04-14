/* global mario L */

/**
 * all map modification will be in this service
 **/

mario.service('modifyMap', ['leafletData', 'reverseGeocode', function (leafletData, reverseGeocode) {
  this.addMarker = function (scope, event, args, update) {
    if (update) {
      scope.markers[args.modelName].lat = args.model.lat
      scope.markers[args.modelName].lng = args.model.lng
      reverseGeocode.reverseMarker(scope, args.modelName)
    } else if (scope.markers.length < 2) {
      scope.markers.push({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
        draggable: true,
        message: scope.markers.length === 0 ? 'Start' : 'Ziel',
        focus: true
      })
      reverseGeocode.reverseMarker(scope, scope.markers.length - 1)
    }
  }

  this.removeMarker = function (scope) {
    scope.markers = []
  }

  this.addRoute = function (scope, geojson) {
    scope.geojson = geojson
    this.centerOnRoute(scope)
  }

  this.removeRoute = function (scope) {
    scope.geojson = []
  }

  this.centerOnRoute = function (scope) {
    leafletData.getMap().then(function (map) {
      let latlngs = []
      if (scope.markers[0]) {
        for (let i in scope.markers) {
          let coord = [scope.markers[i].lng, scope.markers[i].lat]
          latlngs.push(L.GeoJSON.coordsToLatLng(coord))
        }
      }
      if (latlngs[0]) {
        map.fitBounds(latlngs)
      }
    })
  }
}])
