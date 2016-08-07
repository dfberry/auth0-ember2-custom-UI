import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    login () {
        //alert("login");
        Ember.Logger.info("auth0-login.js::login action");
    },

    logout () {
        //alert("logout");
        Ember.Logger.info("auth0-login.js::logout action");

    }
  } 
});
