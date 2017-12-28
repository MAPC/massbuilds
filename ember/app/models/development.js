import DS from 'ember-data'; 
import { attr, belongsTo } from 'ember-decorators/data';


export default class extends DS.Model {

  @belongsTo({async: true}) user

  @attr('string') name
  @attr('string') status
  @attr('string') desc
  @attr('string') prjUrl
  @attr('string') mapcNotes
  @attr('string') tagline
  @attr('string') address
  @attr('string') state
  @attr('string') zipCode
  @attr('string') parkType
  @attr('string') parcelId
  @attr('string') municipality
  @attr('string') devlper
  @attr('string') yrcompEst
  @attr('string') programs

  @attr('number') height
  @attr('number') stories
  @attr('number') yearCompl
  @attr('number') prjarea
  @attr('number') singfamhu
  @attr('number') smmultifam
  @attr('number') lgmultifam
  @attr('number') hu
  @attr('number') gqpop
  @attr('number') rptdemp
  @attr('number') emploss
  @attr('number') estemp
  @attr('number') commsf
  @attr('number') hotelrms
  @attr('number') onsitepark
  @attr('number') totalCost
  @attr('number') teamMembershipCount
  @attr('number') retSqft
  @attr('number') ofcmdSqft
  @attr('number') indmfSqft
  @attr('number') whsSqft
  @attr('number') rndSqft
  @attr('number') eiSqft
  @attr('number') otherSqft
  @attr('number') hotelSqft
  @attr('number') otherRate
  @attr('number') affordable
  @attr('number') latitude
  @attr('number') longitude
  @attr('number') units1bd
  @attr('number') units2bd
  @attr('number') units3bd
  @attr('number') affrdUnit
  @attr('number') affU30
  @attr('number') aff3050
  @attr('number') aff5080
  @attr('number') aff80p
  @attr('number') publicsqft

  @attr('boolean') rdv
  @attr('boolean') asofright
  @attr('boolean') ovr55
  @attr('boolean') clusteros
  @attr('boolean') phased
  @attr('boolean') stalled
  @attr('boolean') cancelled
  @attr('boolean') private
  @attr('boolean') headqtrs
  @attr('boolean') mixedUse
  @attr('boolean') fortyB
  @attr('boolean') residential
  @attr('boolean') commercial

  @attr('date') createdAt
  @attr('date') updatedAt
}
