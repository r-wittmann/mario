/* global mario*/

mario.service('addToScope', function () {
  this.addAddress = function ($scope, index, data) {
    console.log(index, data)
  }
})
