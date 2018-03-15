import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
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


  @computed('model.ovr55', 'model.private')
  get residentialAttributes() {
    return this.attributesFor({
      ovr55: 'Age Restricted' ,
      private: 'Private',
    });
  }


  @computed('model.headqtrs')
  get commercialAttributes() {
    return this.attributesFor({
      headqtrs: 'Company Headquarters',
    });
  }


  @action
  findPosition() {
    this.get('map').returnToPoint();
  }


  @computed('currentUser.user.role', 'model.municipal')
  get hasDeletePermissions() {
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


  @action
  deleteDevelopment() {
    const name = this.get('model.name');

    this.get('model')
        .destroyRecord()
        .then(() => {
          this.get('notifications').show(`You have deleted ${name}.`);

          this.transitionToRoute('map');
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
