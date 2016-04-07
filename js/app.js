/* global angular */

let mario = angular.module('app', ['leaflet-directive'])

/**
 * main controller of mario app
 **/

mario.controller('Ctrl',
  ['$scope', 'leafletMapEvents', 'modifyMap', 'handleServerRequest', 'reverseGeocode', 'config',
  function ($scope, leafletMapEvents, modifyMap, handleServerRequest, reverseGeocode, config) {
    angular.extend($scope, config.map)

    $scope.getTestData = function () {
      handleServerRequest.getMock($scope)
    }

    $scope.calculateRoute = function () {
      handleServerRequest.calculateMockRoute($scope)
    }

    $scope.removeElements = function () {
      modifyMap.removeMarker($scope)
      modifyMap.removeRoute($scope)
    }

    $scope.$on('leafletDirectiveMap.click', function (event, args) {
      modifyMap.addMarker($scope, event, args)
    })

    $scope.$watch('markers[0]', function (newValue, oldValue) {
      if (oldValue !== newValue && $scope.markers[0]) reverseGeocode.reverseMarker($scope, 0)
    })
    $scope.$watch('markers[1]', function (newValue, oldValue) {
      if (oldValue !== newValue && $scope.markers[1]) reverseGeocode.reverseMarker($scope, 1)
    })
  }]
)
