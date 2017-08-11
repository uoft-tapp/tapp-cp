import React from 'react';
import { fromJS, isImmutable } from 'immutable';

function AppState() {
  this._data = fromJS({
    navigation: {
      admin: { role: 'admin', user: 'username' },
      instructor: { role: 'instructor', user: 'username' },
      student: { role: 'student', user: 'username' },
      currentTab: null,
    },

    sortStates: {},
    offers: { fetching: 0, list: null },
    contract: { fetching: 0, list: null },
  });

  this._listeners = [];
}

AppState.prototype.subscribe = function(subscriber) {
  this._listeners.push(subscriber);
};

AppState.prototype.notifyAll = function() {
  this._listeners.forEach(listener => listener());
};

/* GETTERS AND SETTERS */
AppState.prototype.setOffers = function(offers) {
  this._data = this._data.setIn(['offers', 'list'], offers);
  this.notifyAll();
};

AppState.prototype.setContracts = function(contracts) {
  this._data = this._data.setIn(['contracts', 'list'], contracts);
  this.notifyAll();
};

AppState.prototype.getOffers = function() {
  let offers = this._data.getIn(['offers', 'list']);
  return offers;
};

AppState.prototype.getContracts = function() {
  let contracts = this._data.getIn(['contracts']).toJSON().list;
  return contracts;
};

/* SORTING FUNCTIONS */

AppState.prototype.toggleSort = function(field) {
  var sortStates = this._data.getIn(['sortStates']).toJSON();

  // if sortingStates is undefined
  if (!sortStates) {
    this._data = this._data.updateIn(['sortStates', field], field => true);
  } else {
    var curState = this._data.getIn(['sortStates']).toJSON()[field];
    this._data = this._data.updateIn(['sortStates', field], field => !curState);
  }

  this.notifyAll();
};

AppState.prototype.getSortState = function() {
  let conversion = this._data.getIn(['sortStates']).toJSON();
  return conversion;
};

/* NAVIGATIONAL */
AppState.prototype.getCurrentTab = function() {
  return this._data.getIn(['navigation', 'currentTab']);
};

AppState.prototype.setCurrentTab = function(key) {
  this._data.setIn(['navigation', 'currentTab'], key);
};

/* Authentication/Users */
AppState.prototype.getCurrentUserRole = function() {
  return this._data.getIn(['navigation', 'admin', 'role']);
};

AppState.prototype.getCurrentUserName = function() {
  return this._data.getIn(['navigation', 'admin', 'user']);
};

AppState.prototype.toString = function() {
  return this._data.toJS();
};

let appState = new AppState();
export { appState };
