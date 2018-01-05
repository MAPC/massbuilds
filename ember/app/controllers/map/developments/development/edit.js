import Ember from 'ember';
import Controller from '@ember/controller';
import { action, computed, readOnly } from 'ember-decorators/object';


export default class extends Controller {


  constructor() {
    super();

    this.original = Ember.copy(this.get('model'));
  }


  @readOnly
  @computed('model')
  original() {
    return Ember.copy(this.get('model'));
  }


  @action
  createEdit() {
     
  }


  @action 
  updateHu(fieldName) {
    this.checkForUpdated(fieldName);

    this.set('model.hu', this.sumProperties(
      'model.singfamhu',
      'model.smmultifam',
      'model.lgmultifam',
      'model.units1Bd',
      'model.units2Bd',
      'model.units3Bd'
    ));
  }


  @action 
  updateAffrdUnit() {
    this.set('model.affrdUnit', this.sumProperties(
      'model.affU30',
      'model.affU3050',
      'model.affU5080',
      'model.affU80p'
    ));
  }


  @action 
  updateCommsf() {
    this.set('model.commsf', this.sumProperties(
      'model.retSqft', 
      'model.ofcmdSqft', 
      'model.indmfSqft', 
      'model.whsSqft', 
      'model.rndSqft', 
      'model.eiSqft', 
      'model.hotelSqft', 
      'model.otherSqft'
    ));
  }


  sumProperties() {
    const properties = this.getProperties(...arguments);

    return Object.values(properties)
                 .reduce((a, b) => parseFloat(a) + (parseFloat(b) || 0), 0);
  }


  checkForUpdated(fieldName) {
    const original = this.get('original');

    console.log(this.get(`model.${fieldName}`));
    console.log(original[fieldName]);
  }

}
