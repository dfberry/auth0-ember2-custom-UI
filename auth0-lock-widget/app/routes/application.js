import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {

  actions: {
    login () {
        Ember.Logger.info("application.js::login action");

        // 'scope' is one of several oauth properties that need to be sent for oauth validation
        var lockOptions = {authParams:{scope: 'openid'}};

        // pass session to the authenticator named 'lock', along with options
        this.get('session').authenticate('simple-auth-authenticator:lock', lockOptions);
    },

    logout () {

        Ember.Logger.info("application.js::logout action");
        
        // ember-simple-auth, session invalidator
        this.get('session').invalidate();
    }
  }
});