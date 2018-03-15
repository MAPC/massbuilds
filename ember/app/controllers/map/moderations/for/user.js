import ModerationController from 'massbuilds/controllers/ModerationController';
import { action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends ModerationController {

  @service notifications


  @action
  delete(moderation) {
    const id = moderation.get('id');
    const elem = document.querySelector(`li[data-mod-id="${id}"]`);
    const development = moderation.get('proposedChanges.name');

    this.get('notifications').show(`You have deleted a submission for ${development}.`);

    moderation.destroyRecord().then(() => this.get('store').unloadRecord(moderation));

    this.get('moderations').removeObject(moderation);
  }

}
