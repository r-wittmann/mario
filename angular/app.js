var app = angular.module('app', ['leaflet-directive'])
app.controller('MapCtrl', [ '$scope', function ($scope) {
  angular.extend($scope, {
    center: {
      lat: 48.137,
      lng: 11.575,
      zoom: 12
    }
  })
}])
app.controller('ControlCtrl', [ function () {
  console.log('ControlCtrl')
}])
