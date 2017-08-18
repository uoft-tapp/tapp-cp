import React from 'react';
import deepcopy from 'deepcopy';

function AppState() {
  this._data = {
    navigation: {
      admin: { role: 'admin', user: 'username' },
      instructor: { role: 'instructor', user: 'username' },
      student: { role: 'student', user: 'username' },
      currentTab: null,
    },

    hradmin: {
      sortFields: {},
      filtersFields: [],
    },
    offers: { fetching: 0, list: [], err: null },
  };

  this.get_or_set = function(property, value, setting = false) {
    let properties = property.split('.');
    return properties.reduce(function(data, subproperty, i) {
      if (setting && i == properties.length - 1) {
        return (data[subproperty] = value);
      } else {
        return data[subproperty];
      }
    }, this._data);
  };

  this.set = function(property, value) {
    this.get_or_set(property, value, true);
  };

  this.get = function(property) {
    let result = this.get_or_set(property);
    return deepcopy(result);
  };

  //TD make a quick getter and setter that the app state functions use deepcopy in there

  this._listeners = [];
}

AppState.prototype.subscribe = function(subscriber) {
  this._listeners.push(subscriber);
};

AppState.prototype.notifyAll = function() {
  this._listeners.forEach(listener => listener());
};

/* GETTERS AND SETTERS */
AppState.prototype.successfulFetch = function() {
  this.set('offers.fetching', offers.length);
};

AppState.prototype.setFetchingList = function(state) {
  if (typeof state == 'boolean') this.set('offers.fetching', state);
};

AppState.prototype.setOffers = function(offers) {
  this.set('offers.list', offers);
  this.notifyAll();
};

AppState.prototype.getOffers = function() {
  return this.get('offers.list');
};

/* SORTING/FILTERING FUNCTIONS */

AppState.prototype.toggleHRSort = function(field) {
  // if sortingStates is undefined
  let sortStates = this.get('sortFields');
  if (!sortStates) {
    this.set('hradmin.sortFields.' + field, true);
  } else {
    var state = this.get('hradmin.sortFields.' + field);
    this.set('hradmin.sortFields.' + field, !state);
  }

  this.notifyAll();
};

AppState.prototype.toggleHRFilters = function(field) {
  this.get('hradmin.filterFields');
  this.notifyAll();
};

AppState.prototype.getSortFields = function() {
  return this.get('hradmin.sortFields');
};

AppState.prototype.clearFilters = function() {
  this._data.filterStates = {};
  this.notifyAll();
};

/* NAVIGATIONAL */
AppState.prototype.getCurrentTab = function() {
  return this.get('navigation.currentTab');
};

AppState.prototype.setCurrentTab = function(key) {
  this.set('navigation.currentTab', key);
  this.notifyAll();
};

/* Authentication/Users */
AppState.prototype.getCurrentUserRole = function(id) {
  return this.get('navigation.admin.role');
};

AppState.prototype.getCurrentUserName = function(id) {
  return this.get('navigation.admin.user');
};

let appState = new AppState();
export { appState };
