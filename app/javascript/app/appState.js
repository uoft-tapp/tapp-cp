import React from 'react';
import { fromJS, isImmutable } from 'immutable';

class AppState {
  constructor() {
    this._data = fromJS({
      applicants: { fetching: 0, list: null },
      offers: { fetching: 0, list: null },
      contract: { fetching: 0, list: null },
    });

    this._listeners = [];
  }

  subscribe(subscriber) {
    this._listeners.push(subscriber);
  }

  notifyAll() {
    this._listeners.forEach(listener => listener());
  }

  setApplicants(applicants) {
    this._data = this._data.setIn(['applicants', 'list'], applicants);
    this.notifyAll();
  }

  setOffers(offers) {
    this._data = this._data.setIn(['offers', 'list'], offers);
    this.notifyAll();
  }

  setContracts(contracts) {
    this._data = this._data.setIn(['contracts', 'list'], contracts);
    this.notifyAll();
  }

  getApplicants() {
    let toJs = this._data.toJS();
    let applicants = toJs.applicants.list;
    return applicants;
  }

  getOffers() {
    return this._data.getIn(['offers', 'list']);
  }

  getOffers() {
    return this._data.getIn(['contracts', 'list']);
  }
}

let appState = new AppState();
export { appState };
