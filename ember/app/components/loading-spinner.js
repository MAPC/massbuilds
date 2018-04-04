import Component from '@ember/component';


export default class extends Component {

  constructor() {
    super(...arguments);

    this.classNames = ['component', 'loading-spinner'];
  }

}
