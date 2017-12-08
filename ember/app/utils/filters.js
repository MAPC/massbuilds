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

  'asofright': { name: 'As of Right', type: 'bool', ...defaultMetric }
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
        'projarea',
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



export default filters;
export { metricGroups, filters };
