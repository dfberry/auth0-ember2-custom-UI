# Summary 
This is a basic emberjs 2 app with Logging in with the Lock widget

# TBD - editing
For now these are notes - I'll edit for more clarity/description later - just want to get the steps down as I figure them out

# scriptable install would be nice

* install nodejs
* install bower
* install emberjs
* ember new [projectname]
* cd [projectname]
* npm install - verify this
* bower install - verify this
* ember serve - shows generic/basic ember app - port is 4200

* ember install ember-simple-auth --save

* bower install auth0-lock --save
* bower install jsrsasign --save
* change ember-cli-build.js to reference these two packages
  // bring in the auth0 widget js library
  app.import(app.bowerDirectory + '/auth0-lock/build/lock.min.js');

  // bring in library to encrypt JSON webtoken
  app.import(app.bowerDirectory + '/jsrsasign/jsrsasign-latest-all-min.js');

* ember generate authenticator lock
* ember generate authorizer jwt

* ember generate route application
* ember generate route index
* ember generate route 
* ember generate route login
* ember generate controller app

* change templates
* add session to controller
* add auth0 config info
* add to CORS in config 
* add ember-simple-auth in config



* enable cors in ember's config/environment.js file
  ENV['contentSecurityPolicy'] = {
    'connect-src': "'self' http://localhost:4200 [AUTH0_DOMAIN] "
  }; 


* create place for auth0 config settings: why do some samples have 2 settings and some have more than 2 and how do I know which I need for my exact auth0 app? settings are in /app/config/auth0.json and brought into environment.js with require - is there a security reason to not use this method? 

* authenticating session - from ember-simple-auth web site
For authenticating the session, the session service provides the authenticate method that takes the name of the authenticator to use as well as other arguments depending on specific authenticator used. To define an authenticator, add a new file in app/authenticators and extend one of the authenticators the library comes with

# Rewrite - layout of material 

## Route through app to auth0 and back
The website content is restricted or allowed based on the route. If a user is not authorized to view restricted content, the app will route the user to the beginnnig point of the authentication, which is the auth0 lock widget. Once the widget pops up, the user can fill out the information, which is verified by auth0, then continues on to the restricted content. 

The ember app must pass several pieces of information to the auth0 lock widget, which is then passed on to auth0: 
* auth0 app client id found in the dashboard - created by auth0 when you create your app
* auth0 app domain set in the auth0 dashboard

The auth0 dashboard must know the allowed callback urls for the app, allowed logout urls, and allowed origins (CORS). If ember is correctly configured but the auth0 client settings for this app on the dashboard are not set correctly, the user will be created in auth0 but the ember website may not say the customer is validated or move the user to the correct ember route. These errors can usually be seen in the developer tools console of the browser. 

## Configs

### auth0
* json file for auth0 configs
* pull in auth0 config file into config/environment
* connection your auth0 config values to the environment variable that is passed to the connecting piece in app/authenticators/lock.js

ENV['auth0-ember-simple-auth'] = {
    clientID: auth0.auth0_client_id,
    domain: auth0.auth0_domain
}

### CORS - cross site
config/environment

this allows your ember app to allow auth0 and localhost to send and receive as necessary

if you aren't using localhhost, you need to change to values

ENV['contentSecurityPolicy'] = {
  'font-src': "'self' data: https://*.bootstrapcdn.com http://*.auth0.com https://*.auth0.com",
  'style-src': "'self' 'unsafe-inline' https://*.bootstrapcdn.com http://*.auth0.com https://*.auth0.com",
  'script-src': "'self' 'unsafe-eval' 'unsafe-inline' https://*.auth0.com http://*.auth0.com",
  'img-src': "'self' 'https://*.gravatar.com data: https://*.gravatar.com  http://*.auth0.com",
  'connect-src': "'self' http://*.auth0.com https://*.auth0.com"
};
## intializer
ember generate initializer auth0-ember-simple-auth-initializer.js
import Authenticator from 'auth0-ember-simple-auth/authenticators/lock';
import Authorizer from 'auth0-ember-simple-auth/authorizers/jwt';

export default {
  name:         'auth0-ember-simple-auth-initializer',
  before:       'ember-simple-auth',
  initialize: function(registry) {
    registry.register('simple-auth-authenticator:lock', Authenticator);
    registry.register('simple-auth-authorizer:jwt', Authorizer);
  }
};

### ember-simple-auth

this allows you to extend the ember-simple-auth mixins to manage routing between authenticated, non-authenticated, and login pages

the values of the settings should coorespond to routes in router.js

ENV['ember-simple-auth'] = {
  authenticationRoute: 'index',
  routeAfterAuthentication: 'protected',
  routeIfAlreadyAuthenticated: 'protected'
} 

## Authenticator/Authorizer
Create files using 'ember generate authenticator lock' and 'ember generate authorizor jwt'

once the files are found, copy the contents into each

### lock.js from https://github.com/auth0/auth0-ember-simple-auth/tree/master/addon
???do we need to generate the file in order for ember to find it
uses the auth0-lock installed from bower
ember generate authenticator lock 
copy lock.js from https://github.com/auth0/auth0-ember-simple-auth/tree/master/addon/authenticator/lock.js
consider this a base file, extend it but don't change it


### jwt.js from https://github.com/auth0/auth0-ember-simple-auth/tree/master/addon
???do we need to generate the file in order for ember to find it
ember generate authorizer jwt
copy jwt.js from https://github.com/auth0/auth0-ember-simple-auth/tree/master/addon/authenticator/lock.js

## Routes in router.js
/login 
/protected

## Handlebar templates


