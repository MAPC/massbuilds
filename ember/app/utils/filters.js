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


// Define any filters here that need custom `name` values or
// are string-based option values.

const filters = {

  // Discrete

  'devlper': { name: 'Developer', ...defaultDiscrete },
  'municipality':  { name: 'Town/City', ...defaultDiscrete },
  'nhood': { name: 'Neighborhood', ...defaultDiscrete },

  // Key Info

  'status': { name: 'Status', type: 'string', options: Object.keys(statusColors), ...defaultMetric },
  'parkType': { name: 'Parking type', type: 'string', options: ['garage', 'underground', 'surface'], ...defaultMetric },

  'yearCompl': { name: 'Year completed', type: 'number', ...defaultMetric },
  'yrcomplEst': { name: 'Year compl. est.',  type: 'number', ...defaultMetric },
  'prjarea': { name: 'Project area size', type: 'number', ...defaultMetric },
  'publicsqft': { name: 'Public sqft', type: 'number', ...defaultMetric },
  'onsitepark': { name: 'Parking spaces', type: 'number', ...defaultMetric },
  'dNTrnsit': { name: 'Dist. to transit', type: 'number', ...defaultMetric },

  'clusteros': { name: 'Cluster dvlpmnt.', type: 'boolean', ...defaultMetric },
  'floodzone': { name: 'In flood zone', type: 'boolean', ...defaultMetric },
  'rdv': { name: 'Redevelopment', type: 'boolean', ...defaultMetric },

  // Residential

  'hu': { name: 'Total housing units', type: 'number', ...defaultMetric },
  'singfamhu': { name: 'Single-family units', type: 'number', ...defaultMetric },
  'smmultifam': { name: 'Sm multifam. units', type: 'number', ...defaultMetric },
  'lgmultifam': { name: 'Lg multifam. units', type: 'number', ...defaultMetric },
  'units1Bd': { name: 'Studio/1 BR units', type: 'number', ...defaultMetric },
  'units2Bd': { name: '2 Bedroom units', type: 'number', ...defaultMetric },
  'units3Bd': { name: '3 Bedroom units', type: 'number', ...defaultMetric },
  'affrdUnit': { name: 'Affordable units', type: 'number', ...defaultMetric },
  'affU30': { name: 'Units <30% AMI', type: 'number', ...defaultMetric },
  'affU3050': { name: 'Units 30-50% AMI', type: 'number', ...defaultMetric },
  'affU5080': { name: 'Units 50-80% AMI', type: 'number', ...defaultMetric },
  'affU80p': { name: 'Units 80-100% AMI', type: 'number', ...defaultMetric },
  'gqpop': { name: 'Group quarters pop.', type: 'number', ...defaultMetric },

  'asofright': { name: 'As of Right', type: 'boolean', ...defaultMetric },
  'ovr55': { name: 'Age restricted', type: 'boolean', ...defaultMetric },

  // Commercial

  'commsf': { name: 'Commercial sqft', type: 'number', ...defaultMetric },
  'retSqft': { name: 'Retail sqft', type: 'number', ...defaultMetric },
  'ofcmdSqft': { name: 'Ofce/Mdcl sqft', type: 'number', ...defaultMetric },
  'indmfSqft': { name: 'Indus/Manuf sqft', type: 'number', ...defaultMetric },
  'whsSqft': { name: 'Wrhse/Ship sqft', type: 'number', ...defaultMetric },
  'rndSqft': { name: 'Rsrch/Dvlpnt sqft', type: 'number', ...defaultMetric },
  'eiSqft': { name: 'Edu/Institu sqft', type: 'number', ...defaultMetric },
  'otherSqft': { name: 'Other sqft', type: 'number', ...defaultMetric },
  'hotelSqft': { name: 'Hotel room sqft', type: 'number', ...defaultMetric },
  'hotelrms': { name: 'Hotel rooms', type: 'number', ...defaultMetric },
  'rptdemp': { name: 'Reported emplmnt', type: 'number', ...defaultMetric },
  'estemp': { name: 'Estmtd. emplmnt', type: 'number', ...defaultMetric },
  'estemp': { name: 'Estmtd. emplmnt', type: 'number', ...defaultMetric },

  'headqtrs': { name: 'Company HQ', type: 'boolean', ...defaultMetric },

};


const metricGroups = {
  'Key Info': [
    {
      title: 'General',
      metrics: [
        'status',
        'totalCost',
        'yearCompl',
        'yrcomplEst',
        'rdv',
        'phased',
        'stalled',
        //'createdAt',
      ]
    },
    {
      title: 'Building',
      metrics: [
        'height',
        'stories',
        'onsitepark',
        'parkType',
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
        'units1Bd',
        'units2Bd',
        'units3Bd',
      ]
    },
    {
      title: 'Affordability',
      metrics: [
        'affrdUnit',
        'affU30',
        'affU3050',
        'affU5080',
        'affU80p',
      ]
    },
    {
      title: 'Other',
      metrics: [
        'gqpop',
        'ovr55',
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
        'estemp',
      ]
    },
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
