import React from 'react';
import { fromJS, isImmutable } from 'immutable';

function AppState() {
  console.log('NEW APPSTATE');
  this._data = fromJS({
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

AppState.prototype.toString = function() {
  return this._data.toJS();
};

AppState.prototype.getSortState = function() {
  let conversion = this._data.getIn(['sortStates']).toJSON();
  return conversion;
};

let appState = new AppState();
export { appState };
