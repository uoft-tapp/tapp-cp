import React from 'react';
import { fromJS } from 'immutable';
import { appState } from './appState.js';

/* General helpers */

function defaultFailure(text) {
    appState.alert('<b>Action Failed:</b> ' + text);
    return Promise.reject();
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

function fetchHelper(URL, init) {
    return fetch(URL, init).then(
        function(resp) {
            if (resp.ok) {
                return Promise.resolve(resp);
            }
            return Promise.reject(resp);
        },
        function(error) {
            appState.alert(
                '<b>' + init.method + ' error</b> ' + URL + ': ' + error.message
            );
            return Promise.reject(error);
        }
    );
}

// fetching for 'can-*' batch methods
function fetchCheckHelper(URL, body) {
    return fetch(URL, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(body),
    })
        .then(function(resp) {
            if (resp.ok || resp.status == 404) {
                return Promise.resolve(resp);
            }
            return Promise.reject(resp);
        })
        .catch(function(error) {
            appState.alert(
                '<b>' + init.method + ' error</b> ' + URL + ': ' + error.message
            );
            return Promise.reject(error);
        });
}

function getHelper(URL) {
    return fetchHelper(URL, {
        headers: {
            Accept: 'application/json',
        },
        method: 'GET',
    });
}

function postHelper(URL, body) {
    return fetchHelper(URL, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(body),
    });
}

function deleteHelper(URL) {
    return fetchHelper(URL, { method: 'DELETE' });
}

