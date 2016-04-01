/* global angular */

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
