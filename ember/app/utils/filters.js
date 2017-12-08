import Ember from 'ember';
import Development from 'massbuilds/models/development';
const { decamelize, underscore } = Ember.String;

const defaultFilter = {
  type: 'metric',
  value: 0,
  inflector: 'gt',
};


const filters = {
  '': {
  
  }
};


// Add any remaining undefined filters based upon model 
Object.values(Ember.get(Development, 'attributes')._values)
      .forEach(attr => {
        let filter = decamelize(attr.name)
                     .split('_')                   
                     .join(' ')
                     .capitalize();

        if (!filters[attr.name]) {
          filters[filter] = { col: underscore(attr.name), ...defaultFilter };
        }
      });

export default filters;
