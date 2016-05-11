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
        layers: {
          baselayers: {}
        },
        baselayers: {
          map: {
            name: 'Map',
            url: 'http://{s}.{base}.maps.api.here.com/maptile/2.1/{type}/{mapID}/{scheme}/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}',
            type: 'xyz',
            layerOptions: {
              attribution: 'Map &copy; 2016 <a href="http://developer.here.com">HERE</a>',
              subdomains: '1234',
              base: 'base',
              type: 'maptile',
              scheme: 'normal.day',
              app_id: 'WmIkt7vA4CQCMLSXEmOf',
              app_code: 'LBj3S0_CED-_JWWO4VvUcg',
              mapID: 'newest',
              maxZoom: 18,
              language: 'eng',
              format: 'png8',
              size: '256',
              showOnSelector: false
            }
          },
          satellite: {
            name: 'Satellite',
            url: 'http://{s}.{base}.maps.api.here.com/maptile/2.1/{type}/{mapID}/{scheme}/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}',
            type: 'xyz',
            layerOptions: {
              attribution: 'Map &copy; 2016 <a href="http://developer.here.com">HERE</a>',
              subdomains: '1234',
              base: 'aerial',
              type: 'maptile',
              scheme: 'hybrid.day',
              app_id: 'WmIkt7vA4CQCMLSXEmOf',
              app_code: 'LBj3S0_CED-_JWWO4VvUcg',
              mapID: 'newest',
              maxZoom: 18,
              language: 'eng',
              format: 'png8',
              size: '256',
              showOnSelector: false
            }
          }
        },
        geojson: [],
        markers: [],
        paths: {}
      },
      poi: {
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
