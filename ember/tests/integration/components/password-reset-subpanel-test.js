import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('password-reset-subpanel', 'Integration | Component | password reset subpanel', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{password-reset-subpanel}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#password-reset-subpanel}}
      template block text
    {{/password-reset-subpanel}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
