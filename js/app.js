/* global
    angular
    L
*/
let mario = angular.module('app', ['leaflet-directive'])

/**
 * main controller of mario app
 **/

mario.controller('Ctrl',
  ['$scope', 'leafletMapEvents', 'modifyMap', 'handleServerRequest', 'config',
  function ($scope, leafletMapEvents, modifyMap, handleServerRequest, config) {
    angular.extend($scope, config.map)

    $scope.getTestData = function () {
      handleServerRequest.getMock($scope)
    }

    $scope.centerOnRoute = function () {
      modifyMap.centerOnRoute($scope)
    }

    $scope.removeElements = function () {
      modifyMap.removeMarker($scope)
      modifyMap.removeRoute($scope)
    }

    $scope.$on('leafletDirectiveMap.click', function (event, args) {
      modifyMap.addMarker($scope, event, args)
    })
  }]
)

/**
 * all map modification will be in this service
 **/

mario.service('modifyMap', ['leafletData', function (leafletData) {
  this.addMarker = function ($scope, event, args) {
    if ($scope.markers.length < 2) {
      $scope.markers.push({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
        draggable: true,
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
      for (let i in $scope.geojson.data.features) {
        for (let j in $scope.geojson.data.features[i].geometry.coordinates) {
          let coord = $scope.geojson.data.features[i].geometry.coordinates[j]
          latlngs.push(L.GeoJSON.coordsToLatLng(coord))
        }
      }
      map.fitBounds(latlngs)
    })
  }
}])

/**
 * all requests to the server will be handled here
 **/

mario.service('handleServerRequest', ['$http', 'handleServerResponse', function ($http, handleServerResponse) {
  this.getMock = function ($scope) {
    $http.get('mocks/geoJsonMock.geo.json').then(function (response) {
      handleServerResponse.mockResponse($scope, response)
    })
  }
}])

/**
 * all responses from the server will be handled here
 **/

mario.service('handleServerResponse', function () {
  this.mockResponse = function ($scope, response) {
    angular.extend($scope, {
      geojson: {
        data: response.data
      }
    })
  }
})

/**
 * all constants are declared in config-service
 **/

mario.service('config', function () {
  this.map = {
    center: {
      lat: 48.137,
      lng: 11.575,
      zoom: 12
    },
    defaults: {
      maxZoom: 15,
      minZoom: 5
    },
    geojson: [],
    markers: []
  }
})
