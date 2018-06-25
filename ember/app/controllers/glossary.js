import Controller from '@ember/controller';
import content from './../content';

export default class extends Controller {
  constructor() {
    super();
    this.glossaryTerms = Object.values(content.GLOSSARY);
  }
}