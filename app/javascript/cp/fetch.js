import React from 'react';
import { fromJS } from 'immutable';
import { appState } from './appState.js';

/* General helpers */

function defaultFailure(resp) {
    appState.notify('<b>Action Failed:</b> ' + resp.statusText);
    return Promise.reject(resp);
}

// extract and display a message which is sent in the (JSON) body of a response
function showMessageInJsonBody(resp) {
    if (resp.message != null) {
        appState.notify(resp.message);
    } else {
        resp.json().then(res => {
            appState.alert(res.message);
        });
    }
}

function fetchHelper(URL, init, success, failure = defaultFailure) {
    return fetch(URL, init)
        .then(function(response) {
            if (response.ok) {
                return success(response);
            }
            return failure(response);
        })
        .catch(function(error) {
            appState.notify('<b>Error:</b> ' + URL + ' ' + error.message);
            return Promise.reject(error);
        });
}

function getHelper(URL, success, failure) {
    let init = {
        headers: {
            Accept: 'application/json',
        },
        method: 'GET',
    };

    return fetchHelper(URL, init, success, failure);
}

function postHelper(URL, body, success, failure) {
    let init = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(body),
    };

    return fetchHelper(URL, init, success, failure);
}

function deleteHelper(URL, success, failure) {
    return fetchHelper(URL, { method: 'DELETE' }, success, failure);
}

function putHelper(URL, body, success, failure) {
    let init = {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'PUT',
        body: JSON.stringify(body),
    };

    return fetchHelper(URL, init, success, failure);
}

/* Resource GETters */

const getOffers = () => getHelper('/offers', resp => resp.json()).then(onFetchOffersSuccess);

/* Success callbacks for resource GETters */

function onFetchOffersSuccess(resp) {
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

/* Function to GET all resources */

function fetchAll() {
    appState.setFetchingOffersList(true);

    let offersPromise = getOffers();

    // when offers are successfully fetched, update the offers list; set fetching flag to false either way
    offersPromise
        .then(offers => {
            appState.setOffersList(fromJS(offers));
            appState.setFetchingOffersList(false, true);
        })
        .catch(() => appState.setFetchingOffersList(false));
}

// import locked assignments from TAPP
function importAssignments() {
    appState.setImporting(true);

    return postHelper(
        '/import/locked-assignments',
        {},
        () => {
            appState.setImporting(false, true);
            fetchAll();
        },
        showMessageInJsonBody
    ).catch(() => appState.setImporting(false));
}

// send CHASS offers data
function importOffers(data) {
    appState.setImporting(true);

    return postHelper('/import/offers', { chass_offers: data }, () => {
        appState.setImporting(false, true);
        fetchAll();
    }).catch(() => appState.setImporting(false));
}

// send contracts
function sendContracts(offers) {
    return postHelper(
	'/offers/send-contracts',
	{ offers: offers },
        fetchAll,
        showMessageInJsonBody
    );
}

// email applicants
function email(emails) {
    let ref =
        emails.length == 1
            ? 'mailto:' + emails[0] // if there is only a single recipient, send normally
            : 'mailto:?bcc=' + emails.join(';'); // if there are multiple recipients, bcc all

    var a = document.createElement('a');
    a.href = ref;
    a.click();
}

// nag applicants
function nag(offers) {
    return postHelper('/offers/nag', { contracts: offers }, fetchAll, showMessageInJsonBody);
}

// mark contracts as hr_processed
function setHrProcessed(offers) {
    return putHelper(
        '/offers/batch-update',
        { offers: offers, hr_status: 'Processed' },
        fetchAll,
        showMessageInJsonBody
    );
}

// mark contracts as ddah_accepted
function setDdahAccepted(offers) {
    return putHelper(
        '/offers/batch-update',
        { offers: offers, ddah_status: 'Accepted' },
        fetchAll,
        showMessageInJsonBody
    );
}

// show the contract for this offer in a new window, as an applicant would see it
function showContractApplicant(offer){
    window.open('/offers/' + offer + '/pdf');
}

// show the contract for this offer in a new window, as HR would see it
function showContractHr(offer){
    return postHelper('/offers/print',
		      { contracts: [offer], update: false },
		      resp => resp.blob())
	.then(blob => {
	    let fileURL = URL.createObjectURL(blob);
	    let contractWindow = window.open(fileURL);
	    contractWindow.onclose = () => URL.revokeObjectURL(fileURL);
	});
}

// withdraw offers
function withdrawOffers(offers) {
    // create an array of promises for each offer being withdrawn
    return Promise.all(offers.map(offer => postHelper(
	'/offers/' + offer + '/decision/withdraw',
	{},
	resp => resp,
	showMessageInJsonBody)))
	.then(fetchAll);
}

// print contracts
function print(offers) {
    return postHelper(
	'/offers/print',
	{ contracts: offers, update: true },
	resp => resp.blob(),
        showMessageInJsonBody)
	.then(blob => {
	    let fileURL = URL.createObjectURL(blob);
	    let pdfWindow = window.open(fileURL);
	    pdfWindow.onclose = () => URL.revokeObjectURL(fileURL);
	    pdfWindow.document.onload = pdfWindow.print();

	    return fetchAll();
	});
}

/*
      function updateSession(input, id){
        let data = {pay: input.value};
        let init = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            method: 'PUT',
            body: JSON.stringify(data)
        };
        fetchHelper("/sessions/"+id, init, "Pay updated");
        }*/

export {
    fetchAll,
    importOffers,
    importAssignments,
    sendContracts,
    email,
    nag,
    setHrProcessed,
    setDdahAccepted,
    showContractApplicant,
    showContractHr,
    withdrawOffers,
    print,
};
