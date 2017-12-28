import Ember from 'ember';
import statusColors from 'massbuilds/utils/status-colors';
import Development from 'massbuilds/models/development';
const { decamelize } = Ember.String;


/**
 * Defaults
 */

const defaultMetric = {
  filter: 'metric',
  value: 0,
  inflector: 'eq',
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

  'asofright': { name: 'As of Right', type: 'boolean', ...defaultMetric },
  'over55': { name: 'Age Restricted', type: 'boolean', ...defaultMetric },
  'status': { name: 'Status', type: 'string', options: Object.keys(statusColors), ...defaultMetric },
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
  'zipCode',
  'parcelId',
  'programs',
  'user',
  'state',
  'desc',
];


const inflectorMap = {
  'lt': '<',
  'eq': '=',
  'gt': '>',
};


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
  const newParams = {};

  Object.keys(params).forEach(_key => {
    let value = params[_key];
    let key = decamelize(_key);

    newParams[key] = Ember.copy(filters[_key]);
    newParams[key].col = key;

    if (newParams[key].type === 'number') {
      const [inflector, num] = value.split(';');

      newParams[key].inflector = inflectorMap[inflector];
      newParams[key].value = parseInt(num);
    }
    else {
      newParams[key].value = value;
    }
  });

  return newParams;
};


export { 
  metricGroups, 
  filters, 
  fromQueryParams, 
  inflectorMap 
};

export default filters;
