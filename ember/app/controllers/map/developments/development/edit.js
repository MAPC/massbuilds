import Controller from '@ember/controller';
import { action, computed, observes } from 'ember-decorators/object';


export default class extends Controller {


  @action 
  updateHu() {
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


  @action
  save() {
     
  }


  sumProperties() {
    const properties = this.getProperties(...arguments);

    return Object.values(properties)
                 .reduce((a, b) => parseInt(a) + (parseInt(b) || 0));
  }

}
