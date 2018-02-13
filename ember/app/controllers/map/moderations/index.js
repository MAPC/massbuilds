import ModerationController from 'massbuilds/controllers/ModerationController';
import { action, computed } from 'ember-decorators/object';


export default class extends ModerationController {


  @computed('moderations.@each.approved')
  get filteredModerations() {
    return this.get('moderations')
               .filter(moderation => !moderation.get('approved'));
  }


  @action
  approve(moderation) {
    moderation.set('approved', true);
    moderation.save();
  }


  @action
  deny(moderation) {
    moderation.destroyRecord();
  }

};
