/* global mario L */

mario.service('modifyMap', ['leafletData', 'reverseGeocode', function (leafletData, reverseGeocode) {
  let that = this

  this.changeBaselayer = function (model, layer) {
    model.map.layers.baselayers = {}
    model.map.layers.baselayers[layer] = model.map.baselayers[layer]
  }

  this.addMarker = function (model, event, args, update) {
    let markers = model.map.markers

    if (update) {
      markers[args.modelName].lat = args.model.lat
      markers[args.modelName].lng = args.model.lng
      reverseGeocode.reverseMarker(model, args.modelName)
      that.removeRoute(model)
    } else if (markers.length < 2) {
      markers.push({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
        draggable: true,
        focus: true
      })
      reverseGeocode.reverseMarker(model, markers.length - 1)
    }
  }

  this.removeMarker = function (model) {
    model.map.markers = []
  }

  this.addPoi = function (model, items, next) {
    items.map(item => {
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

  this.addDirectRoute = function (model, geojson) {
    geojson.data.features[0].properties['instructions'] = [model.map.markers[0].formattedAddress[0], model.map.markers[1].formattedAddress[0]]
    geojson.data.features[0].properties['index'] = 0
    model.map.geojson = geojson
    model.map.geojson['style'] = {
      opacity: 1
    }

    model.map['routeInfo'] = geojson.data.features[0].properties['costs']
    that.centerOnRoute(model)
  }

  this.addInterRoute = function (model, geojson) {
    for (let i = 0; i < geojson.data.features.length; i++) {
      geojson.data.features[i].properties['index'] = i
    }
    geojson.data.features[0].properties.instructions[0] = model.map.markers[0].formattedAddress[0]
    geojson.data.features[geojson.data.features.length - 2].properties.instructions[1] = model.map.markers[1].formattedAddress[0]
    model.map.geojson = geojson
    model.map.geojson['style'] = {
      opacity: 1
    }

    model.map['routeInfo'] = geojson.data.features.pop().properties['routeInfo']
    that.centerOnRoute(model)
    reverseGeocode.reverseInstructions(model)
  }

  this.removeRoute = function (model) {
    model.map.geojson = []
    model.usedAlgorithm = undefined
  }

  this.handleMousOverGeoJson = function (model, event, args) {
    let index = args.leafletEvent.target.feature.properties.index
    let instructions = model.map.geojson.data.features[index].properties.instructions

    let popupContent = ''
    if (instructions[2] !== 'NULL' && instructions[2]) {
      popupContent = 'Take <b>' + instructions[2] + '</b> from<br/><b>' + instructions[0] + '</b> to<br/><b>' + instructions[1] + '</b>'
    } else popupContent = 'Drive or walk from<br/><b>' + instructions[0] + '</b> to<br/><b>' + instructions[1] + '</b>'

    args.leafletEvent.target.setStyle({color: '#68c631'}).bringToFront().bindPopup(popupContent)
    model.selected.hover = index
  }

  this.handleMousOutGeoJson = function (model, event, args) {
    args.target.setStyle({color: '#0033ff'})
    model.selected.hover = -1
  }

  this.highlightSegment = function (model, index, inFlag) {
    leafletData.getMap()
      .then(map => {
        let i = 0
        for (let j in map._layers) {
          if (i === 4) {
            for (let k in map._layers[j]._layers) {
              if (map._layers[j]._layers[k].feature.properties.index === index) map._layers[j]._layers[k].setStyle(inFlag ? {color: '#68c631'} : {color: '#0033ff'}).bringToFront()
            }
          }
          i++
        }
      })
  }

  this.centerOnRoute = function (model) {
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

    leafletData.getMap()
      .then(map => {
        if (latlngs[0]) {
          map.fitBounds(latlngs, {paddingTopLeft: [20, 20], paddingBottomRight: [250, 20]})
        }
      })
  }
}])
