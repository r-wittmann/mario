/* global mario */

/**
 * all constants are declared in config-service
 **/

mario.service('config', function () {
  let d = new Date()
  this.config = {
    map: {
      center: {
        lat: 48.137,
        lng: 11.575,
        zoom: 12
      },
      defaults: {
        maxZoom: 15,
        minZoom: 5
      },
      geojson: [],
      markers: []
    },
    date: {
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      hour: d.getHours(),
      minute: d.getMinutes()
    }
  }
})