function putHelper(URL, body) {
    return fetchHelper(URL, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

/* Resource GETters */

const getOffers = () =>
    getHelper('/offers')
        .then(resp => resp.json())
        .then(onFetchOffersSuccess)
        .catch(defaultFailure);

const getSessions = () =>
    getHelper('/sessions')
        .then(resp => resp.json())
        .then(onFetchSessionsSuccess)
        .catch(defaultFailure);

/* Success callbacks for resource GETters */

function onFetchOffersSuccess(resp) {
    let offers = {};

    resp.forEach(offer => {
        offers[offer.id] = {
            applicantId: offer.applicant_id,
            firstName: offer.applicant.first_name,
            lastName: offer.applicant.last_name,
            studentNumber: offer.applicant.student_number,
            email: offer.applicant.email,
            position: offer.position,
            session: offer.session.id,
            hours: offer.hours,
            nagCount: offer.nag_count,
            status: offer.status,
            hrStatus: offer.hr_status,
            ddahStatus: offer.ddah_status,
            sentAt: offer.send_date,
            printedAt: offer.print_time,
            link: offer.link,
        };
    });

    return offers;
}

function onFetchSessionsSuccess(resp) {
    let sessions = {};

    resp.forEach(session => {
        sessions[session.id] = {
            year: session.year,
            semester: session.semester,
            pay: session.pay,
        };
    });

    return sessions;
}

/* Function to GET all resources */

function fetchAll() {
    appState.setFetchingOffersList(true);
    appState.setFetchingSessionsList(true);

    let offersPromise = getOffers();
    let sessionsPromise = getSessions();

    // when offers are successfully fetched, update the offers list; set fetching flag to false either way
    offersPromise
        .then(offers => {
            appState.setOffersList(fromJS(offers));
            appState.setFetchingOffersList(false, true);
        })
        .catch(() => appState.setFetchingOffersList(false));

    // when sessions are successfully fetched, update the sessions list; set fetching flag to false either way
    sessionsPromise
        .then(sessions => {
            appState.setSessionsList(fromJS(sessions));
            appState.setFetchingSessionsList(false, true);
        })
        .catch(() => appState.setFetchingSessionsList(false));
}

// import locked assignments from TAPP
function importAssignments() {
    appState.setImporting(true);

    postHelper('/import/locked-assignments', {}).then(
        () => {
            appState.setImporting(false, true);

            appState.setFetchingOffersList(true);
            getOffers()
                .then(offers => {
                    appState.setOffersList(fromJS(offers));
                    appState.setFetchingOffersList(false, true);
                })
                .catch(() => appState.setFetchingOffersList(false));
        },
        resp => {
            appState.setImporting(false);
            showMessageInJsonBody(resp);
        }
    );
}

// send CHASS offers data
function importOffers(data) {
    appState.setImporting(true);

    postHelper('/import/offers', { chass_offers: data }).then(
        () => {
            appState.setImporting(false, true);

            appState.setFetchingOffersList(true);
            getOffers()
                .then(offers => {
                    appState.setOffersList(fromJS(offers));
                    appState.setFetchingOffersList(false, true);
                })
                .catch(() => appState.setFetchingOffersList(false));
        },
        resp => {
            appState.setImporting(false);
            showMessageInJsonBody(resp);
        }
    );
}

// send contracts
function sendContracts(offers) {
    let validOffers = offers;

    // check which contracts can be sent
    fetchCheckHelper('/offers/can-send-contract', { contracts: offers })
        .catch(defaultFailure)
        .then(resp => {
            if (resp.status == 404) {
                // some contracts cannot be sent
                return resp.json().then(res => {
                    let invalidOffers = res.invalid_offers;
                    invalidOffers.forEach(offer => {
                        appState.alert(
                            '<b>Error</b>: Cannot nag send contract for offer ' +
                                offer
                        );
                        // remove invalid offer(s) from offer list
                        validOffers.splice(validOffers.indexOf(offer), 1);
                    });

                    if (validOffers.length == 0) {
                        return Promise.reject();
                    }
                }, defaultFailure);
            }
        })
        // send offers to valid offers
        .then(() =>
            postHelper('/offers/send-contracts', { offers: validOffers })
        )
        .then(() => {
            appState.setFetchingOffersList(true);
            getOffers()
                .then(offers => {
                    appState.setOffersList(fromJS(offers));
                    appState.setFetchingOffersList(false, true);
                })
                .catch(() => appState.setFetchingOffersList(false));
        });
}

// nag applicants
function nag(offers) {
    let validOffers = offers;

    // check which applicants can be nagged
    fetchCheckHelper('/offers/can-nag', { contracts: offers })
        .catch(defaultFailure)
        .then(resp => {
            if (resp.status == 404) {
                // some contracts cannot be sent
                return resp.json().then(res => {
                    let invalidOffers = res.invalid_offers;
                    invalidOffers.forEach(offer => {
                        appState.alert(
                            '<b>Error</b>: Cannot nag applicant about offer ' +
                                offer
                        );
                        // remove invalid offer(s) from offer list
                        validOffers.splice(validOffers.indexOf(offer), 1);
                    });

                    if (validOffers.length == 0) {
                        return Promise.reject();
                    }
                }, defaultFailure);
            }
        })
        // nag valid offers
        .then(() => postHelper('/offers/nag', { contracts: validOffers }))
        .then(() => {
            appState.setFetchingOffersList(true);
            getOffers()
                .then(offers => {
                    appState.setOffersList(fromJS(offers));
                    appState.setFetchingOffersList(false, true);
                })
                .catch(() => appState.setFetchingOffersList(false));
        });
}

// mark contracts as hr_processed
function setHrProcessed(offers) {
    let validOffers = offers;

    // check which offers can be marked as hr_processed
    fetchCheckHelper('/offers/can-hr-update', { offers: offers })
        .catch(defaultFailure)
        .then(resp => {
            if (resp.status == 404) {
                // some offers cannot be updated
                return resp.json().then(res => {
                    let invalidOffers = res.invalid_offers;
                    invalidOffers.forEach(offer => {
                        appState.alert(
                            '<b>Error</b>: Cannot mark offer ' +
                                offer +
                                ' as HR processed'
                        );
                        // remove invalid offer(s) from offer list
                        validOffers.splice(validOffers.indexOf(offer), 1);
                    });

                    if (validOffers.length == 0) {
                        return Promise.reject();
                    }
                }, defaultFailure);
            }
        })
        // update valid offers
        .then(() =>
            putHelper('/offers/batch-update', {
                offers: offers,
                hr_status: 'Processed',
            })
        )
        .then(() => {
            appState.setFetchingOffersList(true);
            getOffers()
                .then(offers => {
                    appState.setOffersList(fromJS(offers));
                    appState.setFetchingOffersList(false, true);
                })
                .catch(() => appState.setFetchingOffersList(false));
        });
}

// mark contracts as ddah_accepted
function setDdahAccepted(offers) {
    let validOffers = offers;

    // check which offers can be marked as ddah_accepted
    fetchCheckHelper('/offers/can-ddah-update', { offers: offers })
        .catch(defaultFailure)
        .then(resp => {
            if (resp.status == 404) {
                // some offers cannot be updated
                return resp.json().then(res => {
                    let invalidOffers = res.invalid_offers;
                    invalidOffers.forEach(offer => {
                        appState.alert(
                            '<b>Error</b>: Cannot mark offer ' +
                                offer +
                                ' as DDAH accepted'
                        );
                        // remove invalid offer(s) from offer list
                        validOffers.splice(validOffers.indexOf(offer), 1);
                    });
                    if (validOffers.length == 0) {
                        return Promise.reject();
                    }
                }, defaultFailure);
            }
        })
        // update valid offers
        .then(() =>
            putHelper('/offers/batch-update', {
                offers: validOffers,
                ddah_status: 'Accepted',
            })
        )
        .then(() => {
            appState.setFetchingOffersList(true);
            getOffers()
                .then(offers => {
                    appState.setOffersList(fromJS(offers));
                    appState.setFetchingOffersList(false, true);
                })
                .catch(() => appState.setFetchingOffersList(false));
        });
}

// show the contract for this offer in a new window, as an applicant would see it
function showContractApplicant(offer) {
    window.open('/offers/' + offer + '/pdf');
}

// show the contract for this offer in a new window, as HR would see it
function showContractHr(offer) {
    postHelper('/offers/print', { contracts: [offer], update: false })
        .then(resp => resp.blob())
        .then(blob => {
            let fileURL = URL.createObjectURL(blob);
            let contractWindow = window.open(fileURL);
            contractWindow.onclose = () => URL.revokeObjectURL(fileURL);
        })
        .catch(defaultFailure);
}

// withdraw offers
function withdrawOffers(offers) {
    // create an array of promises for each offer being withdrawn
    // force each promise to resolve so that we can see which failed.
    // foible of all is that it will reject as soon as any promise fails.
    // hence, by resolving each promise we frustrate this laziness.
    // (and also necessitates the loop looking at the responses below)
    let promises = offers.map(offer =>
        postHelper('/offers/' + offer + '/decision/withdraw', {}).then(
            resp => Promise.resolve(resp),
            resp => Promise.resolve(resp)
        )
    );

    //re-examine the responses we squirrelled away above.
    Promise.all(promises).then(responses =>
        responses.forEach(resp => {
            if (resp.ok) {
                appState.setFetchingOffersList(true);
                getOffers()
                    .then(offers => {
                        appState.setOffersList(fromJS(offers));
                        appState.setFetchingOffersList(false, true);
                    })
                    .catch(() => appState.setFetchingOffersList(false));
            } else {
                showMessageInJsonBody(resp);
            }
        })
    );
}

// print contracts
function print(offers) {
    let validOffers = offers;

    // check which contracts can be printed
    let printPromise = fetchCheckHelper('/offers/can-print', {
        contracts: offers,
    })
        .catch(defaultFailure)
        .then(resp => {
            if (resp.status == 404) {
                // some contracts cannot be printed
                return resp.json().then(res => {
                    let invalidOffers = res.invalid_offers;
                    invalidOffers.forEach(offer => {
                        appState.alert(
                            '<b>Error</b>: Cannot print contract for offer ' +
                                offer
                        );
                        // remove invalid offer(s) from offer list
                        validOffers.splice(validOffers.indexOf(offer), 1);
                    });

                    if (validOffers.length == 0) {
                        return Promise.reject();
                    }
                }, defaultFailure);
            }
        })
        // print valid offers
        .then(() =>
            postHelper('/offers/print', {
                contracts: validOffers,
                update: true,
            })
        )
        .then(resp => resp.blob().catch(defaultFailure));

    printPromise.then(blob => {
        let fileURL = URL.createObjectURL(blob);
        let pdfWindow = window.open(fileURL);
        pdfWindow.onclose = () => URL.revokeObjectURL(fileURL);
        pdfWindow.document.onload = pdfWindow.print();
    });

    printPromise.then(() => {
        appState.setFetchingOffersList(true);
        getOffers()
            .then(offers => {
                appState.setOffersList(fromJS(offers));
                appState.setFetchingOffersList(false, true);
            })
            .catch(() => appState.setFetchingOffersList(false));
    });
}

// change session pay
function updateSessionPay(session, pay) {
    putHelper('/sessions/' + session, { pay: pay }).then(
        () => {
            appState.setFetchingSessionsList(true);
            getSessions()
                .then(sessions => {
                    appState.setSessionsList(fromJS(sessions));
                    appState.setFetchingSessionsList(false, true);
                })
                .catch(() => appState.setFetchingSessionsList(false));
        },
        resp => {
            showMessageInJsonBody(resp);
        }
    );
}

export {
    fetchAll,
    importOffers,
    importAssignments,
    sendContracts,
    nag,
    setHrProcessed,
    setDdahAccepted,
    showContractApplicant,
    showContractHr,
    withdrawOffers,
    print,
    updateSessionPay,
};
