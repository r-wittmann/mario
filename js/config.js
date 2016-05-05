/* global mario */

/**
 * all constants are declared in config-service
 **/

mario.factory('config', function () {
  return {
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
        markers: [],
        paths: {}
      },
      poi: {
        'parking': 'Parking',
        'eat-drink': 'Eat & Drink',
        'going-out': 'Going Out',
        'sights-museums': 'Sights & Museums',
        'transport': 'Transportation',
        'shopping': 'Shopping',
        'leisure-outdoor': 'Leisure & Outdoor',
        'accommodation,administrative-areas-buildings,natural-geographical,petrol-station,atm-bank-exchange,toilet-rest-area,hospital-health-care-facility': 'Other'
      },
      selected: {
        algorithm: '',
        cost: '',
        poi: []
      }
    }
  }
})
