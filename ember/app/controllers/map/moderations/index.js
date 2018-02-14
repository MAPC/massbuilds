import ModerationController from 'massbuilds/controllers/ModerationController';
import { service } from 'ember-decorators/service';
import { action, computed } from 'ember-decorators/object';


export default class extends ModerationController {

  @service notifications


  @computed('moderations.@each.approved')
  get filteredModerations() {
    return this.get('moderations')
               .filter(moderation => !moderation.get('approved'));
  }


  @action
  approve(moderation) {
    const development = moderation.get('development.name');
    const user = moderation.get('user.fullName');

    this.get('notifications').show(`You have approved an edit from ${user} for ${development}`);
    
    moderation.set('approved', true);
    moderation.save();
  }


  @action
  deny(moderation) {
    const development = moderation.get('development.name');
    const user = moderation.get('user.fullName');

    this.get('notifications').show(`You have denied an edit from ${user} for ${development}`, 'error');

    moderation.destroyRecord();
  }

};
