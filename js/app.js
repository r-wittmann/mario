/* global
    angular
    L
*/
let app = angular.module('app', ['leaflet-directive'])

app.controller('Ctrl', [ '$scope', '$http', 'leafletData', 'leafletMapEvents', function ($scope, $http, leafletData, leafletMapEvents) {
  angular.extend($scope, {
    center: {
      lat: 48.137,
      lng: 11.575,
      zoom: 12
    },
    defaults: {
      maxZoom: 20,
      minZoom: 0
    }
  })

  $scope.geojson = []
  $scope.markers = []

  $scope.$on('leafletDirectiveMap.click', function (event, args) {
    if ($scope.markers.length < 2) {
      $scope.markers.push({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
        draggable: true,
        message: $scope.markers.length === 0 ? 'Start' : 'Ziel',
        focus: true
      })
    }
  })

  $scope.getTestData = function () {
    getTestData()
  }

  $scope.calculateRoute = function () {
    angular.extend($scope, {
      geojson: {
        data: {
          'type': 'FeatureCollection',
          'features': [{
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                [$scope.markers[0].lng, $scope.markers[0].lat],
                [$scope.markers[1].lng, $scope.markers[1].lat]]
            }
          }
        ]}
      }
    })
  }

  $scope.centerOnRoute = function () {
    leafletData.getMap().then(function (map) {
      if ($scope.geojson) {
        let latlngs = []
        for (let i in $scope.geojson.data.features) {
          for (let j in $scope.geojson.data.features[i].geometry.coordinates) {
            let coord = $scope.geojson.data.features[i].geometry.coordinates[j]
            latlngs.push(L.GeoJSON.coordsToLatLng(coord))
          }
        }
        map.fitBounds(latlngs)
      }
    })
  }

  $scope.removeRoute = function () {
    if ($scope.geojson) {
      delete $scope.geojson
    }
    $scope.markers = []
  }

  function getTestData () {
    $http.get('/mocks/geoJsonMock.geo.json').then(function (response) {
      angular.extend($scope, {
        geojson: {
          data: response.data
        }
      })
    })
  }
}])
