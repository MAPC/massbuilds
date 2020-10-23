import { later } from '@ember/runloop';
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

    this.knownAffordableFields = [
      'affU30',
      'aff3050',
      'aff5080',
      'aff80p',
    ];

    this.allAffordableFields = [
      ...this.knownAffordableFields,
      'affrdUnit',
    ];

    this.knownHousingFields = [
      'singfamhu',
      'smmultifam',
      'lgmultifam',
    ];

    this.allHousingFields = [
      ...this.knownHousingFields,
      'unknownhu',
    ];

    this.knownCommercialFields = [
      'retSqft',
      'ofcmdSqft',
      'indmfSqft',
      'whsSqft',
      'rndSqft',
      'eiSqft',
      'otherSqft',
      'hotelSqft',
    ];

    this.allCommercialAreaFields = [
      ...this.knownCommercialFields,
      'unkSqft',
    ];

    this.baseResidentialFields = [
      'hu',
    ];

    this.baseCommercialFields = [
      'commsf',
    ];

    this.miscCommercialFields = [
      'hotelrms',
      'publicsqft',
    ];

    this.miscResidentialFields = [
      'gqpop',
    ];

    this.allCommercialFields = [
      ...this.baseCommercialFields,
      ...this.allCommercialAreaFields,
      ...this.miscCommercialFields,
    ];

    this.allResidentialFields = [
      ...this.baseResidentialFields,
      ...this.knownHousingFields,
      ...this.allAffordableFields,
      ...this.miscResidentialFields,
    ];

    const base = [
      'name',
      'status',
      'latitude',
      'longitude',
      'yearCompl',
      'descr',
      ...this.baseResidentialFields,
      ...this.baseCommercialFields,
    ];

    const projected = [
      ...base,
      // One of housing unit types
      [...this.allHousingFields],
      // One of commercial unit types
      [...this.allCommercialAreaFields],
    ];

    const proposed = [
      ...base,
      // Housing unit types
      ...this.knownHousingFields,
      // One of commercial unit types
      [...this.allCommercialAreaFields],
    ];

    const groundBroken = [
      ...base,
      ...this.knownHousingFields,
      ...this.allAffordableFields,
      ...this.miscResidentialFields,
      ...this.knownCommercialFields,
      ...this.miscCommercialFields,
    ];

    this.lastEdit = Date.now();

    this.criteria = {
      base,
      completed: groundBroken,
      in_construction: groundBroken,
      planning: proposed,
      projected: projected,
    };

    later(this, () => this.updateFieldRequirements(), 500);
    const lng = this.get('editing.longitude');
    const lat = this.get('editing.latitude');
    if (lng && lat && lng != 0 && lat != 0) {
      this.set('map.jumpToSelectedCoordinates', true);
      this.set('map.selectedCoordinates', [lng, lat])
    }
    this.get('map').addObserver('selectedCoordinates', this, 'updateCoordinates');
  }

  willDestroyElement() {
    this.get('map').removeObserver('selectedCoordinates', this, 'updateCoordinates');
  }

  updateCoordinates(mapService) {
    const coordinates = mapService.get('selectedCoordinates');
    this.handleUpdate('latitude', coordinates[1]);
    this.handleUpdate('longitude', coordinates[0]);
  }


  @action
  update() {
    this.sendAction('updateModel', this.get('proposedChanges'));
  }


  @action
  updateStatus() {
    this.handleUpdate('status');
    this.updateFieldRequirements();
  }

  @action
  handleDevTypeChange() {
    const devType = this.get('developmentType');
    this.sendAction('updateDevelopmentType', devType);
    if (devType == 'residential') {
      const setCommercial = this.get('allCommercialFields')
          .reduce((obj, field) => Object.assign(obj, { [field]: 0 }), {});
      this.sendAction('updateEditing', setCommercial);
      this.set('proposedChanges',
          Object.assign({}, this.get('proposedChanges'), setCommercial));
    } else if (devType == 'commercial') {
      const setResidential = this.get('allResidentialFields')
          .reduce((obj, field) => Object.assign(obj, { [field]: 0 }), {});
      this.sendAction('updateEditing', setResidential);
      this.set('proposedChanges',
          Object.assign({}, this.get('proposedChanges'), setResidential));
    }

  }


  @action
  updateFieldRequirements() {
    const criteria = this.getCriteria();

    const selectLabel = x => document.querySelector(`label[for="${x}"]`);

    const allCriteria = this.get('criteria.completed');

    allCriteria.forEach(field => {
      const elem = selectLabel(field);

      if (elem) {
        elem.classList.remove('required');
      }
    });

    criteria.forEach(crit => {
      if (!Array.isArray(crit)) {
        const elem = selectLabel(crit);

        if (elem) {
          elem.classList.add('required');
        }
      }
    });
  }


  @action
  updateHu(fieldName) {
    this.handleUpdate(fieldName);
    this.handleUpdate('hu', this.sumProperties(
        this.get('allHousingFields').map(field => `editing.${field}`)));
  }


  @action
  updateAffrdUnit(fieldName) {
    this.handleUpdate(fieldName);
    this.handleUpdate('affrdUnit', this.sumProperties(
        this.get('knownAffordableFields').map(field => `editing.${field}`)));
  }


  @action
  updateCommsf(fieldName) {
    this.handleUpdate(fieldName);
    this.handleUpdate('commsf', this.sumProperties(
        this.get('allCommercialAreaFields').map(field => `editing.${field}`)));
  }


  @action
  findPosition() {
    this.get('map').returnToPoint();
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

  @action
  checkForUpdated(fieldName) {
    this.handleUpdate(fieldName)
  }

  handleUpdate(fieldName, calculatedValue) {
    const modeled = this.get(`model.${fieldName}`);
    let edited = calculatedValue == undefined
        ? this.get(`editing.${fieldName}`)
        : calculatedValue;

    // Adjust values if nonstandard
    if (fieldName === 'status') {
      edited = document.querySelector(`select[name="${fieldName}"]`).value;
    }
    else if (fieldName === 'parkType') {
      edited = Array.from(document.querySelectorAll(`input.field-${fieldName}`))
                    .filter(x => x.checked)
                    .map(x => x.name);
      this.set('selectedParkTypes', edited);
    }
    if (typeof edited === 'boolean') {
      edited = !edited;
    }

    // Send updates to controller state
    this.sendAction('updateEditing', { [fieldName]: edited });
    this.set(`editing.${fieldName}`, edited);
    // If value changed, set proposedChanges
    if ((
      modeled === undefined
      && (edited !== '' && edited !== null && edited !== undefined)
    ) || (
      modeled !== undefined
      && String(modeled) !== String(edited)
    )) {
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
    this.set('lastEdit', Date.now());
    this.checkCriteria();
  }

  getCriteria() {
    return this.get(`criteria.${this.get('editing.status')}`)
        || this.get('criteria.base');
  }

  valueExists(val) {
    return (val !== null && val !== undefined && val !== '');
  }

  checkCriteria() {
    const criteria = this.getCriteria();

    const fulfilled = criteria.every(criterion => {
      if (Array.isArray(criterion)) {
        return criterion.some(subcriterion => {
          return this.valueExists(this.get(`editing.${subcriterion}`));
        });
      }
      return this.valueExists(this.get(`editing.${criterion}`));
    });

    this.set('fulfilled', fulfilled);
  }

  @computed('lastEdit')
  get inValid() {
    const validations = {};
    const criteria = this.getCriteria();
    criteria.forEach((criterion) => {
      if (Array.isArray(criterion)) {
        const atLeastOne = criterion.some(subcriterion =>
          this.valueExists(this.get(`editing.${subcriterion}`))
        );
        criterion.forEach(subcriterion => {
          validations[subcriterion] = !atLeastOne;
        });
      } else {
        validations[criterion] = !this.valueExists(this.get(`editing.${criterion}`));
      }
    });
    return validations;
  }


}
