import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import statusColors from 'massbuilds/utils/status-colors';
import pointInPolygon from 'npm:@turf/boolean-point-in-polygon';
import centerOfMass from 'npm:@turf/center-of-mass';

import paintProperties from 'massbuilds/utils/paint-properties';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';




export default class extends Component {

  @service store
  @service map

  constructor() {
    super();
    this.previousCoordinatesKey = null;
    this.previousParcel = null;
    this.lastRequest = null;
    this.focusTargetBounds = null;
  }

  getLeftPanelWidth() {
    // CSS transitions make dynamically calculating the width of the left panel
    // difficult because it becomes time sensitive. Since the width and left
    // properties of the panel are set in pixels we can set that here as a constant.
    const mapWidth = parseInt(this.$().css('width'));
    if (mapWidth < 1180) {
      return 480;
    }
    return 700;
  }

  didInsertElement() {
    const mapService = this.get('map');
    let mapStyle = 'mapbox://styles/mapbox/light-v9';
    if (mapService.get('baseMap') == 'satellite') {
      mapStyle = 'mapbox://styles/ihill/cjin8f3kc0ytj2sr0rxw11a90';
    }
    this.mapboxglMap = new mapboxgl.Map({
      container: this.get('element'),
      style: mapStyle,
      // maxBounds: [[-75.5, 39], [-67, 45]],
      maxBounds: [[-100, 20], [-40, 60]],
      dragRotate: false,
      pitchWithRotate: false,
      touchZoomRotate: false,
      minZoom: 6,
    });
    this.mapboxglMap.on('load', () => {

      this.mapboxglMap.on('styledata', () => {
        this.draw(mapService);
      });
      this.mapboxglMap.on('zoom', (e) => {
        // If a user attempts to abort a zoom, stop the animation.
        if (e.originalEvent) {
          this.mapboxglMap.stop();
        }
      });
      mapService.addObserver('stored', this, 'draw');
      mapService.addObserver('filteredData', this, 'draw');
      mapService.addObserver('viewing', this, 'draw');
      mapService.addObserver('filteredData', this, 'focus');
      mapService.addObserver('baseMap', this, 'setStyle');
      mapService.addObserver('zoomCommand', this, 'actOnZoomCommand');
      mapService.addObserver('viewing', this, 'jumpTo');
      mapService.addObserver('selectionMode', this, 'selectionModeChangeHandler');
      mapService.addObserver('selectedCoordinates', this, 'drawSelectedCoordinates');

      if (mapService.get('stored').length) {
        this.draw(mapService);
        this.focus(mapService);
      }
      if (mapService.get('viewing')) {
        this.jumpTo(mapService);
      }
      if (mapService.get('selectionMode')) {
        this.drawSelector(mapService);
        this.updateSelection(true);
      }
    });
    // A Mapbox event having an 'originalEvent' can indicate that it was a user
    // initiated event instead of one triggered by a Mapbox function like
    // fitBounds.
    this.mapboxglMap.on('drag', (e) => this.updateSelection(e.originalEvent));
    this.mapboxglMap.on('zoom', (e) => this.updateSelection(e.originalEvent));
    this.mapboxglMap.on('zoomend', () => this.set('focusTargetBounds', null));
  }

  willDestroyElement() {
    const mapService = this.get('map');
    mapService.removeObserver('stored', this, 'draw');
    mapService.removeObserver('filteredData', this, 'draw');
    mapService.removeObserver('viewing', this, 'draw');
    mapService.removeObserver('filteredData', this, 'focus');
    mapService.removeObserver('baseMap', this, 'setStyle');
    mapService.removeObserver('zoomCommand', this, 'actOnZoomCommand');
    mapService.removeObserver('viewing', this, 'jumpTo');
    mapService.removeObserver('selectionMode', this, 'selectionModeChangeHandler');
    mapService.removeObserver('selectedCoordinates', this, 'drawSelectedCoordinates');
    this.mapboxglMap.remove();
  }

  selectionModeChangeHandler(mapService) {
    this.draw(mapService);
    this.drawSelector(mapService);
    this.updateSelection(true);
  }

