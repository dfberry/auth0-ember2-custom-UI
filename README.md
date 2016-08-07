This is a basic emberjs 2 app with Logging in with the Lock widget

[For now these are notes - I'll edit for more clarity/description later - just want to get the steps down as I figure them out]

install nodejs
install bower
install emberjs

ember new [projectname]
cd [projectname]
npm install
bower install
ember serve - shows generic/basic ember app
ember generate template application - creates handlebars template named application
<add title and button to /[projectname]/app/templates/application.hbs>

<h3>auth0 Login via Lock Widget</h3>
<input id="btn-login" class="btn-login" type="submit" value="Login"/>

<add session to ember>
<add route, etc for authenticated request>
<add route, etc for unauthenticated request>
<add css/js, etc for lock widget to work - not sure what this involves right now>
<make sure dashboard has 2 major settings for authorized callback urls & allowed origins (cors)>


