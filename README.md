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
* create ember app - homepage - ember generate template application - creates handlebars template named application
* ember generate template application


* CHECK THIS STEP - this is where I rearranged directories and the next steps were placed above the root ember app - make sure this doesn't happen again

### Login component
* create ember component for login - ember generate component auth0-login
* add login button 
    <button class="btn btn-primary btn-lg btn-login btn-block" {{ action 'login' }}>Login</button>
* don't want to use bootstrap because it will just pollute/complicate this for a true beginner but the other ember2 sample uses it - is there a style guide that I need to follow or can I dump bootstrap?
* change app.hbs to use {{auth0-login}}


<h3>auth0 Login via Lock Widget</h3>
<input id="btn-login" class="btn-login" type="submit" value="Login"/>

* make sure test passes for login text - just to make sure any tests pass

# add login & logout actions to auth0-login.js

## install lock widget from  bower https://github.com/auth0/lock
* bower install auth0-lock

* tell bower to include this js file in the compilation by putting it in the ember-cli-build.js file in the root of the ember app - so you don't need to add it as a hard code via 

<script src="bower_components/auth0-lock/build/lock.min.js"></script>

and it also brings in the auth0-lock-widget.css file 


* from https://github.com/auth0/lock - make sure if you are using a mobile app, to add this to headers - 
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>

When Ember instantiates a controller, view, or other framework component it can attach a dependency to that component. This is often used to provide services to a set of framework components. -- from http://emberjs.com/api/classes/RegistryProxyMixin.html#method_inject


install dev dependencies via npm and save to package.json for authentication
* ember install ember-simple-auth - 3rd party glue for auth to auth0
* ember install auth0/auth0-ember-simple-auth - don't install this!!!
* ember generate authenticator auth0-lock - create authenticator for ember-simple-auth to use - glue to auth0
* ember generate authorizer jwt - use the node sample to figure this out - create authorizer for ember-simple-auth to use - glue from auth0 (is that right?)

* enable cors in ember's config/environment.js file
  ENV['contentSecurityPolicy'] = {
    'connect-src': "'self' http://localhost:4200 [AUTH0_DOMAIN] "
  }; 


* (good idea but don't use this for now) ember generate scaffold-auth0 - ? where is scaffold-auth0 kept - it only works for that named quickstart but it builds most of the stuff such sample
* login route
* protected route
* templates - 
* controller


* create place for auth0 config settings: why do some samples have 2 settings and some have more than 2 and how do I know which I need for my exact auth0 app? settings are in /app/config/auth0.json and brought into environment.js with require - is there a security reason to not use this method? 

* authenticating session - from ember-simple-auth web site
For authenticating the session, the session service provides the authenticate method that takes the name of the authenticator to use as well as other arguments depending on specific authenticator used. To define an authenticator, add a new file in app/authenticators and extend one of the authenticators the library comes with

* TBD - https://github.com/auth0/auth0-ember-simple-auth - this repo has some good stuff but appears to be broken right now - I would pull out the addon directory files (addon/authenticators/lock.js & addon/authorizers/jwt.js) as those are the hard bits to figure out - then leave the rest of the files in a separate example repo that is managed more frequently. The addon code shouldn't change except for ember's addon architecture or the ember-simple-auth changing. The addon code is really glue code and should be in an Ember SDK instead of in a sample for ember.

* TBD - why does the old ember2 quickstart stick the authenticator and authorizer in the registry for the app? It hides the process for the reader. 

* add session to ember
* add route, etc for authenticated request
* add route, etc for unauthenticated request
* add css/js, etc for lock widget to work - not sure what this involves right now 
* make sure dashboard has 2 major settings for authorized callback urls & allowed origins (cors) - not sure I have these formatted correctly right now

# Markdown isn't quite right
TBD - not using Github flavor at moment

# oauth libraries for ember
* https://github.com/simplabs/ember-cli-simple-auth-oauth2 - deprecated - use Ember Simple Auth OAuth instead
* https://github.com/simplabs/ember-simple-auth - last commit 5 days ago - currently library of choice
* https://github.com/amkirwan/ember-oauth2 - last commit Jan 16
* https://github.com/amkirwan/ember-token-auth - last commit Jan 16
* https://github.com/Vestorly/torii - last commit 9 days ago

list of authentication libraries ranked for ember: https://emberobserver.com/categories/authentication

compare ember-simple-auth to torii on npm 

ember-simple-auth has more downloads and is updated more often and fewer open issues

https://www.npmjs.com/package/ember-simple-auth
https://www.npmjs.com/package/torii

## Testing Doc and API 
To help with testing the doc and sample where an API is called, please take a look at our NodeJS authentication sample: https://github.com/auth0-blog/nodejs-jwt-authentication-sample

JWT = JSON Web Tokens consist of three parts separated by dots (.), which are:
Header
Payload
Signature

JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.

JWT.IO allows you to decode, verify and generate JWT.

# Rewrite - layout of material 

## Installs
* install npm ember-simple-auth
* install bower auth0-lock
* install bower jsrasign

## Configs

### auth0
* file for auth0 configs
* pull in auth0 config file into config/environment

ENV['auth0-ember-simple-auth'] = {
    clientID: auth0.auth0_client_id,
    domain: auth0.auth0_domain
}

### CORS - cross site
config/environment

ENV['contentSecurityPolicy'] = {
  'font-src': "'self' data: https://*.bootstrapcdn.com http://*.auth0.com https://*.auth0.com",
  'style-src': "'self' 'unsafe-inline' https://*.bootstrapcdn.com http://*.auth0.com https://*.auth0.com",
  'script-src': "'self' 'unsafe-eval' 'unsafe-inline' https://*.auth0.com http://*.auth0.com",
  'img-src': "'self' 'https://*.gravatar.com data: https://*.gravatar.com  http://*.auth0.com",
  'connect-src': "'self' http://*.auth0.com https://*.auth0.com"
};

### ember-simple-auth
ENV['ember-simple-auth'] = {
  authenticationRoute: 'index',
  routeAfterAuthentication: 'protected',
  routeIfAlreadyAuthenticated: 'protected'
} 

## Authenticator/Authorizer
Create files using 'ember generate authenticator lock' and 'ember generate authorizor jwt'

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

