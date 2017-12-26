import url from 'npm:url';
import config from 'massbuilds/config/environment';
import Devise from 'ember-simple-auth/authenticators/devise';


export default Devise.extend({
  serverTokenEndpoint: url.resolve(config.host, 'my/users/sign_in'),
});
