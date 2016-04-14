/* global angular mario*/

/**
 * all requests to the server will be handled here
 **/

mario.service('handleServerRequest', ['$http', 'handleServerResponse', function ($http, handleServerResponse) {
  this.getInitialInformation = function ($scope) {
    $http.get('mocks/algorithms.json').then(function (response) {
      handleServerResponse.mockAlgorithms($scope, response)
    })
  }

  this.calculateRoute = function ($scope) {
    console.log('called calculateRoute($scope), not implemented yet')
    console.log('start:', $scope.markers[0], '\ntarget:', $scope.markers[1])
    console.log('selected algorithm:', $scope.selected.algorithm, '\nselected cost:', $scope.selected.cost)
    /*
    let startTarget = {
      'start': {
        'lat': $scope.markers[0].lat,
        'lon': $scope.markers[0].lng
      },
      'target': {
        'lat': $scope.markers[1].lat,
        'lon': $scope.markers[1].lng
      },
      'algo': $scope.selected.algorithm
      'cost': $scope.selected.cost
    }
    angular.toJson(startTarget)
    $http.get('http://129.187.228.18:8080/restservices_path/webresources/easyev?', startTarget)
    */
  }
}])

/**
 * all responses from the server will be handled here
 **/

mario.service('handleServerResponse', [ function () {
  this.mockAlgorithms = function ($scope, response) {
    angular.extend($scope, response.data)
    $scope.selected = {
      'algorithm': response.data.algorithms[0],
      'cost': response.data.algorithmCosts[0]
    }
  }
}])
