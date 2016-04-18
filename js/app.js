/* global angular */

let mario = angular.module('app', ['leaflet-directive'])

/**
 * main controller of mario app
 **/

mario.controller('Ctrl',
  ['$scope', 'modifyMap', 'handleServerRequest', 'config',
  function ($scope, modifyMap, handleServerRequest, config) {
    let initialize = function () {
      angular.extend($scope, config.config)
      handleServerRequest.getInitialInformation($scope)
    }

    initialize()

    $scope.calculate = function () {
      if ($scope.map.markers.length > 1) handleServerRequest.calculateRoute($scope)
      else console.log('markers missing')
    }

    $scope.updateTime = function () {
      let d = new Date()
      $scope.date = {
        day: d.getDate(),
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        hour: d.getHours(),
        minute: d.getMinutes()
      }
    }

    $scope.calculateIntermodal = function () {
      if ($scope.map.markers.length > 1) handleServerRequest.calculateIntermodal($scope)
      else console.log('markers missing')
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

    $scope.$watch('map.markers[0].lat', function (newValue, oldValue) {
      if (oldValue !== newValue && $scope.map.markers[1]) handleServerRequest.calculateRoute($scope)
    })

    $scope.$watch('map.markers[1].lat', function (newValue, oldValue) {
      if (oldValue !== newValue && $scope.map.markers[1]) handleServerRequest.calculateRoute($scope)
    })
  }]
)
