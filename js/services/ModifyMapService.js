/* global mario L */

/**
 * all map modification will be in this service
 **/

mario.service('modifyMap', ['leafletData', 'reverseGeocode', function (leafletData, reverseGeocode) {
  this.addMarker = function (model, event, args, update) {
    if (update) {
      model.map.markers[args.modelName].lat = args.model.lat
      model.map.markers[args.modelName].lng = args.model.lng
      reverseGeocode.reverseMarker(model, args.modelName)
    } else if (model.map.markers.length < 2) {
      model.map.markers.push({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
        draggable: true,
        message: model.map.markers.length === 0 ? 'Start' : 'Ziel',
        focus: true
      })
      reverseGeocode.reverseMarker(model, model.map.markers.length - 1)
    }
  }

  this.removeMarker = function (model) {
    model.map.markers = []
  }

  this.addRoute = function (model, geojson, interFlag) {
    interFlag
    ? this.addInterRouteProperties(model, geojson)
    : model.map.geojson = geojson
    this.centerOnRoute(model)
  }

  this.addInterRouteProperties = function (model, geojson) {
    leafletData.getMap().then(function (map) {
      L.geoJson(geojson.data, {
        style: function (feature) {
          switch (feature.properties.mode) {
            case 'STREET': return {color: '#0000ff'}
            case 'PUBLIC': return {color: '#ff0000'}
            case 'ONTOPUBLIC': return {color: '#0000ff'}
            case 'OFFPUBLIC': return {color: '#0000ff'}
          }
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(feature.properties.instructions)
        }
      }).addTo(map)
    })
  }

  this.removeRoute = function (model) {
    model.map.geojson = []
  }

  this.addPoi = function (model, items) {
    items.map((item) => {
      model.map.paths[item.id.replace('-', '')] = {
        type: 'circleMarker',
        radius: 4,
        color: '#262826',
        opacity: 1,
        weight: 2,
        fillColor: '#FAFAFA',
        fillOpacity: 1,
        message: ('<b>' + item.title + '</b><br/>' + item.category.title + '<br/>' + item.vicinity),
        latlngs: {
          lat: item.position[0],
          lng: item.position[1]
        }
      }
    })
  }

  this.removePoi = function (model) {
    model.map.paths = {}
  }

  this.centerOnRoute = function (model) {
    leafletData.getMap().then(function (map) {
      let latlngs = []
      if (model.map.markers[0]) {
        for (let i in model.map.markers) {
          let coord = [model.map.markers[i].lng, model.map.markers[i].lat]
          latlngs.push(L.GeoJSON.coordsToLatLng(coord))
        }
      }
      if (latlngs[0]) {
        map.fitBounds(latlngs)
      }
    })
  }
}])
