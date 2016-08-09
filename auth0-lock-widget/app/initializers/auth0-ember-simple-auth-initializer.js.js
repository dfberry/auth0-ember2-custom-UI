import Authenticator from '../authenticators/lock';
import Authorizer from '../authorizers/jwt';

export default {
  name:         'auth0-ember-simple-auth-initializer',
  before:       'ember-simple-auth',
  initialize: function(registry) {
    registry.register('simple-auth-authenticator:lock', Authenticator);
    registry.register('simple-auth-authorizer:jwt', Authorizer);
  }
};