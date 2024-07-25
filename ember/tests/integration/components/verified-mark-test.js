import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | verified mark', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{verified-mark}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#verified-mark}}
        template block text
      {{/verified-mark}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
