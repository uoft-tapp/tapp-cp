import React from 'react';
import { fromJS } from 'immutable';
import { appState } from './appState.js';
import * as fetchProc from '../fetchProc.js';

/* General helpers */
const msgFailure = (text) => fetchProc.msgFailure(text, appState);
const respFailure = (resp) => fetchProc.respFailure(resp, appState);

const getHelper = (URL) => fetchProc.getHelper(URL, appState);
const postHelper = (URL, body) => fetchProc.postHelper(URL, body, appState);
const deleteHelper = (URL) => fetchProc.deleteHelper(URL, appState);
const putHelper = (URL, body) => fetchProc.putHelper(URL, body, appState);

/* Resource GETters */
const getResource = (route, onSuccess, dataName) =>
  getHelper(route)
      .then(resp => (resp.ok ? resp.json().catch(msgFailure) : respFailure))
      .then(onSuccess)
      .then(data => {
          appState.set(dataName+'.list', fromJS(data));
          appState.setFetchingDataList(dataName, false, true);
      })
      .catch(() => appState.setFetchingDataList(dataName, false));

const getCategories = () => getResource('/categories',
    fetchProc.onFetchCategoriesSuccess, 'categories');

const getCourses = (user = null) => getResource(
    ((user != null)? '/instructors/' + user + '/positions' : '/positions'),
    fetchProc.onFetchCpCoursesSuccess, 'courses');

const getDdahs = user => getResource(
    user ? '/instructors/' + user + '/ddahs' : '/ddahs',
    fetchProc.onFetchDdahsSuccess, 'ddahs');

const getDuties = () => getResource('/duties',
    fetchProc.onFetchDutiesSuccess, 'duties');

const getOffers = user => getResource(
    user ? '/instructors/' + user + '/offers' : '/offers',
    fetchProc.onFetchOffersSuccess, 'offers');

const getSessions = () => getResource('/sessions',
    fetchProc.onFetchSessionsSuccess, 'sessions');

const getTemplates = user => getResource('/instructors/' + user + '/templates',
    fetchProc.onFetchTemplatesSuccess, 'templates');

const getTrainings = () => getResource('/trainings',
    fetchProc.onFetchTrainingsSuccess, 'trainings');

const downloadFile = (route) => fetchProc.downloadFile(route, appState);
const importData = (route, data, fetch) => fetchProc.importData(route, data, fetch, appState);
const putData = (route, data, fetch) => fetchProc.putData(route, data, fetch, appState);
const deleteData = (route, fetch) => fetchProc.deleteData(route, fetch, appState);

/* Function to GET all resources */
export const adminFetchAll = () =>  {
    getDdahs();
    getOffers();
    getSessions();
    getCourses();
}

export const instructorFetchAll = () => {
    let user = appState.getCurrentUserName();
    getSessions();
    getCategories();
    getCourses(user);
    getDdahs(user);
    getDuties();
    getOffers(user);
    getTemplates();
    getTrainings();
}

// import locked assignments from TAPP
export const importAssignments = () => {
    importData('/import/locked-assignments', {}, () => {
        getOffers();
    });
}
// send CHASS offers data
export const importOffers= (data) => {
    importData('/import/offers', { chass_offers: data }, () => {
        getOffers();
    });
}
export const importDdahs = (data) => {
    importData('/import/ddahs', { ddah_data: data }, () => {
        getOffers();
        getDdahs();
    });
}

// send contracts
export const sendContracts = (offers) => {
    let validOffers = offers;

    // check which contracts can be sent
    postHelper('/offers/can-send-contract', { contracts: offers })
        .then(resp => {
            if (resp.status == 404) {
                // some contracts cannot be sent
                let offersList = appState.getOffersList();

                return resp.json().then(res => {
                    res.invalid_offers.forEach(offer => {
                        appState.alert(
                            '<b>Error</b>: Cannot send contract to ' +
                                offersList.getIn([offer.toString(), 'lastName']) +
                                ', ' +
                                offersList.getIn([offer.toString(), 'firstName']) +
                                ' for ' +
                                offersList.getIn([offer.toString(), 'course'])
                        );
                        // remove invalid offer(s) from offer list
                        validOffers.splice(validOffers.indexOf(offer), 1);
                    });

                    if (validOffers.length == 0) {
                        return Promise.reject();
                    }
                }, msgFailure);
            } else if (!resp.ok) {
                // request failed
                return respFailure(resp);
            }
        })
        // send contracts for valid offers
        .then(() => postHelper('/offers/send-contracts', { offers: validOffers }))
        .then(() => {
          getOffers();
        });
}

