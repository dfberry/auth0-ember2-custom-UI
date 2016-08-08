/* jshint node: true */

// auth0 configuration information brought into 
// ember's environment configuration 
var auth0 = require('./auth0.json');

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'auth0-lock-widget',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  ENV['ember-simple-auth'] = {
    authenticationRoute: 'index',
    routeAfterAuthentication: 'protected',
    routeIfAlreadyAuthenticated: 'protected'
  }  

  // this is used by the authenticators/lock.js
  ENV['auth0-ember-simple-auth'] = {
      clientID: auth0.auth0_client_id,
      domain: auth0.auth0_domain
  }

  // CORS support in Ember
  // this is more than we need right now - should this be tightened? 
  // make sure all subdomains for both http and https are available for auth0
  // make sure self is also available
  ENV['contentSecurityPolicy'] = {
    'font-src': "'self' data: https://*.bootstrapcdn.com http://*.auth0.com https://*.auth0.com",
    'style-src': "'self' 'unsafe-inline' https://*.bootstrapcdn.com http://*.auth0.com https://*.auth0.com",
    'script-src': "'self' 'unsafe-eval' 'unsafe-inline' https://*.auth0.com http://*.auth0.com",
    'img-src': "'self' 'https://*.gravatar.com data: https://*.gravatar.com  http://*.auth0.com",
    'connect-src': "'self' http://*.auth0.com https://*.auth0.com"
  }; 
  return ENV;
};
