import Component from '@ember/component';
import { action } from 'ember-decorators/object';


export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'share-buttons'];
    this.isOpen = false;

    this.successLinkTimer = null;
    this.linkMessage = null;
  }


  @action
  toggleOpen() {
    const timer = this.get('successLinkTimer');

    this.toggleProperty('isOpen');
    this.set('linkMessage', null);

    if (timer) {
      clearTimeout(timer);
    }
  }


  @action
  toLink() {
    const copyArea = document.createElement('textarea');
    copyArea.class = 'copy-area';
    copyArea.innerHTML = window.location.href
                                        .split('&municipality[]=').join(',')
                                        .split('&developerName[]=').join(',')
                                        .split('[]=').join('=')
                                        .split('%3B').join(';');

    document.querySelector('body').appendChild(copyArea);
    copyArea.select();

    try {
      const copied = document.execCommand('copy');

      if (copied) {
        this.successLinkShare();
      }
    }
    catch(e) {
      console.log(e);
    }

    copyArea.innerHTML = '';
  }


  @action
  toShapefile() {
  
  }

  @action
  toGeoJSON() {
  
  }

  @action
  toCSV() {
  
  }


  successLinkShare() {
    const timer = this.get('successLinkTimer');
    this.set('linkMessage', 'Copied Link');
    
    if (timer)  {
      clearTimeout(timer);
    }

    this.set('successLinkTimer', setTimeout(() => {
      this.set('linkMessage', null);
    }, 3000));
  }
}
