import DS from 'ember-data';
const { Model, attr, hasMany } = DS;


export default Model.extend({

  email: attr('string'),
  password: attr('string'),
  firstName: attr('string'),
  lastName: attr('string'),
  municipality: attr('string'),

  role: attr('string'),

  developments: hasMany('developments'),

});
