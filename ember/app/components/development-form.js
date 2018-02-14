import Component from '@ember/component';
import filters from 'massbuilds/utils/filters';
import { service } from 'ember-decorators/service';
import { action, computed } from 'ember-decorators/object';


export default class extends Component {

  @service map


  constructor() {
    super();

    this.classNames = ['component', 'development-form'];

    this.changes = false;
    this.proposedChanges = {};
    this.editing = this.get('model').toJSON();
    this.filters = filters;
    this.fulfilled = false;

    this.huFields = [
      'editing.singfamhu',
      'editing.smmultifam',
      'editing.lgmultifam',
      'editing.units1bd',
      'editing.units2bd',
      'editing.units3bd',
    ];

    this.affrdUnitFields = [
      'editing.affU30',
      'editing.affU3050',
      'editing.affU5080',
      'editing.affU80p',
    ];

    this.commsfFields = [
      'editing.retSqft', 
      'editing.ofcmdSqft', 
      'editing.indmfSqft', 
      'editing.whsSqft', 
      'editing.rndSqft', 
      'editing.eiSqft', 
      'editing.hotelSqft', 
      'editing.otherSqft',
    ];

    const base = [
      'name', 'status', 'address', 'yrcompEst', 'yearCompl',
      'zipCode', 'hu', 'commsf', 'descr',
    ];

    const proposed = [
      ...base,
      'singfamhu', 'smmultifam', 'lgmultifam', 'onsitepark',
    ];

    const groundBroken = [
      ...proposed,
      'units1bd', 'units2bd', 'units3bd', 'affrdUnit', 'affU30',
      'aff3050', 'aff5080', 'aff80p', 'gqpop', 'retSqft', 
      'ofcmdSqft', 'indmfSqft', 'whsSqft', 'rndSqft', 'eiSqft',
      'otherSqft', 'hotelSqft', 'hotelrms', 'publicsqft',
    ];

    this.criteria = { base, proposed, groundBroken };
  }


  @action
  update() {
    this.sendAction('updateModel', this.get('proposedChanges'));
  }


  @action 
  updateHu(fieldName) {
    this.checkForUpdated(fieldName);

    this.set('editing.hu', this.sumProperties(...this.get('huFields'), 'editing.unknownhu'));
    this.checkForUpdated('hu');
  }


  @action 
  updateAffrdUnit(fieldName) {
    this.checkForUpdated(fieldName);

    this.set('editing.affrdUnit', this.sumProperties(...this.get('affrdUnitFields'), 'editing.affUnknown'));
    this.checkForUpdated('affrdUnit');
  }


  @action 
  updateCommsf(fieldName) {
    this.checkForUpdated(fieldName);

    const sum = this.sumProperties(...this.get('commsfFields'), 'editing.unkSqft');

    this.set('editing.commsf', sum);
    this.checkForUpdated('commsf');
  }


  @action 
  findPosition() {
    this.get('map').returnToPoint();
  }


  @computed('editing.status')
  get isGroundBroken() {
    const status = this.get('editing.status');

    return (
      status === 'completed'
      || status === 'in_construction'
    );
  }


  @computed('editing.status')
  get isProposed() {
    return this.get('editing.status') === 'planning';
  }


  sumProperties() {
    const properties = this.getProperties(...arguments);

    const values = Object.values(properties)
                         .filter(prop => prop !== null && prop !== undefined && prop !== "");

    if (values.length > 0) {
      return values.reduce((a, b) => parseFloat(a) + (parseFloat(b) || 0));
    }
    else {
      return null; 
    }
  }


  checkForUpdated(fieldName) {
    const strings = ['status', 'parkType'];

    const modeled = this.get(`model.${fieldName}`);
    let edited = this.get(`editing.${fieldName}`);

    if (strings.indexOf(fieldName) !== -1) {
      edited = document.querySelector(`select[name="${fieldName}"]`).value;
      this.set(`editing.${fieldName}`, edited);
    }

    if (typeof edited === 'boolean') {
      edited = !edited;
    }
    
    if ((modeled || '').toString() !== (edited || '').toString()) {
      this.set(`proposedChanges.${fieldName}`, edited);
      this.set('changes', true);

      // If we have updated data, check to see if all fields for the 
      // current status have been filled out.
      this.checkCriteria();
    }
    else {
      const proposedChanges = this.get('proposedChanges');

      delete proposedChanges[fieldName];

      if (Object.keys(proposedChanges).length === 0) {
        this.set('changes', false);
      }
    }
  }

  
  checkCriteria() {
    let criteria = null;

    if (this.get('isGroundBroken')) {
      criteria = this.get('criteria.groundBroken');
    }
    else if (this.get('isProposed')) {
      criteria = this.get('criteria.proposed');
    }
    else {
      criteria = this.get('criteria.base');
    }

    const fulfilled = criteria.every(x => this.get(`editing.${x}`) !== null && this.get(`editing.${x}`) !== undefined);

    this.set('fulfilled', fulfilled);
  }


}
