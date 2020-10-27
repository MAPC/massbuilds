import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | map/developments/create', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:map/developments/create');
    assert.ok(route);
  });
});