  updateSelection(notFromFitBounds) {
    // If the user triggered the drag or zoom...
    if (notFromFitBounds
        && this.mapboxglMap
        && this.mapboxglMap.getSource('selector')
        && Ember.$('.left-panel-layer')
        && this.$()) {
      const bounds = this.get('focusTargetBounds')
          || this.mapboxglMap.getBounds();
      const northEast = bounds.getNorthEast().toArray();
      const southWest = bounds.getSouthWest().toArray();
      const ratio = (() => {
        if (this.get('focusTargetBounds')) {
          // If we're in the middle of focusing on an area, the ratios will be
          // taken care of with the padding calculated for fitBounds.
          return 0.5;
        }
        const leftPanelWidth = this.getLeftPanelWidth();
        const mapWidth = parseInt(this.$().css('width'));
        return (((mapWidth - leftPanelWidth) / 2) + leftPanelWidth) / mapWidth;
      })()
      const coordinates = [
        (northEast[0] - southWest[0]) * ratio + southWest[0],
        (northEast[1] - southWest[1]) * 0.5 + southWest[1],
      ];
      this.get('map').set('jumpToSelectedCoordinates', false);
      this.get('map').set('selectedCoordinates', coordinates);
    }
  }

  getBoundsFromCoordinates(coordinates) {
    const boundsWidth = 0.01;
    const leftPanelWidth = this.getLeftPanelWidth();
    const mapWidth = parseInt(this.$().css('width'));
    const ratio = (((mapWidth - leftPanelWidth) / 2) + leftPanelWidth) / mapWidth;
    const northEast = [
      coordinates[0] + ((1 - ratio) * boundsWidth),
      coordinates[1],
    ];
    const southWest = [
      coordinates[0] - (ratio * boundsWidth),
      coordinates[1],
    ];
    return new mapboxgl.LngLatBounds(southWest, northEast);
  }

