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
      minZoom: 6
    }
  })

  $scope.$on('leafletDirectiveMap.click', function (event) {
    console.log('click')
  })

  $scope.getTestData = function () {
    getTestData()
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
