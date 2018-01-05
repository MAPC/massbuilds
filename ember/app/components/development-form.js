import Ember from 'ember';
import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { empty } from 'ember-decorators/object/computed';


export default class extends Component {


  constructor() {
    super();

    this.classNames = ['component', 'development-form'];

    this.changes = false;
    this.proposedChanges = {};
    this.editing = this.get('model').toJSON();
  }


  @action
  update() {
    this.sendAction('updateModel', this.get('proposedChanges'));
  }


  @action 
  updateHu(fieldName) {
    this.checkForUpdated(fieldName);

    this.set('editing.hu', this.sumProperties(
      'editing.singfamhu',
      'editing.smmultifam',
      'editing.lgmultifam',
      'editing.units1Bd',
      'editing.units2Bd',
      'editing.units3Bd'
    ));
  }


  @action 
  updateAffrdUnit(fieldName) {
    this.checkForUpdated(fieldName);

    this.set('editing.affrdUnit', this.sumProperties(
      'editing.affU30',
      'editing.affU3050',
      'editing.affU5080',
      'editing.affU80p'
    ));
  }


  @action 
  updateCommsf(fieldName) {
    this.checkForUpdated(fieldName);

    this.set('editing.commsf', this.sumProperties(
      'editing.retSqft', 
      'editing.ofcmdSqft', 
      'editing.indmfSqft', 
      'editing.whsSqft', 
      'editing.rndSqft', 
      'editing.eiSqft', 
      'editing.hotelSqft', 
      'editing.otherSqft'
    ));
  }


  sumProperties() {
    const properties = this.getProperties(...arguments);

    return Object.values(properties)
                 .reduce((a, b) => parseFloat(a) + (parseFloat(b) || 0), 0);
  }


  checkForUpdated(fieldName) {
    const modeled = this.get(`model.${fieldName}`);
    let edited = this.get(`editing.${fieldName}`);

    if (typeof edited === 'boolean') {
      edited = !edited;
    }
    

    if ((modeled || '').toString() !== (edited || '').toString()) {
      this.set(`proposedChanges.${fieldName}`, edited);
      this.set('changes', true);
    }
    else {
      const proposedChanges = this.get('proposedChanges');

      delete proposedChanges[fieldName];

      if (Object.keys(proposedChanges).length === 0) {
        this.set('changes', false);
      }
    }
  }


}
