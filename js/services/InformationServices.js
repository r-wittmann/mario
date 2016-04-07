/* global mario*/

mario.service('addToScope', function () {
  this.addAddress = function ($scope, index, data) {
    $scope.route.startEndPoint[index] = {
      street: data.road,
      streetNumber: data.house_number,
      postalCode: data.postcode,
      city: data.city
    }
  }
})
