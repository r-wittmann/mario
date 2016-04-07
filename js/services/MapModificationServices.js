/* global angular mario L */

/**
 * all map modification will be in this service
 **/

mario.service('modifyMap', ['leafletData', function (leafletData) {
  this.addMarker = function ($scope, event, args) {
    if ($scope.markers.length < 2) {
      $scope.markers.push({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
        draggable: false,
        message: $scope.markers.length === 0 ? 'Start' : 'Ziel',
        focus: true
      })
    }
  }

  this.removeMarker = function ($scope) {
    $scope.markers = []
  }

  this.addRoute = function ($scope, data) {
    angular.extend($scope, {
      geojson: {
        data: data
      }
    })
  }

  this.removeRoute = function ($scope) {
    $scope.geojson = []
  }

  this.centerOnRoute = function ($scope) {
    leafletData.getMap().then(function (map) {
      let latlngs = []
      if ($scope.geojson.data) {
        for (let i in $scope.geojson.data.features) {
          for (let j in $scope.geojson.data.features[i].geometry.coordinates) {
            let coord = $scope.geojson.data.features[i].geometry.coordinates[j]
            latlngs.push(L.GeoJSON.coordsToLatLng(coord))
          }
        }
      }
      if ($scope.markers[0]) {
        for (let i in $scope.markers) {
          let coord = [$scope.markers[i].lng, $scope.markers[i].lat]
          latlngs.push(L.GeoJSON.coordsToLatLng(coord))
        }
      }
      if (latlngs[0]) {
        map.fitBounds(latlngs)
      }
    })
  }
}])
