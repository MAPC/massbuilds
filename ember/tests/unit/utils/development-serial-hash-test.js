import developmentSerialHash from 'massbuilds/utils/development-serial-hash';
import { module, test } from 'qunit';

module('Unit | Utility | development serial hash', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = developmentSerialHash();
    assert.ok(result);
  });
});
