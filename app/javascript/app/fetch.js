import React from 'react';
import { fromJS } from 'immutable';
import { appState } from './appState.js';

function defaultFailure() {
  return 'OH NO';
}

function fetching(method, uri, success, failure = defaultFailure) {
  var initialize = {
    method: method,
    headers: {
      Accept: 'application/json',
    },
  };

  return fetch(uri, initialize)
    .then(function(resp) {
      if (resp.ok) {
        return resp.json().then(resp => success(resp));
      }

      return failure(resp);
    })
    .catch(function(error) {
      return failure(error);
    });
}

function fetchOffers() {
  fetching('GET', '/offers', parseOffers);
}

function fetchContracts() {
  fetching('GET', '/contracts', parseContracts);
}

function parseOffers(resp) {
  let offers = {},
    applicants = {},
    newOffer;

  resp.forEach(offer => {
    offers[offer.id] = {
      lastName: offer.applicant.last_name,
      firstName: offer.applicant.first_name,
      utorid: offer.applicant.utorid,
      email: offer.applicant.email,
      phone: offer.applicant.phone,
      studentNumber: offer.applicant.student_number,
      address: offer.applicant.address,
      position: offer.position_id,
      hours: offer.hours,
      year: offer.years,
      session: offer.session,
      objection: offer.objection,
    };
  });
  appState.setOffers(offers);
}
//
function parseContracts(resp) {
  var contracts = {};

  resp.forEach(contract => {
    contracts[contract.offer_id] = {
      link: contract.link,
      printed: contract.printed,
      nag_count: contract.nag_count,
    };
  });

  appState.setContacts(contracts);
}

export { fetchOffers, fetchContracts };
