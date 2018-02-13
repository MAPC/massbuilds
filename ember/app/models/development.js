import DS from 'ember-data'; 
import { computed } from 'ember-decorators/object';
import { attr, belongsTo, hasMany } from 'ember-decorators/data';


export default class extends DS.Model {

  @belongsTo('user') user
  @hasMany('edit') edits

  @attr('string') name
  @attr('string') status
  @attr('string') descr
  @attr('string') prjUrl
  @attr('string') tagline
  @attr('string') nhood
  @attr('string') address
  @attr('string', { default: 'MA' }) state
  @attr('string') zipCode
  @attr('string') parkType
  @attr('string') parcelId
  @attr('string') municipal
  @attr('string') devlper
  @attr('string') yrcompEst

  @attr('number') height
  @attr('number') stories
  @attr('number') yearCompl
  @attr('number') prjarea
  @attr('number') singfamhu
  @attr('number') smmultifam
  @attr('number') lgmultifam
  @attr('number') unknownhu
  @attr('number') hu
  @attr('number') gqpop
  @attr('number') rptdemp
  @attr('number') estemp
  @attr('number') commsf
  @attr('number') hotelrms
  @attr('number') onsitepark
  @attr('number') totalCost
  @attr('number') retSqft
  @attr('number') ofcmdSqft
  @attr('number') indmfSqft
  @attr('number') whsSqft
  @attr('number') rndSqft
  @attr('number') eiSqft
  @attr('number') otherSqft
  @attr('number') hotelSqft
  @attr('number') unkSqft
  @attr('number') otherRate
  @attr('number') latitude
  @attr('number') longitude
  @attr('number') units1Bd
  @attr('number') units2Bd
  @attr('number') units3Bd
  @attr('number') affrdUnit
  @attr('number') affU30
  @attr('number') aff3050
  @attr('number') aff5080
  @attr('number') aff80p
  @attr('number') affUnknown
  @attr('number') publicsqft

  @attr('boolean') rdv
  @attr('boolean') asofright
  @attr('boolean') ovr55
  @attr('boolean') clusteros
  @attr('boolean') phased
  @attr('boolean') stalled
  @attr('boolean') headqtrs
  @attr('boolean') mixedUse

  @attr('date') createdAt
  @attr('date') updatedAt
  

  @computed('address', 'municipal', 'state', 'zipCode')
  get fullAddress() {
    const props = this.getProperties('address', 'municipal', 'state', 'zipCode');

    return `${props.address}, ${props.municipal}, ${props.state} ${props.zipCode}`;
  }

}
