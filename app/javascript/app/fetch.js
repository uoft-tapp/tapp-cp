import React from 'react';
import { fromJS } from 'immutable';
import { appState } from './appState.js';

function defaultFailure() {
  return 'OH NO';
}

function fetchingData(method, uri, success, failure = defaultFailure) {
  var initialize = {
    method: method,
    headers: {
      Accept: 'application/json',
    },
  };

  // this returns a promise
  return fetch(uri, initialize)
    .then(function(resp) {
      if (resp.ok) {
        return resp.json().then(resp => success(resp));
      }
      return failure(resp);
    })
    .catch(function(err) {
      return failure(err);
    });
}

function fetcher() {
  appState.setFetchingList(true);
  let promise = fetchingData('GET', '/offers', parseData);
  promise
    .then(function(result) {
      appState.setOffers(result);
      appState.successfulFetch();
    })
    .catch(function(err) {
      appState.setFetchingList(false);
    });
}

function parseData(resp) {
  let offers = {};

  resp.forEach(offer => {
    offers[offer.id] = {
      applicant_id: offer.applicant_id,
      first_name: offer.applicant.first_name,
      last_name: offer.applicant.last_name,
      student_number: offer.applicant.student_number,
      email: offer.applicant.email,
      contract_details: {
        position: offer.position,
        sessional_year: offer.session.year,
        sessional_semester: offer.session.semester,
        hours: offer.hours,
        start_date: offer.session.start_date,
        end_date: offer.session.end_date,
        pay: offer.session.pay,
        link: offer.link,
        signature: offer.signature,
      },
      contract_statuses: {
        nag_count: offer.nag_count,
        status: offer.status,
        hr_status: offer.hr_status,
        ddah_status: offer.ddah_status,
        sent_at: offer.send_date,
        printed_at: offer.print_time,
      },
    };
  });

  return offers;
}

export { fetcher };
