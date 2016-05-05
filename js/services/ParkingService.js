/* global mario */

mario.service('parkingService', [ '$http', 'modifyMap', function ($http, modifyMap) {
  this.selectParking = function (model) {
    model.selected.poi = ['parking']
    /* not implemented yet */
  }
}])
