/* global angular */

let mario = angular.module('app', ['leaflet-directive'])

/**
 * main controller of mario app
 **/

mario.controller('Controller',
  ['$scope', 'modifyMap', 'handleServerRequest', 'dateTime', 'poiService', 'directRouteService', 'config',
  function ($scope, modifyMap, handleServerRequest, dateTime, poiService, directRouteService, config) {
    let initialize = function () {
      angular.extend($scope, config.config)
      directRouteService.getInitialInformation($scope.model)
      dateTime.modelDate($scope.model, new Date())
    }

    initialize()

    $scope.getPoi = function () {
      if ($scope.model.map.markers.length > 0) poiService.fetchPoi($scope.model)
    }

    $scope.calculate = function () {
      if ($scope.model.map.markers.length > 1) directRouteService.calculateRoute($scope.model)
    }

    $scope.calculateIntermodal = function () {
      if ($scope.model.map.markers.length > 1) handleServerRequest.calculateIntermodal($scope.model)
    }

    $scope.selectAlgo = function (algorithm) {
      directRouteService.selectAlgo($scope.model, algorithm)
    }

    $scope.selectCost = function (cost) {
      directRouteService.selectCost($scope.model, cost)
    }

    $scope.updateDate = function () {
      dateTime.updateDate($scope.model)
    }

    $scope.changeDate = function (index, direction) {
      dateTime.changeDate($scope.model, index, direction)
    }

    $scope.removeElements = function () {
      modifyMap.removeMarker($scope.model)
      modifyMap.removeRoute($scope.model)
      poiService.removePoi($scope.model)
      $scope.model.usedAlgorithm = undefined
      $scope.model.infoDrop = false
    }

    $scope.$on('leafletDirectiveMap.click', function (event, args) {
      modifyMap.addMarker($scope.model, event, args, false)
    })

    $scope.$on('leafletDirectiveMarker.dragend', function (event, args) {
      modifyMap.addMarker($scope.model, event, args, true)
    })
  }]
)