// nag applicants about offers
export const nagOffers = (offers) => {
    let validOffers = offers;

    // check which applicants can be nagged
    postHelper('/offers/can-nag', { contracts: offers })
        .then(resp => {
            if (resp.status == 404) {
                // some applicants cannot be nagged
                let offersList = appState.getOffersList();

                return resp.json().then(res => {
                    res.invalid_offers.forEach(offer => {
                        appState.alert(
                            '<b>Error</b>: Cannot nag ' +
                                offersList.getIn([offer.toString(), 'lastName']) +
                                ', ' +
                                offersList.getIn([offer.toString(), 'firstName']) +
                                ' about ' +
                                offersList.getIn([offer.toString(), 'course'])
                        );
                        // remove invalid offer(s) from offer list
                        validOffers.splice(validOffers.indexOf(offer), 1);
                    });

                    if (validOffers.length == 0) {
                        return Promise.reject();
                    }
                }, msgFailure);
            } else if (!resp.ok) {
                // request failed
                return respFailure(resp);
            }
        })
        // nag valid offers
        .then(() => postHelper('/offers/nag', { contracts: validOffers }))
        .then(() => {
          getOffers();
        });
}

// mark contracts as hr_processed
export const setHrProcessed = (offers) => {
    let validOffers = offers;

    // check which offers can be marked as hr_processed
    postHelper('/offers/can-hr-update', { offers: offers })
        .then(resp => {
            if (resp.status == 404) {
                // some offers cannot be updated
                let offersList = appState.getOffersList();

                return resp.json().then(res => {
                    res.invalid_offers.forEach(offer => {
                        appState.alert(
                            '<b>Error</b>: Cannot mark offer to ' +
                                offersList.getIn([offer.toString(), 'lastName']) +
                                ', ' +
                                offersList.getIn([offer.toString(), 'firstName']) +
                                ' for ' +
                                offersList.getIn([offer.toString(), 'course']) +
                                ' as HRIS processed'
                        );
                        // remove invalid offer(s) from offer list
                        validOffers.splice(validOffers.indexOf(offer), 1);
                    });

                    if (validOffers.length == 0) {
                        return Promise.reject();
                    }
                }, msgFailure);
            } else if (!resp.ok) {
                // request failed
                return respFailure(resp);
            }
        })
        // update valid offers
        .then(() =>
            putHelper('/offers/batch-update', {
                offers: validOffers,
                hr_status: 'Processed',
            })
        )
        .then(() => {
          getOffers();
        });
}

