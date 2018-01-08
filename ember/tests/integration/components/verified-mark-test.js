import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('verified-mark', 'Integration | Component | verified mark', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{verified-mark}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#verified-mark}}
      template block text
    {{/verified-mark}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
