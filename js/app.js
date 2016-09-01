/* global angular */

let mario = angular.module('app', ['leaflet-directive', 'angular-loading-bar'])

/* module.config is needed to specify parameters for the loading bar and disable debug logging */
mario.config(['cfpLoadingBarProvider', '$logProvider', function (cfpLoadingBarProvider, $logProvider) {
  cfpLoadingBarProvider.includeSpinner = false
  $logProvider.debugEnabled(false)
}])

mario.controller('Controller',
  ['$scope', 'modifyMap', 'poiService', 'parkingService', 'directRouteService', 'interRouteService', 'simulationService', 'config',
  function ($scope, modifyMap, poiService, parkingService, directRouteService, interRouteService, simulationService, config) {
    /* function initialize gets the config and safes it to the scope
     * some additional data is safed to the scope as well */
    let initialize = function () {
      Object.assign($scope, config)
      $scope.model.map.layers['baselayers'] = $scope.model.map.baselayers
      directRouteService.getInitialInformation($scope.model)
      interRouteService.modelDate($scope.model, new Date())
    }
    initialize()

    /* clicklistener on the layer switches */
    $scope.changeBaselayer = function (layer) {
      modifyMap.changeBaselayer($scope.model, layer)
    }

    /* clicklistener on the POI-Go-Button */
    $scope.getPoi = function () {
      if ($scope.model.map.markers.length > 0) poiService.fetchPoi($scope.model)
    }

    /* selectPoi handles the selection of the poi categories */
    $scope.selectPoi = function (category) {
      poiService.selectPoi($scope.model, category)
    }

    /* clicklistener on the direct-route-Go-Button */
    $scope.calculate = function () {
      if ($scope.model.map.markers.length === 2) directRouteService.fetchDirect($scope.model)
    }

    /* clicklistener on the intermodal-route-Go-Button */
    $scope.calculateIntermodal = function (range) {
      if ($scope.model.map.markers.length === 2) interRouteService.calculateIntermodal($scope.model, range)
    }

    /* selectAlgo handles the selection of the algorithm */
    $scope.selectAlgo = function (algorithm) {
      directRouteService.selectAlgo($scope.model, algorithm)
    }

    /* selectCost handles the selection of the algorithm costs */
    $scope.selectCost = function (cost) {
      directRouteService.selectCost($scope.model, cost)
    }

    /* clicklistener on the update button */
    $scope.updateDate = function () {
      interRouteService.modelDate($scope.model)
    }

    /* clicklistener on the date increase and decrease buttons */
    $scope.changeDate = function (index, direction) {
      interRouteService.changeDate($scope.model, index, direction)
    }

    /* clicklistener on the simulation-Go-Button */
    $scope.requestSimulation = function () {
      simulationService.fetchSimulation($scope.model)
    }

    /* clicklistener on the simulation control buttons */
    $scope.simulationControl = function (command) {
      simulationService.control($scope.model, command)
    }

    /* clicklistener on the simulation control bar */
    $scope.simulationBarClick = function (event) {
      simulationService.jumpTo($scope.model, event)
    }

    /* clicklistener on the remove-elements-Button to delete all elements on the map */
    $scope.removeElements = function () {
      modifyMap.removeMarker($scope.model)
      directRouteService.removeRoute($scope.model)
      poiService.removePoi($scope.model)
      simulationService.removeSimulation($scope.model)
      $scope.model.infoDrop = false
    }

    /* hoverSegment handles the route highlighting */
    $scope.hoverSegment = function (index, flag) {
      $scope.model.selected['hover'] = flag ? index : -1
      modifyMap.highlightSegment($scope.model, index, flag)
    }

    /* clicklistener on the map */
    $scope.$on('leafletDirectiveMap.click', function (event, args) {
      modifyMap.addMarker($scope.model, event, args, false)
    })

    /* draglistener on markers */
    $scope.$on('leafletDirectiveMarker.dragend', function (event, args) {
      modifyMap.addMarker($scope.model, event, args, true)
    })

    /* mouseover on the geoJSON-Layer */
    $scope.$on('leafletDirectiveGeoJson.mouseover', function (event, args) {
      if ($scope.model.usedAlgorithm !== undefined) modifyMap.handleMousOverGeoJson($scope.model, event, args)
    })

    /* mouseout on the geoJSON-Layer */
    $scope.$on('leafletDirectiveGeoJson.mouseout', function (event, args) {
      if (args.target) modifyMap.handleMousOutGeoJson($scope.model, event, args)
    })

    /* whatcher on the marker directory on the scope */
    $scope.$watch('model.map.markers[1]', function (newValue, oldValue) {
      if (oldValue !== newValue && $scope.model.map.markers[1]) poiService.removePoi($scope.model)
    })
  }]
)
