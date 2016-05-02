/* global mario */

/**
 * all constants are declared in config-service
 **/

mario.service('config', function () {
  this.config = {
    model: {
      map: {
        center: {
          lat: 48.137,
          lng: 11.575,
          zoom: 12
        },
        defaults: {
          maxZoom: 18,
          minZoom: 5
        },
        geojson: [],
        markers: []
      },
      selected: {
        algorithm: '',
        cost: '',
        poi: {
          poi: true,
          parking: false
        }
      }
    }
  }
})
