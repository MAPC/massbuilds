import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import statusColors from 'massbuilds/utils/status-colors';
import mapboxgl from 'npm:mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';

export default class extends Component {

  @service map

  didInsertElement() {
    this.mapboxglMap = new mapboxgl.Map({
      container: this.get('element'),
      style: 'mapbox://styles/mapbox/light-v9',
      maxBounds: [[-74.5, 40], [-68, 44]],
    });
    this.mapboxglMap.on('load', () => {
      const mapService = this.get('map');
      this.mapboxglMap.on('styledata', () => {
        this.draw(mapService);
      });
      mapService.addObserver('stored', this, 'draw');
      mapService.addObserver('filteredData', this, 'draw');
      mapService.addObserver('stored', this, 'focus');
      mapService.addObserver('filteredData', this, 'focus');
      mapService.addObserver('baseMap', this, 'setStyle');
      mapService.addObserver('zoomCommand', this, 'actOnZoomCommand');
      mapService.addObserver('viewing', this, 'jumpTo');
      mapService.addObserver('selectionMode', this, 'draw');
      mapService.addObserver('selectionMode', this, 'drawSelector');
      if (mapService.stored.length) {
        this.draw(mapService);
        this.focus(mapService);
      }
      if (mapService.viewing) {
        this.focus(mapService);
      }

    });
    this.mapboxglMap.on('render', () => {
      if (this.mapboxglMap && this.mapboxglMap.getSource('selector')) {
        const bounds = this.mapboxglMap.getBounds();
        const northEast = bounds.getNorthEast().toArray();
        const southWest = bounds.getSouthWest().toArray();
        const leftPanelWidth = parseInt(Ember.$('.left-panel-layer').css('width'));
        const mapWidth = parseInt(this.$().css('width'));
        const ratio = (((mapWidth - leftPanelWidth) / 2) + leftPanelWidth) / mapWidth;
        const coordinates = [
          (northEast[0] - southWest[0]) * ratio + southWest[0],
          (northEast[1] - southWest[1]) * 0.5 + southWest[1],
        ];
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
        this.get('map').setSelectedCoordinates(coordinates);
        console.log(coordinates);
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
    if (selectionMode && !this.mapboxglMap.getLayer('selector')) {
      this.mapboxglMap.addLayer({
        id: 'selector',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {
              },
              geometry: {
                type: 'Point',
                coordinates: [0, 0],
              },
            }],
          },
        },
        paint: {
          'circle-color': '#f00',
          'circle-radius': 10,
          'circle-opacity': 0.2,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#f00',
          'circle-stroke-opacity': 1,
        },
      });
    } else if (this.mapboxglMap.getLayer('selector')) {
      this.mapboxglMap.removeLayer('selector');
      this.mapboxglMap.removeSource('selector');
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
    const coordinates = [dev.get('longitude') - .00125, dev.get('latitude')];
    const bounds = new mapboxgl.LngLatBounds([coordinates, coordinates]);
    this.mapboxglMap.fitBounds(bounds, { padding: 40, maxZoom: 18 });
  }

  focus(mapService) {
    const data = mapService.get('filteredData').length
        ? mapService.get('filteredData')
        : mapService.get('stored');
    const fitBounds = data.reduce(
    (bounds, datum) => bounds.extend([datum.get('longitude'), datum.get('latitude')]),
      new mapboxgl.LngLatBounds()
    );
    this.mapboxglMap.fitBounds(fitBounds, { padding: 40 });
  }

  generatePaintProperties(selected, highContrast, isMuted) {
    if (selected) {
      if (highContrast) {
        return {
          'circle-color': ['get', 'color'],
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 3,
            16, 8,
          ],
          'circle-opacity': isMuted ? 0.3 : 0.8,
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0.5,
            16, 1.5,
          ],
          'circle-stroke-color': '#000',
          'circle-stroke-opacity': isMuted ? 0.4 : 1,
        };
      } else {
        return {
          'circle-color': ['get', 'color'],
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0,
            16, 8,
          ],
          'circle-opacity': 0.2,
          'circle-stroke-width': 3,
          'circle-stroke-color': ['get', 'color'],
          'circle-stroke-opacity': isMuted ? 0.3 : 1,
        };
      }
    } else {
      if (highContrast) {
        return {
          'circle-color': '#333',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 3,
            16, 8,
          ],
          'circle-opacity': 0.8,
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0.5,
            16, 1.5,
          ],
          'circle-stroke-color': '#000',
          'circle-stroke-opacity': 1,
        };
      } else {
        return {
          'circle-color': '#888',
          'circle-radius': 0,
          'circle-opacity': 0.2,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#888',
          'circle-stroke-opacity': 0.3,
        };
      }
    }
  }

  draw(mapService) {
    // All data
    const allFeatures = this.generateFeatures(mapService.get('filteredData').length
        ? mapService.get('remainder')
        : mapService.stored);
    const highContrast = mapService.get('baseMap') != 'light';
    const isMuted = mapService.get('muteExistingDevelopments');
    // const activeCircleStrokeOpacity = isMuted ? 0.3 : 1;

    if (this.mapboxglMap.getLayer('all')) {
      this.mapboxglMap.getSource('all').setData({
        type: 'FeatureCollection',
        features: allFeatures,
      });
      Object.entries(this.generatePaintProperties(
        mapService.get('filteredData').length == 0,
        highContrast,
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
        paint: this.generatePaintProperties(
          mapService.get('filteredData').length == 0,
          highContrast,
          isMuted
        ),
      });
    }

    if (mapService.filteredData.length) {
      // Filtered data
      const filteredFeatures = this.generateFeatures(mapService.filteredData);

      if (this.mapboxglMap.getLayer('filtered')) {
        this.mapboxglMap.getSource('filtered').setData({
          type: 'FeatureCollection',
          features: filteredFeatures,
        });
        this.mapboxglMap.setPaintProperty('filtered', 'circle-stroke-opacity', activeCircleStrokeOpacity);
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
          paint: this.generatePaintProperties(true, highContrast, isMuted),
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
