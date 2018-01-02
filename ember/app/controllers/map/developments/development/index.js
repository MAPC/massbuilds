import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Controller {

  @service map
  @service session


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
