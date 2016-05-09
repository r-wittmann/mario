/* global mario L */

/**
 * all map modification will be in this service
 **/

mario.service('modifyMap', ['leafletData', 'reverseGeocode', function (leafletData, reverseGeocode) {
  let that = this

  this.changeBaselayer = function (model, layer) {
    model.map.layers.baselayers = {}
    model.map.layers.baselayers[layer] = model.map.baselayers[layer]
  }

  this.addMarker = function (model, event, args, update) {
    if (update) {
      model.map.markers[args.modelName].lat = args.model.lat
      model.map.markers[args.modelName].lng = args.model.lng
      reverseGeocode.reverseMarker(model, args.modelName)
      that.removeRoute(model)
    } else if (model.map.markers.length < 2) {
      model.map.markers.push({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
        draggable: true,
        focus: true
      })
      reverseGeocode.reverseMarker(model, model.map.markers.length - 1)
    }
  }

  this.removeMarker = function (model) {
    model.map.markers = []
  }

  this.addPoi = function (model, items, next) {
    items.map((item) => {
      model.map.paths[item.id.replace('-', '')] = {
        type: 'circleMarker',
        radius: 4,
        color: '#262826',
        opacity: 1,
        weight: 2,
        fillColor: '#68c631',
        fillOpacity: 1,
        message: ('<b>' + item.title + '</b><br/>' + item.category.title + '<br/>' + item.vicinity),
        latlngs: {
          lat: item.position[0],
          lng: item.position[1]
        }
      }
    })
    if (!items[0]) return
    else if (!next) that.centerOnRoute(model)
  }

  this.addRoute = function (model, geojson, interFlag) {
    interFlag
    ? this.addInterRouteProperties(model, geojson)
    : model.map.geojson = geojson
    that.centerOnRoute(model)
  }

  this.addInterRouteProperties = function (model, geojson) {
    leafletData.getMap().then(function (map) {
      L.geoJson(geojson.data, {
        style: function (feature) {
          switch (feature.properties.mode) {
            case 'PUBLIC': return {color: '#ff0000'}
            default: return {color: '#0000ff'}
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
    model.usedAlgorithm = undefined
  }

  this.centerOnRoute = function (model) {
    leafletData.getMap().then(function (map) {
      let latlngs = []

      for (let i in model.map.markers) {
        let coord = [model.map.markers[i].lng, model.map.markers[i].lat]
        latlngs.push(L.GeoJSON.coordsToLatLng(coord))
      }

      for (let j in model.map.paths) {
        let coord = [model.map.paths[j].latlngs.lng, model.map.paths[j].latlngs.lat]
        latlngs.push(L.GeoJSON.coordsToLatLng(coord))
      }

      if (model.map.geojson.data) {
        for (let k in model.map.geojson.data.features) {
          for (let l in model.map.geojson.data.features[k].geometry.coordinates) {
            let coord = [model.map.geojson.data.features[k].geometry.coordinates[l][0], model.map.geojson.data.features[k].geometry.coordinates[l][1]]
            latlngs.push(L.GeoJSON.coordsToLatLng(coord))
          }
        }
      }

      if (latlngs[0]) {
        map.fitBounds(latlngs, {paddingTopLeft: [20, 20], paddingBottomRight: [100, 20]})
      }
    })
  }
}])
