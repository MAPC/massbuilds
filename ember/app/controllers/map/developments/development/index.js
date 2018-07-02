import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { capitalize } from 'massbuilds/helpers/capitalize';
import { action, computed } from 'ember-decorators/object';


export default class extends Controller {

  @service map
  @service session
  @service currentUser
  @service notifications


  @computed('model.rdv', 'model.phased', 'model.stalled', 'model.asofright', 'model.mixedUse')
  get keyAttributes() {
    return this.attributesFor({
      rdv: 'Redevelopment',
      phased: 'Phased',
      stalled: 'Stalled',
      asofright: 'As of Right',
      mixedUse: 'Mixed Use',
    });
  }


  @computed('model.parkType')
  get parkTypes() {
    return (this.get('model.parkType') || '')
               .split(',')
               .map(capitalize)
               .join(', ');
  }


  @computed('model.ovr55', 'model.private')
  get residentialAttributes() {
    return this.attributesFor({
      ovr55: 'Age Restricted' ,
      private: 'Private',
    });
  }


  @computed('model.nTransit')
  get transitOptions() {
    return (this.get('model.nTransit') || []).join(', ');
  }


  @computed('model.headqtrs')
  get commercialAttributes() {
    return this.attributesFor({
      headqtrs: 'Company Headquarters',
    });
  }


  @action
  findPosition() {
    // Supposed to be hooked up to location finder in the map service.
  }


  @computed('currentUser.user.role', 'model.municipal')
  get hasSuperPermissions() {
    const role = this.get('currentUser.user.role');
    const userMuni = this.get('currentUser.user.municipality');
    const developmentMuni = this.get('model.municipal');

    return (
      role === 'admin'
      || (
        role === 'municipal'
        && userMuni.toLowerCase() === developmentMuni.toLowerCase()
      )
    );
  }


  @computed('isSettingFlag')
  get flaggingMessage() {
    return this.get('model.flag') ? 'Flagging' : 'Unflagging';
  }


  @action
  deleteDevelopment() {
    const model = this.get('model');
    const name = model.get('name');

    model.destroyRecord()
        .then(() => {
          this.get('notifications').show(`You have deleted ${name}.`);
          this.get('map').remove(model);
          this.transitionToRoute('map');
        });
  }


  @action
  flagDevelopment() {
    const model = this.get('model');
    model.set('flag', true);

    this.set('isSettingFlag', true);

    model.save()
      .then(() => {
        this.get('notifications').show('This development has been flagged for review by our team.');
      })
      .finally(() => {
        this.set('isSettingFlag', false);
      });
  }


  @action
  unflagDevelopment() {
    const model = this.get('model');
    model.set('flag', false);

    this.set('isSettingFlag', true);

    model.save()
      .then(() => {
        this.get('notifications').show('This development has been unflagged.');
      })
      .catch(() => {
        model.set('flag', true);
        this.get('notifications').error('This development must pass validations before being unflagged.');
      })
      .finally(() => {
        this.set('isSettingFlag', false);
      });
  }


  attributesFor(attributeDict) {
    const attributes = [];
    const model = this.get('model');

    Object.keys(attributeDict).forEach(attribute => {
      if (model.get(attribute)) {
        attributes.push(attributeDict[attribute]);
      }
    });

    return attributes.join(', ');
 }

}
