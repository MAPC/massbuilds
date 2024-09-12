import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | discrete filter subpanel', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{discrete-filter-subpanel}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#discrete-filter-subpanel}}
        template block text
      {{/discrete-filter-subpanel}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
