import Ember from 'ember';
import Development from 'massbuilds/models/development';


const filters = {
};


// Add any remaining undefined filters based upon model 
Object.values(Ember.get(Development, 'attributes')._values)
      .forEach(attr => {
        let filter = Ember.String
                          .decamelize(attr.name)
                          .split('_')                   
                          .join(' ')
                          .capitalize();

        if (!filters[attr.name]) {
          filters[attr.name] = filter;
        }
      });

export default filters;
