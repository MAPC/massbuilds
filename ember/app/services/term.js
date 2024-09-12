import Service from '@ember/service';

export default class extends Service {

  constructor() {
    super(...arguments);
    this.openTerm = null;
    this.element = null;
  }
}
