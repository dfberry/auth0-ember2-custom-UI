import Ember from 'ember';
import BaseAuthorizer from 'ember-simple-auth/authorizers/base';

/*

The Ember authorizer is built with the following command at the prompt:
> ember generate authorizer jwt

It assumes the session has the authentication token from auth0 and that 
the token is named 'jwt'

https://ember-simple-auth.com/api/classes/BaseAuthorizer.html

  "Authorizers use the session data aqcuired by an authenticator when authenticating the session to construct authrorization data that can e.g. be injected into outgoing network requests etc. Depending on the authorization mechanism the authorizer implements, that authorization data might be an HTTP header, query string parameters, a cookie etc.

  The authorizer has to fit the authenticator (see BaseAuthenticator) as it can only use data that the authenticator acquires when authenticating the session."
*/



/*
    fn: authorizeSession
    session: The current authenticated session data
    callback: The callback to call with the authorization data
*/
var authorizeSession = function(session, callback){

    Ember.Logger.info("authorizers/jwt.js::authorizeSession");

    // expect token property name is 'jwt'
    // jwt must have come from auth0 in order to be secure & valid
    const tokenAttributeName = 'jwt';

    // find user's session token from auth0 in session data
    const userToken = session[tokenAttributeName];

    // if the token isn't empty
    if (!Ember.isEmpty(userToken)) {

      Ember.Logger.info("authorizers/jwt.js::authorizeSession, userToken = " + userToken);

      // callback with userToken
      callback('Authorization', `Bearer ${userToken}`);
    }

    //what should happen if the token is empty? 
    callback();
};

export default BaseAuthorizer.extend({
  authorize: authorizeSession
});
