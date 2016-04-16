/* global mario L */

/**
 * all map modification will be in this service
 **/

mario.service('modifyMap', ['leafletData', 'reverseGeocode', function (leafletData, reverseGeocode) {
  this.addMarker = function (scope, event, args, update) {
    if (update) {
      scope.map.markers[args.modelName].lat = args.model.lat
      scope.map.markers[args.modelName].lng = args.model.lng
      reverseGeocode.reverseMarker(scope, args.modelName)
    } else if (scope.map.markers.length < 2) {
      scope.map.markers.push({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
        draggable: true,
        message: scope.map.markers.length === 0 ? 'Start' : 'Ziel',
        focus: true
      })
      reverseGeocode.reverseMarker(scope, scope.map.markers.length - 1)
    }
  }

  this.removeMarker = function (scope) {
    scope.map.markers = []
  }

  this.addRoute = function (scope, geojson) {
    scope.map.geojson = geojson
    this.centerOnRoute(scope)
  }

  this.removeRoute = function (scope) {
    scope.map.geojson = []
  }

  this.centerOnRoute = function (scope) {
    leafletData.getMap().then(function (map) {
      let latlngs = []
      if (scope.map.markers[0]) {
        for (let i in scope.map.markers) {
          let coord = [scope.map.markers[i].lng, scope.map.markers[i].lat]
          latlngs.push(L.GeoJSON.coordsToLatLng(coord))
        }
      }
      if (latlngs[0]) {
        map.fitBounds(latlngs)
      }
    })
  }
}])
