import Ember from 'ember';

/* having this in component is nice but would it be easier to have all this in the application.js? */

export default Ember.Component.extend({

  actions: {
    login () {
        //alert("login");
        Ember.Logger.info("auth0-login.js::login action");
    },

    logout () {
        //alert("logout");
        Ember.Logger.info("auth0-login.js::logout action");

        // ember-simple-auth, session invalidator
        this.get('session').invalidate();
    }
  } 
});