// mark contracts as ddah_accepted
export const setDdahAccepted = (offers) => {
    let validOffers = offers;

    // check which offers can be marked as ddah_accepted
    postHelper('/offers/can-ddah-update', { offers: offers })
        .then(resp => {
            if (resp.status == 404) {
                // some offers cannot be updated
                let offersList = appState.getOffersList();

                return resp.json().then(res => {
                    res.invalid_offers.forEach(offer => {
                        appState.alert(
                            '<b>Error</b>: Cannot mark offer to ' +
                                offersList.getIn([offer.toString(), 'lastName']) +
                                ', ' +
                                offersList.getIn([offer.toString(), 'firstName']) +
                                ' for ' +
                                offersList.getIn([offer.toString(), 'course']) +
                                ' as DDAH accepted'
                        );
                        // remove invalid offer(s) from offer list
                        validOffers.splice(validOffers.indexOf(offer), 1);
                    });
                    if (validOffers.length == 0) {
                        return Promise.reject();
                    }
                }, msgFailure);
            } else if (!resp.ok) {
                // request failed
                return respFailure(resp);
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
            getDdahs();
            getOffers();
        });
}

// mark contracts as ddah_approved
export const setDdahApproved = (ddahs, signature) => {
  let validDdahs = ddahs;

  // check which ddahs can be sent
  postHelper('/ddahs/status/can-approve', { ddahs: ddahs })
      .then(resp => {
          if (resp.status == 404) {
              // some ddahs cannot be sent
              let ddahsList = appState.getDdahsList();
              let offersList = appState.getOffersList();

              return resp.json().then(res => {
                  res.invalid_offers.forEach(ddah => {
                      var offer = ddahsList.getIn([ddah.toString(), 'offer']).toString();

                      appState.alert(
                          '<b>Error</b>: Cannot approve the DDAH form of ' +
                              offersList.getIn([offer, 'lastName']) +
                              ', ' +
                              offersList.getIn([offer, 'firstName']) +
                              ' for ' +
                              offersList.getIn([offer, 'course'])
                      );
                      // remove invalid ddah(s) from ddah list
                      validDdahs.splice(validDdahs.indexOf(ddah), 1);
                  });

                  if (validDdahs.length == 0) {
                      return Promise.reject();
                  }
              }, msgFailure);
          } else if (!resp.ok) {
              // request failed
              return respFailure(resp);
          }
      })
      // send contracts for valid ddahs
      .then(() => postHelper('/ddahs/status/approve', { ddahs: validDdahs, signature: signature }))
      .then(() => {
        getDdahs();
        getOffers();
      });
}

// show the contract for this offer in a new window, as an applicant would see it
export const showContractApplicant= (offer) => {
    window.open('/offers/' + offer + '/pdf');
}

// show the contract for this offer in a new window, as HR would see it
export const showContractHr=(offer) =>{
    postHelper('/offers/print', { contracts: [offer], update: false })
        .then(resp => (resp.ok ? resp.blob().catch(msgFailure) : respFailure))
        .then(blob => {
            let fileURL = URL.createObjectURL(blob);
            let contractWindow = window.open(fileURL);
            contractWindow.onclose = () => URL.revokeObjectURL(fileURL);
        });
}

// withdraw offers
export const withdrawOffers=(offers) =>{
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

    // re-examine the responses we squirrelled away above.
    Promise.all(promises).then(responses =>
        responses.forEach(resp => {
            if (resp.type != 'error') {
                // network error did not occur
                if (resp.ok) {
                  getOffers();
                } else {
                    // request failed
                    resp.json().then(resp => appState.alert(resp.message)); // IS THIS REALLY WHAT WE EXPECT?
                }
            }
        })
    );
}

// print contracts
export const print=(offers)=>{
    let validOffers = offers;

    // check which contracts can be printed
    let printPromise = postHelper('/offers/can-print', { contracts: offers })
        .then(resp => {
            if (resp.status == 404) {
                // some contracts cannot be printed
                let offersList = appState.getOffersList();

                return resp.json().then(res => {
                    res.invalid_offers.forEach(offer => {
                        appState.alert(
                            '<b>Error</b>: Cannot print ' +
                                offersList.getIn([offer.toString(), 'course']) +
                                ' contract for ' +
                                offersList.getIn([offer.toString(), 'lastName']) +
                                ', ' +
                                offersList.getIn([offer.toString(), 'firstName'])
                        );
                        // remove invalid offer(s) from offer list
                        validOffers.splice(validOffers.indexOf(offer), 1);
                    });

                    if (validOffers.length == 0) {
                        return Promise.reject();
                    }
                }, msgFailure);
            } else if (!resp.ok) {
                // request failed
                return respFailure(resp);
            }
        })
        // print valid offers
        .then(() =>
            postHelper('/offers/print', {
                contracts: validOffers,
                update: true,
            })
        )
        .then(resp => (resp.ok ? resp.blob().catch(msgFailure) : respFailure));

    printPromise.then(blob => {
        let fileURL = URL.createObjectURL(blob);
        let pdfWindow = window.open(fileURL);
        pdfWindow.onclose = () => URL.revokeObjectURL(fileURL);
        pdfWindow.document.onload = pdfWindow.print();
    });

    printPromise.then(() => {
      getOffers();
    });
}

// change session pay
export const updateSessionPay = (session, pay) =>{
    putData('/sessions/' + session, { pay: pay })
        .then(resp => (resp.ok ? resp : respFailure))
        .then(
            () => {
              getSessions();
            },
            resp => resp.json().then(resp => appState.alert(resp.message)) // IS THIS REALLY WHAT WE EXPECT?
        );
}

// add/update the note for a withdrawn offer
export const noteOffer = (offer, note) => {
    putData('/offers/' + offer, { commentary: note },() => {
      getOffers();
    });
}

// clear HR status
export const clearHrStatus = (offers) =>{
    let validOffers = offers;

    // check which offers can have their HR status cleared
    postHelper('/offers/can-clear-hris-status', { contracts: offers })
        .then(resp => {
            if (resp.status == 404) {
                // some offers cannot be updated
                let offersList = appState.getOffersList();

                return resp.json().then(res => {
                    res.invalid_offers.forEach(offer => {
                        appState.alert(
                            '<b>Error</b>: Cannot clear HRIS status for offer to ' +
                                offersList.getIn([offer.toString(), 'lastName']) +
                                ', ' +
                                offersList.getIn([offer.toString(), 'firstName']) +
                                ' for ' +
                                offersList.getIn([offer.toString(), 'course'])
                        );
                        // remove invalid offer(s) from offer list
                        validOffers.splice(validOffers.indexOf(offer), 1);
                    });
                    if (validOffers.length == 0) {
                        return Promise.reject();
                    }
                }, msgFailure);
            } else if (!resp.ok) {
                // request failed
                return respFailure(resp);
            }
        })
        // update valid offers
        .then(() => postHelper('/offers/clear-hris-status', { contracts: validOffers }))
        .then(() => {
          getOffers();
        });
}

// set status to accepted
export const setOfferAccepted = (offer) => {
    postHelper('/offers/' + offer + '/accept', {})
        .then(resp => {
            if (resp.status == 404) {
                return resp
                    .json()
                    .then(resp => appState.alert(resp.message))
                    .then(Promise.reject);
            } else if (!resp.ok) {
                return respFailure(resp);
            }
        })
        .then(() => {
          getOffers();
        });
}

// set status to unsent and clear other information
export const resetOffer = (offer) => {
    postHelper('/offers/' + offer + '/reset', {})
        .then(resp => (resp.ok ? resp : respFailure))
        .then(() => {
          getOffers();
        });
}

// export all offers from the session to CSV
export const exportOffers = (session) => {
    downloadFile('/export/cp-offers/' + session);
}

export const exportDdahs = (course, session) => {
  (course!='all')?
  downloadFile('/export/ddahs/' + course):
  downloadFile('/export/session-ddahs/'+ session);
}

// create a new, empty template with this name
export const createTemplate = (name) => {
    let user = appState.getCurrentUserName();

    return postHelper('/instructors/' + user + '/templates', { name: name })
        .then(resp => {
            if (resp.ok) {
                return resp.json().catch(msgFailure);
            }
            if (resp.status == 404) {
                return resp
                    .json()
                    .catch(msgFailure)
                    .then(res => msgFailure(res.message));
            }
            return respFailure(resp);
        })
        .then(resp => {
          getTemplates(user);
        });
}

// update an existing template
export const updateTemplate = (id, ddahData) => {
    let user = appState.getCurrentUserName();
    putData('/instructors/' + user + '/templates/' + id, ddahData, () => {
      getTemplates(user);
    });
}

// create a new template using data from an existing ddah
export const createTemplateFromDdah = (name, ddah) => {
    let user = appState.getCurrentUserName();

    postHelper('/ddahs/' + ddah + '/new-template', { name: name })
        .then(resp => (resp.ok ? resp : respFailure))
        .then(() => {
          getTemplates(user);
        });
}

// create a new, empty ddah for this offer
export const createDdah = (offer) => {
    let user = appState.getCurrentUserName();

    // although the template and ddah models have a relationship in the database, they do not have a
    // relationship in the front-end, and so we do not 'use a template' in this way to create a ddah
    return postHelper('/instructors/' + user + '/ddahs', { use_template: false, offer_id: offer })
        .then(resp => {
            if (resp.ok) {
                return resp.json().catch(msgFailure);
            }
            if (resp.status == 404) {
                return resp
                    .json()
                    .catch(msgFailure)
                    .then(res => msgFailure(res.message));
            }
            return respFailure(resp);
        })
        .then(resp => {
          getDdahs(user);
        });
}

// update an existing ddah
export const updateDdah = (id, ddahData) => {
    let user = appState.getCurrentUserName();
    putData('/instructors/' + user + '/ddahs/' + id, ddahData, () => {
      getDdahs(user);
    });
}

// submit an existing ddah for approval
export const submitDdah = (signature, ddah) => {
    let user = appState.getCurrentUserName();

    // this route expects to perform a batch transaction, where the validity of each transaction has
    // already been verified with '/ddahs/status/can-finish'
    // however, in the current interface, only one ddah can be submitted at a time
    postHelper('/ddahs/status/finish', { signature: signature, ddahs: [ddah] })
        .then(resp => (resp.ok ? resp : respFailure))
        .then(() => {
            getDdahs(user);
            getOffers(user);
        });
}

// open a PDF version of the ddah
export const previewDdah = (ddah) => {
    window.open('/ddahs/' + ddah + '/pdf');
}

// nag applicants about ddahs
export const nagApplicantDdahs = (ddahs) => {
    let validDdahs = ddahs;

    // check which ddahs can be sent
    postHelper('/ddahs/can-nag-student', { ddahs: ddahs })
        .then(resp => {
            if (resp.status == 404) {
                // some ddahs cannot be sent
                let ddahsList = appState.getDdahsList();
                let offersList = appState.getOffersList();

                return resp.json().then(res => {
                    res.invalid_offers.forEach(ddah => {
                        var offer = ddahsList.getIn([ddah.toString(), 'offer']).toString();

                        appState.alert(
                            '<b>Error</b>: Cannot send DDAH form to ' +
                                offersList.getIn([offer, 'lastName']) +
                                ', ' +
                                offersList.getIn([offer, 'firstName']) +
                                ' for ' +
                                offersList.getIn([offer, 'course'])
                        );
                        // remove invalid ddah(s) from ddah list
                        validDdahs.splice(validDdahs.indexOf(ddah), 1);
                    });

                    if (validDdahs.length == 0) {
                        return Promise.reject();
                    }
                }, msgFailure);
            } else if (!resp.ok) {
                // request failed
                return respFailure(resp);
            }
        })
        // send contracts for valid ddahs
        .then(() => postHelper('/ddahs/send-nag-student', { ddahs: validDdahs }))
        .then(() => {
          getDdahs();
        });
}

export const nagInstructors = (offers) => {
  let validOffers = offers;

  // check which applicants can be nagged
  postHelper('/offers/can-nag-instructor', { offers: offers })
      .then(resp => {
          if (resp.status == 404) {
              // some applicants cannot be nagged
              let offersList = appState.getOffersList();

              return resp.json().then(res => {
                  res.invalid_offers.forEach(offer => {
                      appState.alert(
                          '<b>Error</b>: Cannot nag Instructor for ' +
                          offersList.getIn([offer.toString(), 'lastName']) +
                          ', ' +
                          offersList.getIn([offer.toString(), 'firstName']) +
                          ' about ' +
                          offersList.getIn([offer.toString(), 'course']) +
                          '. Check if this position has an instructor.'
                      );
                      // remove invalid offer(s) from offer list
                      validOffers.splice(validOffers.indexOf(offer), 1);
                  });

                  if (validOffers.length == 0) {
                      return Promise.reject();
                  }
              }, msgFailure);
          } else if (!resp.ok) {
              // request failed
              return respFailure(resp);
          }
      })
      // nag valid offers
      .then(() => postHelper('/offers/send-nag-instructor', { offers: validOffers }))
      .then(() => {
        getDdahs();
        getOffers();
      });
}

// send ddah forms
export const sendDdahs = (ddahs) => {
    let validDdahs = ddahs;

    // check which ddahs can be sent
    postHelper('/ddahs/can-send-ddahs', { ddahs: ddahs })
        .then(resp => {
            if (resp.status == 404) {
                // some ddahs cannot be sent
                let ddahsList = appState.getDdahsList();
                let offersList = appState.getOffersList();

                return resp.json().then(res => {
                    res.invalid_offers.forEach(ddah => {
                        var offer = ddahsList.getIn([ddah.toString(), 'offer']).toString();

                        appState.alert(
                            '<b>Error</b>: Cannot send DDAH form to ' +
                                offersList.getIn([offer, 'lastName']) +
                                ', ' +
                                offersList.getIn([offer, 'firstName']) +
                                ' for ' +
                                offersList.getIn([offer, 'course'])
                        );
                        // remove invalid ddah(s) from ddah list
                        validDdahs.splice(validDdahs.indexOf(ddah), 1);
                    });

                    if (validDdahs.length == 0) {
                        return Promise.reject();
                    }
                }, msgFailure);
            } else if (!resp.ok) {
                // request failed
                return respFailure(resp);
            }
        })
        // send contracts for valid ddahs
        .then(() => postHelper('/ddahs/send-ddahs', { ddahs: validDdahs }))
        .then(() => {
          getDdahs();
        });
}

// send ddah forms
export const previewDdahs = (ddahs) => {
    let validDdahs = ddahs;
    let filename = "";

    // check which ddahs can be sent
    postHelper('/ddahs/can-preview', { ddahs: ddahs })
        .then(resp => {
            if (resp.status == 404) {
                // some ddahs cannot be sent
                let ddahsList = appState.getDdahsList();
                let offersList = appState.getOffersList();

                return resp.json().then(res => {
                    res.invalid_offers.forEach(ddah => {
                        var offer = ddahsList.getIn([ddah.toString(), 'offer']).toString();

                        appState.alert(
                            '<b>Error</b>: Cannot send DDAH form to ' +
                                offersList.getIn([offer, 'lastName']) +
                                ', ' +
                                offersList.getIn([offer, 'firstName']) +
                                ' for ' +
                                offersList.getIn([offer, 'course'])
                        );
                        // remove invalid ddah(s) from ddah list
                        validDdahs.splice(validDdahs.indexOf(ddah), 1);
                    });

                    if (validDdahs.length == 0) {
                        return Promise.reject();
                    }
                }, msgFailure);
            } else if (!resp.ok) {
                // request failed
                return respFailure(resp);
            }
        })
        // preview pdf for valid ddahs
        .then(() => postHelper('/ddahs/preview', { ddahs: validDdahs }))
        .then(resp => {
            // extract the filename from the response headers
            filename = resp.headers.get('Content-Disposition').match(/filename="(.*)"/)[1];
            // parse the response body as a blob
            return resp.blob();
        })
        // create a URL for the object body of the response
        .then(blob => URL.createObjectURL(blob))
        .then(url => {
            window.open(url);
        });
}

// get current user role(s) and username
// if we are in development, set the current user name to a special value
export const fetchAuth = () => {
    return getHelper('/roles')
        .then(resp => (resp.ok ? resp.json().catch(msgFailure) : respFailure))
        .then(resp => {
            if (resp.development) {
                appState.setCurrentUserRoles(['cp_admin', 'hr_assistant', 'instructor']);
                // default to cp_admin as selected user role
                appState.selectUserRole('cp_admin');
                appState.setCurrentUserName('zaleskim');
                appState.setTaCoordinator(resp.ta_coord);
            } else {
                // filter out roles not relevant to this application
                let roles = resp.roles.filter(role =>
                    ['cp_admin', 'hr_assistant', 'instructor'].includes(role)
                );
                appState.setCurrentUserRoles(roles);
                appState.selectUserRole(roles[0]);
                appState.setCurrentUserName(resp.utorid);
                appState.setTaCoordinator(resp.ta_coord);
            }
        });
}