  drawSelectedCoordinates(mapService) {
    if (this.mapboxglMap
        && this.mapboxglMap.getSource('selector')) {
      const coordinates = mapService.get('selectedCoordinates');
      if (this.get('previousCoordinatesKey') != coordinates.toString()) {
        this.mapboxglMap.getSource('selector').setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {
            },
            geometry: {
              type: 'Point',
              coordinates: coordinates,
            },
          }],
        });
        const previousParcel = this.get('previousParcel');
        if ((Date.now() - this.get('lastRequest') > 250)
            && this.mapboxglMap.getLayer('parcel')
            && (
              !previousParcel
              || !pointInPolygon.default({ type: 'Point', coordinates: coordinates }, previousParcel.get('geojson'))
            )) {
          this.getNewParcel(coordinates);
        }
        this.set('previousCoordinatesKey', coordinates.toString());
      }
      if (mapService.get('jumpToSelectedCoordinates')) {
        const bounds = this.getBoundsFromCoordinates(coordinates)
        this.mapboxglMap.fitBounds(bounds);
      }
    }
  }

  getNewParcel(coordinates) {
    this.set('lastRequest', Date.now());
    this.get('store').query('parcel', { lng: coordinates[0], lat: coordinates[1] }).then((results) => {
      const parcels = results.toArray();
      const newCoordinates = this.get('map').get('selectedCoordinates');
      if (parcels.length) {
        const parcel = parcels[0];
        if (pointInPolygon.default({ type: 'Point', coordinates: newCoordinates }, parcel.get('geojson'))
            && this.mapboxglMap.getSource('parcel')
            && this.mapboxglMap.getSource('parcel_label')) {
          this.mapboxglMap.getSource('parcel').setData({
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {
              },
              geometry: parcel.get('geojson'),
            }],
          });
          const center = centerOfMass.default(parcel.get('geojson'));
          this.mapboxglMap.getSource('parcel_label').setData({
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {
                site_addr: parcel.get('site_addr') ? parcel.get('site_addr') : '[ADDRESS UNKNOWN]',
                muni: parcel.get('muni') ? parcel.get('muni').toUpperCase() : '',
              },
              geometry: center.geometry,
            }],
          });
          this.set('previousParcel', parcel);
        } else {
          this.getNewParcel(newCoordinates);
        }
      } else {
        this.set('previousParcel', null);
        this.mapboxglMap.getSource('parcel').setData({
          type: 'FeatureCollection',
          features: [],
        });
        this.mapboxglMap.getSource('parcel_label').setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
    });
  }

  setStyle(mapService) {
    const newBaseMap = mapService.get('baseMap');
    if (newBaseMap == 'light') {
      this.mapboxglMap.setStyle('mapbox://styles/mapbox/light-v9');
    } else if (newBaseMap == 'satellite') {
      this.mapboxglMap.setStyle('mapbox://styles/ihill/cjin8f3kc0ytj2sr0rxw11a90');
    }
  }

  actOnZoomCommand(mapService) {
    const zoomCommand = mapService.get('zoomCommand');
    if (zoomCommand == 'IN') {
      this.mapboxglMap.zoomIn();
    } else if (zoomCommand == 'OUT') {
      this.mapboxglMap.zoomOut();
    }
    mapService.set('zoomCommand', null);
  }

  drawSelector(mapService) {
    const selectionMode = mapService.get('selectionMode');
    const satelliteMap = mapService.get('baseMap') != 'light';
    if (selectionMode && !this.mapboxglMap.getLayer('selector')) {
      this.mapboxglMap.addLayer({
        id: 'selector',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        },
        paint: paintProperties.selector(mapService.get('baseMap') != 'light'),
      });
      this.mapboxglMap.addLayer({
        id: 'parcel',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        },
        paint: {
          'line-color': satelliteMap ? '#fff' : '#7a7a7a',
          'line-width': satelliteMap ? 2 : 1,
          'line-dasharray': [4, 2],
        },
      });
      this.mapboxglMap.addLayer({
        id: 'parcel_label',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        },
        layout: {
          'text-field': '{site_addr},\n{muni}',
          'text-size': 12,
          'text-justify': 'left',
          'text-max-width': 20,
          'text-font': ['Open Sans Bold'],
        },
        paint: {
          'text-color': satelliteMap ? '#fff' : '#7a7a7a',
          'text-halo-color': '#000',
          'text-halo-width': satelliteMap ? 1 : 0,
        },
      });
    } else if (this.mapboxglMap.getLayer('selector')) {
      this.mapboxglMap.removeLayer('selector');
      this.mapboxglMap.removeSource('selector');
      this.mapboxglMap.removeLayer('parcel');
      this.mapboxglMap.removeSource('parcel');
      this.mapboxglMap.removeLayer('parcel_label');
      this.mapboxglMap.removeSource('parcel_label');
      this.set('previousCoordinatesKey', null);
    }
  }

  generateFeatures(developments) {
    return developments.map((dev) => ({
      type: 'Feature',
      properties: {
        id: dev.get('id'),
        color: statusColors[dev.get('status')] || '#888',
        name: dev.get('name'),
        status: dev.get('status'),
        yrcompEst: dev.get('yrcompEst'),
        yearCompl: dev.get('yearCompl'),
      },
      geometry: {
        type: 'Point',
        coordinates: [dev.get('longitude'), dev.get('latitude')],
      },
    }));
  }

  jumpTo(mapService) {
    const dev = mapService.get('viewing');
    if (dev) {
      const bounds = this.getBoundsFromCoordinates([dev.get('longitude'), dev.get('latitude')])
      this.mapboxglMap.fitBounds(bounds);
    }
  }

  focus(mapService) {
    if (!mapService.get('viewing')) {
      const data = mapService.get('filteredData').length
          ? mapService.get('filteredData')
          : mapService.get('stored');
      if (data.toArray().length > 0) {
        const fitBounds = data.reduce(
        (bounds, datum) => bounds.extend([datum.get('longitude'), datum.get('latitude')]),
          new mapboxgl.LngLatBounds()
        );
        const leftPanel = Ember.$('.left-panel-layer');
        this.set('focusTargetBounds', fitBounds);
        this.mapboxglMap.fitBounds(fitBounds, { padding: {
          top: 40,
          left: (this.get('map.showingLeftPanel') ? this.getLeftPanelWidth() + 40 : 40),
          bottom: 40,
          right: 40,
        }});
      }
    }
  }



  draw(mapService) {
    // All data
    const allFeatures = this.generateFeatures(mapService.get('filteredData').length
        ? mapService.get('remainder')
        : mapService.get('stored'));
    const satelliteMap = mapService.get('baseMap') != 'light';
    const isMuted = mapService.get('selectionMode');

    if (this.mapboxglMap.getLayer('all')) {
      this.mapboxglMap.getSource('all').setData({
        type: 'FeatureCollection',
        features: allFeatures,
      });
      Object.entries(paintProperties.developments(
        mapService.get('filteredData').length == 0,
        satelliteMap,
        isMuted
      )).forEach(([property, value]) => {
        this.mapboxglMap.setPaintProperty('all', property, value);
      });
    } else {
      this.mapboxglMap.addLayer({
        id: 'all',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: allFeatures,
          },
        },
        paint: paintProperties.developments(
          mapService.get('filteredData').length == 0,
          satelliteMap,
          isMuted
        ),
      });
    }

    if (mapService.get('viewing')) {
      const dev = mapService.get('viewing');
      const highlightFeatures = [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [dev.get('longitude'), dev.get('latitude')],
        },
      }];
      if (this.mapboxglMap.getLayer('highlighter')) {
        this.mapboxglMap.getSource('highlighter').setData({
          type: 'FeatureCollection',
          features: highlightFeatures,
        });
      } else {
        this.mapboxglMap.addLayer({
          id: 'highlighter',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: highlightFeatures,
            },
          },
          paint: paintProperties.highlighter(satelliteMap),
        });
      }
    } else if (this.mapboxglMap.getLayer('highlighter')) {
      this.mapboxglMap.removeLayer('highlighter');
      this.mapboxglMap.removeSource('highlighter');
    }

    if (mapService.filteredData.length) {
      // Filtered data
      const filteredFeatures = this.generateFeatures(mapService.filteredData);

      if (this.mapboxglMap.getLayer('filtered')) {
        this.mapboxglMap.getSource('filtered').setData({
          type: 'FeatureCollection',
          features: filteredFeatures,
        });
        Object.entries(paintProperties.developments(
          true,
          satelliteMap,
          isMuted
        )).forEach(([property, value]) => {
          this.mapboxglMap.setPaintProperty('filtered', property, value);
        });
      } else {
        this.mapboxglMap.addLayer({
          id: 'filtered',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: filteredFeatures,
            }
          },
          paint: paintProperties.developments(true, satelliteMap, isMuted),
        });
      }
    } else if (this.mapboxglMap.getLayer('filtered')) {
      this.mapboxglMap.removeLayer('filtered');
      this.mapboxglMap.removeSource('filtered');
    }

    this.mapboxglMap.on('click', 'filtered', (e) => {
      this.sendAction('viewDevelopment', e.features[0].properties.id);
    });

    this.mapboxglMap.on('mouseenter', 'filtered', (e) => {
      // Change the cursor style as a UI indicator.
      this.mapboxglMap.getCanvas().style.cursor = 'pointer';
    });

    this.mapboxglMap.on('mouseleave', 'filtered', () => {
      this.mapboxglMap.getCanvas().style.cursor = '';
    });

    this.mapboxglMap.on('click', 'all', (e) => {
      this.sendAction('viewDevelopment', e.features[0].properties.id);
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    let popupId = null;

    const openPopup = (e) => {
      // Change the cursor style as a UI indicator.
      this.mapboxglMap.getCanvas().style.cursor = 'pointer';

      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;
      popupId = properties.id;
      const formattedStatus = properties.status
          .split('_')
          .map(w => w.capitalize())
          .join(' ');
      const content = Ember.String.htmlSafe(`
        <div class='massbuilds-tooltip'</div>
          <h4>${properties.name}</h4>
          <h5 style="color: ${properties.color}">
            ${formattedStatus}
          </h5>
          <h5>
            <span>${properties.yrcompEst ? 'Estimated' : ''} Year of Completion: </span>
            ${properties.yearCompl}
          </h5>
        </div>
      `);

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates)
          .setHTML(content)
          .addTo(this.mapboxglMap);
    };

    const closePopup = () => {
      this.mapboxglMap.getCanvas().style.cursor = '';
      popup.remove();
      popupId = null;
    };

    const updatePopup = (e) => {
      if (popupId != e.features[0].properties.id) {
        closePopup();
        openPopup(e);
      }
    };

    this.mapboxglMap.on('mouseenter', 'all', openPopup);
    this.mapboxglMap.on('mouseenter', 'filtered', openPopup);
    this.mapboxglMap.on('mousemove', 'all', updatePopup);
    this.mapboxglMap.on('mousemove', 'filtered', updatePopup);
    this.mapboxglMap.on('mouseleave', 'all', closePopup);
    this.mapboxglMap.on('mouseleave', 'filtered', closePopup);
  }

};
