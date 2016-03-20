var app = angular.module('app', ['leaflet-directive'])
app.controller('MapCtrl', [ '$scope', function ($scope) {
  angular.extend($scope, {
    london: {
      lat: 51.505,
      lng: -0.09,
      zoom: 4
    }
  })
}])
app.controller('ControlCtrl', [ function () {
  console.log('ControlCtrl')
}])
