import Ember from 'ember';
import Development from 'massbuilds/models/development';
const { decamelize } = Ember.String;


/**
 * Defaults
 */

const defaultMetric = {
  filter: 'metric',
  value: 0,
  inflector: 'gt',
};

const defaultDiscrete = {
  filter: 'discrete',
  value: [],
};



/**
 * Constructs
 */


// Define any filters here that need custom `name` values

const filters = {
  'developerName': { name: 'Developer', ...defaultDiscrete },
  'municipality':  { name: 'Town/City', ...defaultDiscrete },

  'asofright': { name: 'As of Right', type: 'bool', ...defaultMetric },
  'over55': { name: 'Age Restricted', type: 'bool', ...defaultMetric },
  'status': { name: 'Status', type: 'string', options: ['completed', 'developing', 'in progress'], ...defaultMetric },
};


const metricGroups = {
  'Key Info': [
    {
      title: 'General',
      metrics: [
        'status',
        'totalCost',
        'yearCompl',
        'createdAt',
      ]
    },
    {
      title: 'Building',
      metrics: [
        'height',
        'stories',
        'onsitepark',
      ]
    },
    {
      title: 'Land Use',
      metrics: [
        'asofright',
        'phased',
        'stalled',
        'cancelled',
      ]
    },
  ],
  'Residential': [
    {
      title: 'Units',
      metrics: [
        'tothu',
        'singfamhu',
        'twnhsmmult',
        'lgmultifam',
      ]
    },
    {
      title: 'Other',
      metrics: [
        'over55',
        'affordable',
        'private',
      ]
    },
  ],
  'Commercial': [
    {
      title: 'General',
      metrics: [
        'commsf',
        'estemp',
        'emploss',
      ]
    },
    {
      title: 'Makeup',
      metrics: [
        'faRet',
        'faOfcmd',
        'faIndmf',
        'faWhs',
        'faRnd',
        'faEdinst',
        'faHotel',
        'faOther',
      ]
    }
  ],
};


const blacklist = [
  'latitude', 
  'longitude',
  'mapcNotes',
  'projectUrl',
  'tagline',
  'address',
  'zipCode',
  'parcelId',
  'programs',
  'user',
  'state',
  'desc',
];



/**
 * Cleanup
 */

// Add any remaining undefined filters based upon model 
// Assume they are 'metric' filters
Object.values(Ember.get(Development, 'attributes')._values)
      .forEach(attr => {
        let type = attr.type;
        let name = decamelize(attr.name)
                   .split('_')                   
                   .join(' ')
                   .capitalize();

        if (
          !filters[attr.name]
          && blacklist.indexOf(attr.name) === -1
        ) {
          filters[attr.name] = { name, type, ...defaultMetric };
        }
      });

Object.keys(filters).forEach(col => filters[col] = {col, ...filters[col]});

const fromQueryParams = params => {
  Object.keys(params).forEach(key => {
    let value = params[key];
    params[key] = filters[key];
    params[key].value = value;
  });

  return params;
};

export default filters;
export { metricGroups, filters, fromQueryParams };
