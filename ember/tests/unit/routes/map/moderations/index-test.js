import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | map/moderations/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:map/moderations/index');
    assert.ok(route);
  });
});
