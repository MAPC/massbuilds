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

    const projected = [
      ...base,
      // One of housing unit types
      [
        'singfamhu',
        'smmultifam',
        'lgmultifam',
        'unknownhu',
      ],
      // One of commercial unit types
      [
        'retSqft',
        'ofcmdSqft',
        'indmfSqft',
        'whsSqft',
        'rndSqft',
        'eiSqft',
        'otherSqft',
        'hotelSqft',
        'unkSqft',
      ],
    ];

    const proposed = [
      ...base,
      // Housing unit types
      'singfamhu',
      'smmultifam',
      'lgmultifam',
      // One of commercial unit types
      [
        'retSqft',
        'ofcmdSqft',
        'indmfSqft',
        'whsSqft',
        'rndSqft',
        'eiSqft',
        'otherSqft',
        'hotelSqft',
        'unkSqft',
      ],
    ];

    const groundBroken = [
      ...base,
      // Housing unit types
      'singfamhu',
      'smmultifam',
      'lgmultifam',
      // Affordable units
      'affrdUnit',
      'affU30',
      'aff3050',
      'aff5080',
      'aff80p',
      // Counts
      'gqpop',
      'hotelrms',
      // Commercial area
      'retSqft',
      'ofcmdSqft',
      'indmfSqft',
      'whsSqft',
      'rndSqft',
      'eiSqft',
      'otherSqft',
      'hotelSqft',
      // Other area
      'publicsqft',
    ];

    this.lastEdit = Date.now();

    this.criteria = { base, projected, proposed, groundBroken };

    Ember.run.later(this, () => this.updateFieldRequirements(), 500);
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
      const setCommercial = {
        commsf: 0,
        hotelrms: 0,
        retSqft: 0,
        ofcmdSqft: 0,
        indmfSqft: 0,
        whsSqft: 0,
        rndSqft: 0,
        eiSqft: 0,
        otherSqft: 0,
        hotelSqft: 0,
        publicsqft: 0,
      };
      this.sendAction('updateEditing', setCommercial);
      this.set('proposedChanges',
          Object.assign({}, this.get('proposedChanges'), setCommercial));
    } else if (devType == 'commercial') {
      const setResidential = {
        hu: 0,
        singfamhu: 0,
        smmultifam: 0,
        lgmultifam: 0,
        affrdUnit: 0,
        affU30: 0,
        aff3050: 0,
        aff5080: 0,
        aff80p: 0,
        gqpop: 0,
      };
      this.sendAction('updateEditing', setResidential);
      this.set('proposedChanges',
          Object.assign({}, this.get('proposedChanges'), setResidential));
    }

  }


  @action
  updateFieldRequirements() {
    const criteria = this.getCriteria();

    const selectLabel = x => document.querySelector(`label[for="${x}"]`);

    const allCriteria = this.get('criteria.groundBroken');

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
    this.handleUpdate('hu', this.sumProperties(...this.get('huFields'), 'editing.unknownhu'));
  }


  @action
  updateAffrdUnit(fieldName) {
    this.handleUpdate(fieldName);
    this.handleUpdate('affrdUnit', this.sumProperties(...this.get('affrdUnitFields'), 'editing.affUnknown'));
  }


  @action
  updateCommsf(fieldName) {
    this.handleUpdate(fieldName);
    const sum = this.sumProperties(...this.get('commsfFields'), 'editing.unkSqft');
    this.handleUpdate('commsf', sum);
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
    let edited = calculatedValue || this.get(`editing.${fieldName}`);

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
    const status = this.get('editing.status');
    if (status === 'completed' || status === 'in_construction') {
      return this.get('criteria.groundBroken');
    } else if (status == 'planning') {
      return this.get('criteria.proposed');
    } else if (status == 'projected') {
      return this.get('criteria.projected');
    } else {
      return this.get('criteria.base');
    }
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
