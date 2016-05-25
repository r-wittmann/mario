/* global angular */

let mario = angular.module('app', ['leaflet-directive', 'angular-loading-bar'])

mario.controller('Controller',
  ['$scope', 'modifyMap', 'poiService', 'parkingService', 'directRouteService', 'interRouteService', 'config',
  function ($scope, modifyMap, poiService, parkingService, directRouteService, interRouteService, config) {
    let initialize = function () {
      angular.extend($scope, config)
      $scope.model.map.layers.baselayers = $scope.model.map.baselayers
      directRouteService.getInitialInformation($scope.model)
      interRouteService.modelDate($scope.model, new Date())
    }

    initialize()

    $scope.changeBaselayer = function (layer) {
      modifyMap.changeBaselayer($scope.model, layer)
    }

    $scope.getPoi = function () {
      if ($scope.model.map.markers.length > 0) poiService.fetchPoi($scope.model)
    }

    $scope.selectPoi = function (category) {
      category === 'parking'
      ? parkingService.selectParking($scope.model)
      : poiService.selectPoi($scope.model, category)
    }

    $scope.calculate = function () {
      if ($scope.model.map.markers.length > 1) directRouteService.calculateRoute($scope.model)
    }

    $scope.calculateIntermodal = function (range) {
      if ($scope.model.map.markers.length > 1) interRouteService.calculateIntermodal($scope.model, range)
    }

    $scope.selectAlgo = function (algorithm) {
      directRouteService.selectAlgo($scope.model, algorithm)
    }

    $scope.selectCost = function (cost) {
      directRouteService.selectCost($scope.model, cost)
    }

    $scope.updateDate = function () {
      interRouteService.modelDate($scope.model)
    }

    $scope.changeDate = function (index, direction) {
      interRouteService.changeDate($scope.model, index, direction)
    }

    $scope.removeElements = function () {
      modifyMap.removeMarker($scope.model)
      modifyMap.removeRoute($scope.model)
      poiService.removePoi($scope.model)
      $scope.model.usedAlgorithm = undefined
      $scope.model.infoDrop = false
      $scope.model.map.routeInfo = undefined
    }

    $scope.hoverSegment = function (index, flag) {
      $scope.model.selected.hover = flag ? index : -1
      modifyMap.highlightSegment($scope.model, index, flag)
    }

    $scope.$on('leafletDirectiveMap.click', function (event, args) {
      modifyMap.addMarker($scope.model, event, args, false)
    })

    $scope.$on('leafletDirectiveMarker.dragend', function (event, args) {
      modifyMap.addMarker($scope.model, event, args, true)
    })

    $scope.$on('leafletDirectiveGeoJson.mouseover', function (event, args) {
      modifyMap.handleMousOverGeoJson($scope.model, event, args)
    })

    $scope.$on('leafletDirectiveGeoJson.mouseout', function (event, args) {
      if (args.target) {
        modifyMap.handleMousOutGeoJson($scope.model, event, args)
      }
    })

    $scope.$watch('model.map.markers[1]', function (newValue, oldValue) {
      if (oldValue !== newValue && $scope.model.map.markers[1]) {
        poiService.removePoi($scope.model)
      }
    })
  }]
)
