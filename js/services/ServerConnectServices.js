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
