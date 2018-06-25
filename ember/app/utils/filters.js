import Ember from 'ember';
import statusColors from 'massbuilds/utils/status-colors';
import Development from 'massbuilds/models/development';
const { decamelize } = Ember.String;


/**
 * Defaults
 */

const defaultMetric = {
  filter: 'metric',
  value: null,
  inflector: 'eq',
};

const defaultDiscrete = {
  filter: 'discrete',
  value: [],
};



/**
 * Constructs
 */


// Define any filters here that need custom `name` values or
// are string-based option values.

const filters = {

  // Discrete

  'devlper': { name: 'Developer', ...defaultDiscrete },
  'municipal':  { name: 'Town/City', ...defaultDiscrete },
  'nhood': { name: 'Neighborhood', ...defaultDiscrete },

  // Key Info

  'status': { name: 'Status', glossaryKey: 'STATUS', type: 'string', options: Object.keys(statusColors), ...defaultMetric },
  'totalCost': { name: 'Total cost', glossaryKey: 'COST_OF_CONSTRUCTION', type: 'number', ...defaultMetric },
  'parkType': { name: 'Parking type', type: 'string', options: ['garage', 'underground', 'surface', 'other'], ...defaultMetric },
  'descr': { name: 'Description', glossaryKey: 'DESCRIPTION', type: 'string', ...defaultMetric },

  'phased': { name: 'Phased', glossaryKey: 'PHASED', type: 'boolean', ...defaultMetric },
  'stalled': { name: 'Stalled', glossaryKey: 'STALLED', type: 'boolean', ...defaultMetric },
  'stories': { name: 'Stories', glossaryKey: 'STORIES', type: 'number', ...defaultMetric },
  'mixedUse': { name: 'Mixed use', glossaryKey: 'MIXED_USE', type: 'boolean', ...defaultMetric },

  'yearCompl': { name: 'Year completed', glossaryKey: 'YEAR_COMPLETE', type: 'number', ...defaultMetric },
  'yrcompEst': { name: 'Estimated completion year',  type: 'boolean', ...defaultMetric },
  'prjarea': { name: 'Project area size', glossaryKey: 'PROJECT_AREA', type: 'number', unit: 'sqft', ...defaultMetric },
  'publicsqft': { name: 'Public sqft', glossaryKey: 'PUBLIC_AREA', type: 'number', ...defaultMetric },
  'onsitepark': { name: 'Parking spaces', glossaryKey: 'PARKING_SPACES', type: 'number', ...defaultMetric },
  'dNTrnsit': { name: 'Dist. to transit', type: 'number', ...defaultMetric },
  'height': { name: 'Height', glossaryKey: 'HEIGHT', type: 'number', unit: 'ft', ...defaultMetric },

  'clusteros': { name: 'Cluster dvlpmnt.', type: 'boolean', ...defaultMetric },
  'floodzone': { name: 'In flood zone', type: 'boolean', ...defaultMetric },
  'rdv': { name: 'Redevelopment', glossaryKey: 'REDEVELOPMENT', type: 'boolean', ...defaultMetric },

  // Residential

  'hu': { name: 'Total housing units', glossaryKey: 'HOUSING_UNITS', type: 'number', ...defaultMetric },
  'singfamhu': { name: 'Single-family units', type: 'number', ...defaultMetric },
  'smmultifam': { name: 'Sm multifam. units', type: 'number', ...defaultMetric },
  'lgmultifam': { name: 'Lg multifam. units', type: 'number', ...defaultMetric },
  'units1bd': { name: 'Studio/1 BR units', type: 'number', ...defaultMetric },
  'units2bd': { name: '2 Bedroom units', type: 'number', ...defaultMetric },
  'units3bd': { name: '3 Bedroom units', type: 'number', ...defaultMetric },
  'affrdUnit': { name: 'Affordable units', glossaryKey: 'AFFORDABLE_UNITS', type: 'number', ...defaultMetric },
  'affU30': { name: 'Units <30% AMI', type: 'number', ...defaultMetric },
  'aff3050': { name: 'Units 30-50% AMI', type: 'number', ...defaultMetric },
  'aff5080': { name: 'Units 50-80% AMI', type: 'number', ...defaultMetric },
  'aff80p': { name: 'Units 80-100% AMI', type: 'number', ...defaultMetric },
  'gqpop': { name: 'Group quarters pop.', type: 'number', ...defaultMetric },

  'asofright': { name: 'As of Right', glossaryKey: 'AS_OF_RIGHT', type: 'boolean', ...defaultMetric },
  'ovr55': { name: 'Age restricted', glossaryKey: 'AGE_RESTRICTED', type: 'boolean', ...defaultMetric },

  // Commercial

  'commsf': { name: 'Commercial sqft', glossaryKey: 'COMMERCIAL_AREA', type: 'number', ...defaultMetric },
  'retSqft': { name: 'Retail sqft', type: 'number', ...defaultMetric },
  'ofcmdSqft': { name: 'Ofce/Mdcl sqft', type: 'number', ...defaultMetric },
  'indmfSqft': { name: 'Indus/Manuf sqft', type: 'number', ...defaultMetric },
  'whsSqft': { name: 'Wrhse/Ship sqft', type: 'number', ...defaultMetric },
  'rndSqft': { name: 'Rsrch/Dvlpnt sqft', type: 'number', ...defaultMetric },
  'eiSqft': { name: 'Edu/Institu sqft', type: 'number', ...defaultMetric },
  'otherSqft': { name: 'Other sqft', type: 'number', ...defaultMetric },
  'hotelSqft': { name: 'Hotel room sqft', type: 'number', ...defaultMetric },
  'hotelrms': { name: 'Hotel rooms', glossaryKey: 'HOTEL_ROOMS', type: 'number', ...defaultMetric },
  'rptdemp': { name: 'Reported emplmnt', glossaryKey: 'REPORTED_EMPLOYMENT', type: 'number', ...defaultMetric },

  'headqtrs': { name: 'Company HQ', glossaryKey: 'COMPANY_HEADQUARTERS', type: 'boolean', ...defaultMetric },

};


const metricGroups = {
  'Key Info': [
    {
      title: 'General',
      metrics: [
        'status',
        'totalCost',
        'yearCompl',
        'yrcompEst',
        'rdv',
        'phased',
        'stalled',
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
        'prjarea',
        'asofright',
        'mixedUse',
      ]
    },
  ],
  'Residential': [
    {
      title: 'Units',
      metrics: [
        'hu',
        'singfamhu',
        'smmultifam',
        'lgmultifam',
        'units1bd',
        'units2bd',
        'units3bd',
      ]
    },
    {
      title: 'Affordability',
      metrics: [
        'affrdUnit',
        'affU30',
        'aff3050',
        'aff5080',
        'aff80p',
      ]
    },
    {
      title: 'Other',
      metrics: [
        'gqpop',
        'ovr55',
      ]
    },
  ],
  'Commercial': [
    {
      title: 'General',
      metrics: [
        'commsf',
        'estemp',
        'rptdemp',
      ]
    },
    {
      title: 'Makeup',
      metrics: [
        'retSqft',
        'ofcmdSqft',
        'indmfSqft',
        'whsSqft',
        'rndSqft',
        'eiSqft',
        'hotelSqft',
        'otherSqft',
      ]
    },
    {
      title: 'Other',
      metrics: [
        'headqtrs',
        'hotelrms',
      ]
    },
  ],
};


const blacklist = [
  'mapcNotes',
  'tagline',
  'parcelId',
  'programs',
  'user',
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
