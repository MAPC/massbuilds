import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('metric-filter-subpanel', 'Integration | Component | metric filter subpanel', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{metric-filter-subpanel}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#metric-filter-subpanel}}
      template block text
    {{/metric-filter-subpanel}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
