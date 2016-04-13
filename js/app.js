/* global angular */

let mario = angular.module('app', ['leaflet-directive'])

/**
 * main controller of mario app
 **/

mario.controller('Ctrl',
  ['$scope', 'leafletMapEvents', 'modifyMap', 'handleServerRequest', 'reverseGeocode', 'config',
  function ($scope, leafletMapEvents, modifyMap, handleServerRequest, reverseGeocode, config) {
    let initialize = function () {
      angular.extend($scope, config.map)
      handleServerRequest.getInitialInformation($scope)
    }

    initialize()

    $scope.getTestData = function () {
      handleServerRequest.getMock($scope)
    }

    $scope.removeElements = function () {
      modifyMap.removeMarker($scope)
      modifyMap.removeRoute($scope)
    }

    $scope.$on('leafletDirectiveMap.click', function (event, args) {
      modifyMap.addMarker($scope, event, args, false)
    })

    $scope.$on('leafletDirectiveMarker.dragend', function (event, args) {
      modifyMap.addMarker($scope, event, args, true)
    })

    $scope.$watch('markers[0].lat', function (newValue, oldValue) {
      if (oldValue !== newValue && $scope.markers[1]) handleServerRequest.calculateMockRoute($scope)
    })

    $scope.$watch('markers[1].lat', function (newValue, oldValue) {
      if (oldValue !== newValue && $scope.markers[1]) handleServerRequest.calculateMockRoute($scope)
    })
  }]
)
