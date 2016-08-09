import Ember from 'ember';
import BaseAuthorizer from 'ember-simple-auth/authorizers/base';
const { isEmpty } = Ember;

export default BaseAuthorizer.extend({

  authorize: function(sessionData, block) {
    const tokenAttributeName = 'jwt';
    const userToken = sessionData[tokenAttributeName];
    if (!isEmpty(userToken)) {
      block('Authorization', `Bearer ${userToken}`);
    }}
});
