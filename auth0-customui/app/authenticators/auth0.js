/* globals b64utos, KJUR */
import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import getOwner from 'ember-getowner-polyfill';
import Auth0 from 'npm:auth0-js';

var read = Ember.computed.readOnly,
    bool = Ember.computed.bool;

export default BaseAuthenticator.extend({

  //=======================
  // Properties
  //=======================

  /**
   * The session data
   * @type {Ember Object}
   */
  sessionData: read('_sessionData'),

  /**
   * The env config found in the environment config.
   * ENV['auth0-ember-simple-auth']
   *
   * @type {Object}
   */
  config: read('_config'),

  /**
   * Auth0 auth0 Instance
   * @type {Auth0auth0}
   */
    auth0: read('_auth0'),

  /**
   * The Auth0 App ClientID found in your Auth0 dashboard
   * @type {String}
   */
  clientID: read('_clientID'),

  /**
   * The Auth0 App Domain found in your Auth0 dashboard
   * @type {String}
   */
  domain: read('_domain'),

  /**
   * The Auth0 callback url found in your Auth0 dashboard
   * @type {String}
   */
  callbackUrl: read('_callbackUrl'),  

  /**
   * The auth0 userID.
   * @return {String}
   */
  userID: read('_sessionData.profile.user_id'),

  /**
   * The access token.
   * @return {String}
   */
  accessToken: read('_sessionData.accessToken'),

  /**
   * The refresh token used to refresh the temporary access key.
   * @return {String}
   */
  refreshToken: read('_sessionData.refreshToken'),

  /**
   * Is there currently a refresh token
   * @return {Boolean}
   */
  hasRefreshToken: bool('refreshToken'),

  /**
   * The current session JWT.
   * @return {Base64 url encoded JWT}
   */
  jwt: read('_sessionData.jwt'),

  /**
   * Is there currently a jwt?
   * @return {Boolean}
   */
  hasJWT: Ember.computed('jwt', function(){
    return !Ember.isBlank(this.get('jwt'));
  }),

  /**
   * The current JWT's expire time
   * @return {Number in seconds}
   */
  expiresIn: Ember.computed('hasJWT', 'jwt', function(){
    if(this.get('hasJWT')){
      return this._extractExpireTime(this.get('jwt'));
    }else{
      return 0;
    }
  }),

  //=======================
  // Hooks
  //=======================

  /**
   * Hook that gets called after the jwt has expired
   * but before we notify the rest of the system.
   * Great place to add cleanup to expire any third-party
   * tokens or other cleanup.
   *
   * IMPORTANT: You must return a promise, else logout
   * will not continue.
   *
   * @return {Promise}
   */
  beforeExpire () {
    return Ember.RSVP.resolve();
  },

  /**
   * Hook that gets called after Auth0 successfully
   * authenticates the user.
   * Great place to make additional calls to other
   * services, custom db, firebase, etc. then
   * decorate the session object and pass it along.
   *
   * IMPORTANT: You must return a promise with the
   * session data.
   *
   * @param  {Object} data Session object
   * @return {Promise}     Promise with decorated session object
   */
  afterAuth (data) {
    return Ember.RSVP.resolve(data);
  },

  /**
   * Hook called after auth0 refreshes the jwt
   * based on the refreshToken.
   *
   * This only fires if auth0.js was passed in
   * the offline_mode scope params
   *
   * IMPORTANT: You must return a promise with the
   * session data.
   *
   * @param  {Object} data The new jwt
   * @return {Promise}     The decorated session object
   */
  afterRestore (data) {
    return Ember.RSVP.resolve(data);
  },

  /**
   * Hook that gets called after Auth0 successfully
   * refreshes the jwt if (refresh token is enabled).
   *
   * Great place to make additional calls to other
   * services, custom db, firebase, etc. then
   * decorate the session object and pass it along.
   *
   * IMPORTANT: You must return a promise with the
   * session data.
   *
   * @param  {Object} data Session object
   * @return {Promise}     Promise with decorated session object
   */
  afterRefresh (data){
    return Ember.RSVP.resolve(data);
  },
  /**
   * Hook that gets called after Auth0 fails authentication for any reason.
   *
   *
   *
   * @param  {Error}  error object
   * @return {Promise}     Promise
   */
  onAuthError( error ){
    Ember.Logger.info("ronAuthError, error = " + error);
    return new Ember.RSVP.Promise();
  },

  restore (data) {
    Ember.Logger.info("restore, data = " + JSON.stringify(data));
    this.get('sessionData').setProperties(data);

    if(this._jwtRemainingTime() < 1){
      if(this.get('hasRefreshToken')){
        return this._refreshAuth0Token();
      }else{
        return Ember.RSVP.reject();
      }
    }else{
      return this.afterRestore(this.get('sessionData'))
        .then(response => Ember.RSVP.resolve(this._setupFutureEvents(response)));
    }
  },

// FIX - doesn't work on first validation but does work on second
  authenticate (config) {

    return new Ember.RSVP.Promise((res) => {

      var myauth0 = this.get('auth0');

/*
connection: windowslive, db-conn

      // trying to pass user & password
      // does that only work with db-conn
      myauth0.login({
        connection: config.connection,
        username:   config.username,
        password:   config.password,
        scope: 'openid offline_access'
      },
*/
      myauth0.login({
          connection: 'db-conn',
          username: 'dinaberry@outlook.com',
          password:'1234',
          scope: 'openid offline_access'
      },
      function (err, result) {
        if(err){
          Ember.Logging.Info(err);
          res(err);
        }
          Ember.Logging.Info(result);
          //Ember.Logging.Info(id_token);
          //Ember.Logging.Info(access_token);
          //Ember.Logging.Info(state);
          //Ember.Logging.Info(refresh_token);
          
          //res({profile:profile, jwt: id_token});
          res();
      });
    });
  },

  invalidate (/* data */) {
    if (this.get('hasRefreshToken')) {
      var domain = this.get('domain'),
          userID = this.get('userID'),
          refreshToken = this.get('refreshToken'),
          url = `https://${domain}/api/users/${userID}/refresh_tokens/${refreshToken}`;

      return this._makeAuth0Request(url, "DELETE").then(() => {
        return this.beforeExpire();
      });
    } else {
      return this.beforeExpire();
    }
  },

  //=======================
  // Overrides
  //=======================
  init () {
    var applicationConfig = getOwner(this).resolveRegistration('config:environment');
    var config = applicationConfig['auth0-ember-simple-auth'];

    this.set('_config', config);

    this.set('_sessionData', Ember.Object.create());

    this.set('_clientID', config.clientID);
    this.set('_domain', config.domain);
    this.set('_callbackUrl', config.callbackUrl);

    var auth0 = new Auth0({
      clientID: this.get('clientID'), 
      domain: this.get('domain'),
      callbackURL: this.get('callbackUrl'),
      callbackOnLocationHash: true
    });
  
    this.set('_auth0', auth0);
    this._super();
  },

  //=======================
  // Private Methods
  //=======================
  _makeAuth0Request (url, method) {
    var headers = {'Authorization':'Bearer ' + this.get('jwt')};
    return Ember.$.ajax(url, {type:method, headers:headers});
  },

  _setupFutureEvents (data) {

    Ember.Logger.info("_setupFutureEvents, data = " + data);

    // set the session info here
    this.get('sessionData').setProperties(data);
    //this.get('sessionData').set('dina','ok');
    this._clearJobs();
    this._scheduleExpire();

    if (this.get('hasRefreshToken')) {
      this._scheduleRefresh();
    }

    return this.get('sessionData');
  },

  _scheduleRefresh () {
    Ember.run.cancel(this.get('_refreshJob'));

    var remaining = this._jwtRemainingTime();
    var earlyRefresh = 30;
    var refreshInSecond = (remaining < (earlyRefresh*2)) ? remaining/2 : remaining - earlyRefresh;
    var refreshInMilli = refreshInSecond * 1000;

    if(!isNaN(refreshInMilli) && refreshInMilli >= 50){
      var job = Ember.run.later(this, this._refreshAccessToken, refreshInMilli);
      this.set('_refreshJob', job);
    }
  },

  _scheduleExpire () {
    Ember.run.cancel(this.get('_expireJob'));
    var expireInMilli = this._jwtRemainingTime()*1000;
    var job = Ember.run.later(this, this._processSessionExpired, expireInMilli);
    this.set('_expireJob', job);
  },

  _clearJobs () {
    Ember.run.cancel(this.get('_expireJob'));
    Ember.run.cancel(this.get('_refreshJob'));
  },

  _processSessionExpired () {
    this.beforeExpire().then(() => this.trigger('sessionDataInvalidated'));
  },

  _refreshAuth0Token () {
    return new Ember.RSVP.Promise((res, rej) => {
      this.get('auth0').renewIdToken(this.get('jwt'), (err, result) => {
          if(err){
            rej(err);
          }else{
            this.afterRefresh({jwt:result.id_token})
            .then(response => {
              res(this._setupFutureEvents(response));
            });
          }
      });
    });
  },

  _refreshAccessToken () {
    this._refreshAuth0Token().then(data => this.trigger('sessionDataUpdated', data));
  },

  //=======================
  // Utility Methods
  //=======================
  _extractExpireTime (jwt) {
    var claim = b64utos(jwt.split(".")[1]);
    var decoded = KJUR.jws.JWS.readSafeJSONString(claim);
    return decoded.exp;
  },

  _jwtRemainingTime () {
    if(this.get('expiresIn') <= 0){
      return 0;
    }else{
      var currentTime = (new Date().getTime()/1000);
      return this.get('expiresIn') - currentTime;
    }
  }
});

