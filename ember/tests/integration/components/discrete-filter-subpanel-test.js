import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('discrete-filter-subpanel', 'Integration | Component | discrete filter subpanel', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{discrete-filter-subpanel}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#discrete-filter-subpanel}}
      template block text
    {{/discrete-filter-subpanel}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
