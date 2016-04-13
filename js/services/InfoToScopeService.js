/* global angular mario */

mario.service('addToScope', function () {
  this.addAddress = function ($scope, index, data) {
    angular.extend($scope.markers[index], {
      street: `${data.road ? data.road : data.cycleway}`,
      streetNumber: data.house_number,
      postalCode: data.postcode,
      city: `${data.city ? data.city : data.town ? data.town : data.village ? data.village : data.state}`
    })
  }
})
