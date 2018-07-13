import Ember from 'ember';
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
    this.filters = filters;
    this.fulfilled = false;

    this.selectedParkTypes = (this.editing.parkType || '').split(',').filter(x => x);

    this.huFields = [
      'editing.singfamhu',
      'editing.smmultifam',
      'editing.lgmultifam',
    ];

    this.affrdUnitFields = [
      'editing.affU30',
      'editing.aff3050',
      'editing.aff5080',
      'editing.aff80p',
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
      'name',
      'status',
      'latitude',
      'longitude',
      'yearCompl',
      'hu',
      'commsf',
      'descr',
    ];

    const proposed = [
      ...base,
      'singfamhu', 'smmultifam', 'lgmultifam',
    ];

    const groundBroken = [
      ...proposed,
      'affrdUnit', 'affU30', 'aff3050', 'aff5080', 'aff80p', 'gqpop', 'retSqft',
      'ofcmdSqft', 'indmfSqft', 'whsSqft', 'rndSqft', 'eiSqft',
      'otherSqft', 'hotelSqft', 'hotelrms', 'publicsqft',
    ];

    this.lastEdit = Date.now();

    this.criteria = { base, proposed, groundBroken };

    Ember.run.later(this, () => this.updateFieldRequirements(), 500);
    this.get('map').addObserver('selectedCoordinates', this, 'updateCoordinates');
  }

  willDestroyElement() {
    this.get('map').removeObserver('selectedCoordinates', this, 'updateCoordinates');
  }

  updateCoordinates(mapService) {
    const coordinates = mapService.get('selectedCoordinates');
    this.sendAction('updateEditing', { longitude: coordinates[0] });
    this.sendAction('updateEditing', { latitude: coordinates[1] });
    this.checkForUpdated('latitude');
    this.checkForUpdated('longitude');
  }


  @action
  update() {
    this.sendAction('updateModel', this.get('proposedChanges'));
  }


  @action
  updateStatus() {
    this.checkForUpdated('status');
    this.updateFieldRequirements();
  }


  @action
  updateFieldRequirements() {
    const criteria = this.getCriteria();
    const notRequired = this.get('criteria.groundBroken').filter(crit => criteria.indexOf(crit) === -1);

    const selectLabel = x => document.querySelector(`label[for="${x}"]`);

    criteria.forEach(crit => {
      const elem = selectLabel(crit);

      if (elem) {
        elem.classList.add('required');
      }
    });

    notRequired.forEach(field => {
      const elem = selectLabel(field);

      if (elem) {
        elem.classList.remove('required');
      }
    });
  }


  @action
  updateHu(fieldName) {
    this.checkForUpdated(fieldName);
    this.sendAction('updateEditing', {
      hu: this.sumProperties(...this.get('huFields'), 'editing.unknownhu'),
    });
    this.checkForUpdated('hu');
  }


  @action
  updateAffrdUnit(fieldName) {
    this.checkForUpdated(fieldName);
    this.sendAction('updateEditing', {
      affrdUnit: this.sumProperties(...this.get('affrdUnitFields'), 'editing.affUnknown'),
    });
    this.checkForUpdated('affrdUnit');
  }


  @action
  updateCommsf(fieldName) {
    this.checkForUpdated(fieldName);

    const sum = this.sumProperties(...this.get('commsfFields'), 'editing.unkSqft');

    this.sendAction('updateEditing', { commsf: sum });
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
    const modeled = this.get(`model.${fieldName}`);
    let edited = this.get(`editing.${fieldName}`);

    if (fieldName === 'status') {
      edited = document.querySelector(`select[name="${fieldName}"]`).value;
      this.sendAction('updateEditing', { [fieldName]: edited });
    }
    else if (fieldName === 'parkType') {
      edited = Array.from(document.querySelectorAll(`input.field-${fieldName}`))
                    .filter(x => x.checked)
                    .map(x => x.name);

      this.set('selectedParkTypes', edited);
      this.sendAction('updateEditing', { [fieldName]: edited.join(',') });
    }

    if (typeof edited === 'boolean') {
      edited = !edited;
    }

    if (
      (
        modeled === undefined
        && (edited !== '' && edited !== null && edited !== undefined)
      )
      || (
        modeled !== undefined
        && String(modeled) !== String(edited)
      )
    ) {
      this.set(`proposedChanges.${fieldName}`, edited);
      this.sendAction('updateEditing', { [fieldName]: edited });
      this.set('changes', true);
    }
    else {
      const proposedChanges = this.get('proposedChanges');

      delete proposedChanges[fieldName];

      if (Object.keys(proposedChanges).length === 0) {
        this.set('changes', false);
      }
    }
    this.set('lastEdit', Date.now());
    this.checkCriteria();
  }


  getCriteria() {
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

    return criteria;
  }


  checkCriteria() {
    const criteria = this.getCriteria();

    const fulfilled = criteria.every(criterion => {
      const val = this.get(`editing.${criterion}`);
      return (
        val !== null
        && val !== undefined
        && val !== ''
      );
    });

    this.set('fulfilled', fulfilled);
  }

  @computed('lastEdit')
  inValid() {
    const validations = {};
    const criteria = this.getCriteria();
    criteria.forEach((criterion) => {
      const val = this.get(`editing.${criterion}`);
      validations[criterion] = (
        val === null
        || val === undefined
        || val === ''
      );
    });
    return validations;
  }


}
