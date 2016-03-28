/* global angular */
var app = angular.module('app', ['leaflet-directive'])

app.controller('Ctrl', [ '$scope', function ($scope) {
  angular.extend($scope, {
    center: {
      lat: 48.137,
      lng: 11.575,
      zoom: 12
    },
    defaults: {
      maxZoom: 20,
      minZoom: 6
    }
  })

  $scope.btnClick = function () {
    angular.extend($scope, {
      center: {
        lat: 48.137,
        lng: 11.575,
        zoom: 12
      }
    })
  }
}])
