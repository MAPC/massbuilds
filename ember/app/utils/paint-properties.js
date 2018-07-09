const paintProperties = {
  developments: (selected, satelliteMap, isMuted) => {
    if (selected) {
      if (satelliteMap) {
        return {
          'circle-color': ['get', 'color'],
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 3,
            16, 8,
          ],
          'circle-opacity': isMuted ? 0.3 : 1,
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 2,
            16, 3,
          ],
          'circle-stroke-color': '#fff',
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
      if (satelliteMap) {
        return {
          'circle-color': '#ddd',
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
            10, 2,
            16, 3,
          ],
          'circle-stroke-color': '#fff',
          'circle-stroke-opacity': 0.8,
        };
      } else {
        return  {
          'circle-color': '#888',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0,
            16, 8,
          ],
          'circle-opacity': 0.2,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#888',
          'circle-stroke-opacity': isMuted ? 0.3 : 1,
        };
      }
    }
  },
  selector: (satelliteMap) => {
    return satelliteMap ? {
      'circle-color': '#FF9800',
      'circle-radius': 10,
      'circle-opacity': 1,
      'circle-stroke-width': 3,
      'circle-stroke-color': '#fff',
      'circle-stroke-opacity': 1,
    } : {
      'circle-color': '#FF9800',
      'circle-radius': 10,
      'circle-opacity': 0.2,
      'circle-stroke-width': 3,
      'circle-stroke-color': '#FF9800',
      'circle-stroke-opacity': 1,
    };
  },
  highlighter: (satelliteMap) => {
    return satelliteMap ? {
      'circle-color': '#fff',
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 6,
        16, 16,
      ],
      'circle-opacity': 0,
      'circle-stroke-width': 3,
      'circle-stroke-color': '#FF9800',
      'circle-stroke-opacity': 1,
    } : {
      'circle-color': '#fff',
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 6,
        16, 16,
      ],
      'circle-opacity': 0,
      'circle-stroke-width': 3,
      'circle-stroke-color': '#FF9800',
      'circle-stroke-opacity': 1,
    };
  },
};
export default paintProperties;
