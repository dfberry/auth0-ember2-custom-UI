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


install dev dependencies via npm and save to package.json
* ember install ember-simple-auth
* ember install auth0/auth0-ember-simple-auth

* (good idea but don't use this for now) ember generate scaffold-auth0 - ? where is scaffold-auth0 kept - it only works for that named quickstart but it builds most of the stuff such sample
* login route
* protected route
* templates - 
* controller


* create place for auth0 config settings: why do some samples have 2 settings and some have more than 2 and how do I know which I need for my exact auth0 app? settings are in /app/config/auth0.json and brought into environment.js with require - is there a security reason to not use this method? 
* add session to ember
* add route, etc for authenticated request
* add route, etc for unauthenticated request
* add css/js, etc for lock widget to work - not sure what this involves right now 
* make sure dashboard has 2 major settings for authorized callback urls & allowed origins (cors) - not sure I have these formatted correctly right now

# Markdown isn't quite right
TBD - not using Github flavor at moment

# oauth libraries for ember
* https://github.com/simplabs/ember-cli-simple-auth-oauth2 - deprecated - use Ember Simple Auth OAuth instead
* https://github.com/amkirwan/ember-oauth2 - last commit Jan 16
* https://github.com/amkirwan/ember-token-auth - last commit Jan 16