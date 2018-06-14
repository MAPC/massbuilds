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
      mapService.addObserver('stored', this, 'draw');
      mapService.addObserver('filteredData', this, 'draw');
      mapService.addObserver('stored', this, 'zoom');
      mapService.addObserver('filteredData', this, 'zoom');
      if (mapService.stored.length) {
        this.draw(mapService);
        this.zoom(mapService);
      }
    });
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

  zoom(mapService) {
    const data = mapService.get('filteredData').length
        ? mapService.get('filteredData')
        : mapService.get('stored');
    const fitBounds = data.reduce(
    (bounds, datum) => bounds.extend([datum.get('longitude'), datum.get('latitude')]),
      new mapboxgl.LngLatBounds()
    );
    this.mapboxglMap.fitBounds(fitBounds, { padding: 40 });
  }

  draw(mapService) {
    // All data
    const allFeatures = this.generateFeatures(mapService.get('filteredData').length
        ? mapService.get('remainder')
        : mapService.stored);

    if (this.mapboxglMap.getLayer('all')) {
      this.mapboxglMap.getSource('all').setData({
        type: 'FeatureCollection',
        features: allFeatures,
      });
      if (mapService.get('filteredData').length) {
        this.mapboxglMap.setPaintProperty('all', 'circle-color', '#888');
        this.mapboxglMap.setPaintProperty('all', 'circle-radius', 0);
        this.mapboxglMap.setPaintProperty('all', 'circle-stroke-color', '#888');
        this.mapboxglMap.setPaintProperty('all', 'circle-stroke-opacity', 0.3);
      } else {
        this.mapboxglMap.setPaintProperty('all', 'circle-color', ['get', 'color']);
        this.mapboxglMap.setPaintProperty('all', 'circle-radius', [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 0,
          16, 10,
        ]);
        this.mapboxglMap.setPaintProperty('all', 'circle-stroke-color', ['get', 'color']);
        this.mapboxglMap.setPaintProperty('all', 'circle-stroke-opacity', 1);
      }
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
        paint: {
          'circle-color': (mapService.get('filteredData').length ? '#888' : ['get', 'color']),
          'circle-radius': (mapService.get('filteredData').length ? 0 : [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0,
            16, 10,
          ]),
          'circle-opacity': 0.2,
          'circle-stroke-width': 3,
          'circle-stroke-color': (mapService.get('filteredData').length ? '#888' : ['get', 'color']),
          'circle-stroke-opacity': (mapService.get('filteredData').length ? 0.3 : 1),
        },
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
          paint: {
            'circle-color': ['get', 'color'],
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0,
              16, 10,
            ],
            'circle-opacity': 0.2,
            'circle-stroke-width': 3,
            'circle-stroke-color': ['get', 'color'],
          },
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

    const openPopup = (e) => {
      // Change the cursor style as a UI indicator.
      this.mapboxglMap.getCanvas().style.cursor = 'pointer';

      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;

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
    };

    this.mapboxglMap.on('mouseenter', 'all', openPopup);
    this.mapboxglMap.on('mouseenter', 'filtered', openPopup);
    this.mapboxglMap.on('mouseleave', 'all', closePopup);
    this.mapboxglMap.on('mouseleave', 'filtered', closePopup);
  }

};
