import Component from '@ember/component';
import { action } from 'ember-decorators/object';
import config from 'massbuilds/config/environment';
import url from 'npm:url';


export default class extends Component {


  constructor() {
    super();

    this.classNames = ['component', 'share-buttons'];
    this.isOpen = false;

    this.linkTimer = null;
    this.linkMessage = null;
  }


  @action
  toggleOpen() {
    const timer = this.get('linkTimer');

    this.toggleProperty('isOpen');
    this.set('linkMessage', null);

    if (timer) {
      clearTimeout(timer);
    }
  }


  @action
  toLink() {
    const copier = document.createElement('textarea');
    const body = document.querySelector('body');

    copier.class = 'copy-area';
    copier.innerHTML = window.location.href
                                      .split('&municipality[]=').join(',')
                                      .split('&devlper[]=').join(',')
                                      .split('&nhood[]=').join(',')
                                      .split('[]=').join('=')
                                      .split('%3B').join(';');

    body.appendChild(copier);
    copier.select();

    if (document.execCommand('copy')) {
      this.notifyLinkShared();
    }

    body.removeChild(copier);
  }


  @action
  toShapefile() {
    this.download('zip', 'massbuilds.shp.zip');
  }


  @action
  toCSV() {
    this.download('csv', 'massbuilds.csv');
  }


  download(ext, filename) {
    const filter = this.get('filterParams');

    const body = document.querySelector('body');
    const fileLink = document.createElement('a');
    let endpoint = encodeURI(url.resolve(config.host, `developments.${ext}`));

    if (Object.keys(filter).length > 0) {
      endpoint += ('?filter=' + JSON.stringify(filter));
    }

    fileLink.href = endpoint;
    fileLink.download = filename;

    body.appendChild(fileLink);
    fileLink.click();
    body.removeChild(fileLink);
  }


  notifyLinkShared() {
    const timer = this.get('linkTimer');
    this.set('linkMessage', 'Copied Link');
    
    if (timer)  {
      clearTimeout(timer);
    }

    this.set('linkTimer', setTimeout(() => {
      this.set('linkMessage', null);
    }, 3000));
  }
}
