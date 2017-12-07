import Development from 'massbuilds/models/development';


const filterNames = [
  
];

let filters = {
  'developer': 'developer'
};


filterNames.forEach(filter => {
  if (!filters[filter]) {
    filters[filter] = filter;
  }
});

export default filters;
