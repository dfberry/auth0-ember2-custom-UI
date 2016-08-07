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
* create ember component for login - ember generate component auth0-login
* add login button 
    <button class="btn btn-primary btn-lg btn-login btn-block" {{ action 'login' }}>Login</button>
* don't want to use bootstrap because it will just pollute/complicate this for a true beginner but the other ember2 sample uses it - is there a style guide that I need to follow or can I dump bootstrap?
* change app.hbs to use {{auth0-login}}


<h3>auth0 Login via Lock Widget</h3>
<input id="btn-login" class="btn-login" type="submit" value="Login"/>

* create place for auth0 config settings: why do some samples have 2 settings and some have more than 2 and how do I know which I need for my exact auth0 app?
* add session to ember
* add route, etc for authenticated request
* add route, etc for unauthenticated request
* add css/js, etc for lock widget to work - not sure what this involves right now 
* make sure dashboard has 2 major settings for authorized callback urls & allowed origins (cors) - not sure I have these formatted correctly right now

# Markdown isn't quite right
TBD - not using Github flavor at moment
