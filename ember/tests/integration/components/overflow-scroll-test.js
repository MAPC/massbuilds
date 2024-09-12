import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | overflow scroll', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{overflow-scroll}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#overflow-scroll}}
        template block text
      {{/overflow-scroll}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
