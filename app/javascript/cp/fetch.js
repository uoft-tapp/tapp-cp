import React from 'react';
import { appState } from './appState.js';
import * as fetchProc from '../fetchProc.js';
import { fromJS } from 'immutable';

/* General helpers */
const msgFailure = (text) => fetchProc.msgFailure(text, appState);
const respFailure = (resp) => fetchProc.respFailure(resp, appState);

const getHelper = (URL) => fetchProc.getHelper(URL, appState);
const postHelper = (URL, body) => fetchProc.postHelper(URL, body, appState);
const deleteHelper = (URL) => fetchProc.deleteHelper(URL, appState);
const putHelper = (URL, body) => fetchProc.putHelper(URL, body, appState);
const getResource = (route, onSuccess, dataName, mince=true) =>
    fetchProc.getResource(route, onSuccess, dataName, null, mince, appState);

const getSessions = () => getResource('/sessions',
    fetchProc.onFetchSessionsSuccess, 'sessions', false);

const getCategories = () => getResource('/categories',
    fetchProc.onFetchCategoriesSuccess, 'categories', false);

const getDuties = () => getResource('/duties',
    fetchProc.onFetchDutiesSuccess, 'duties', false);

const getTrainings = () => getResource('/trainings',
    fetchProc.onFetchTrainingsSuccess, 'trainings', false);

const getTemplates = user => getResource('/instructors/' + user + '/templates',
    fetchProc.onFetchTemplatesSuccess, 'templates', false);

const getCourses = (user = null) => getResource(
    ((user != null)? '/instructors/' + user + '/positions' : '/positions'),
    fetchProc.onFetchCpCoursesSuccess, 'courses');

const getDdahs = user => getResource(
    user ? '/instructors/' + user + '/ddahs' : '/ddahs',
    fetchProc.onFetchDdahsSuccess, 'ddahs');

const getOffers = (user, role) => {
    let route = '/offers';
    if (user) {
        if (role == 'instructor') {
            route = '/instructors/' + user + '/offers';
            getResource(route, fetchProc.onFetchOffersSuccess, 'offers');
        }
        else if (role == 'applicant') {
            route = '/applicants/' + user + '/offers';
            getResource(route, fetchProc.onFetchOffersSuccess, 'offers', false);
        }
    } else {
        getResource(route, fetchProc.onFetchOffersSuccess, 'offers');
    }
}


const downloadFile = (route) => fetchProc.downloadFile(route, appState);
const importData = (route, data, fetch) => fetchProc.importData(route, data, fetch, appState);
const postData = (route, data, fetch, okay = null, error = null) => fetchProc.postData(route, data, fetch, appState, okay, error);
const putData = (route, data, fetch, okay = null, error = null) => fetchProc.putData(route, data, fetch, appState, okay, error);
const deleteData = (route, fetch, okay = null, error = null) => fetchProc.deleteData(route, fetch, appState, okay, error);

const batchOfferAction = (canRoute, actionRoute, data, msg, fetch, extra = null, put =false) =>
  fetchProc.batchOfferAction(canRoute, actionRoute, data, msg, fetch, extra, put, appState);

const batchDdahAction = (canRoute, actionRoute, data, msg, fetch, extra = null, put=false) =>
  fetchProc.batchDdahAction(canRoute, actionRoute, data, msg, fetch, extra, put, appState);

/* Function to GET all resources */
export const adminFetchAll = () =>  {
    getSessions().then(()=>{
      let sessions = appState.getSessionsList();
      if(!sessions){
        appState.setSessionsList(fromJS([]));
      }
      let session = appState.getSelectedSession();
      if(!session||session=='N/A')
        appState.setLatestSession();
      getOffers();
      getDdahs();
      getCourses();
    });
}

export const instructorFetchAll = () => {
    let user = appState.getCurrentUserName();
    getSessions().then(()=>{
      let sessions = appState.getSessionsList();
      if(!sessions){
        appState.setSessionsList(fromJS([]));
      }
      let session = appState.getSelectedSession();
      if(!session||session=='N/A')
        appState.setLatestSession();
      getOffers(user, 'instructor');
      getDdahs(user);
      getCourses(user);
    });
    getCategories();
    getDuties();
    getTemplates(user);
    getTrainings();
}

export const applicantFetchAll = () => {
    let user = appState.getCurrentUserName();
    getSessions().then(()=> {
        let sessions = appState.getSessionsList();
        if (!sessions) {
            appState.setSessionsList(fromJS([]));
        }
        let session = appState.getSelectedSession();
        if (!session || session == 'N/A')
            appState.setLatestSession();
        getOffers(user, 'applicant');
        // TODO: get DDAH forms if necessary
    });
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
  batchOfferAction('/offers/can-send-contract','/offers/send-contracts',
     offers, {start:'send contract to'}, () => {
      getOffers();
  });
}

// nag applicants about offers
export const nagOffers = (offers) => {
  batchOfferAction('/offers/can-nag', '/offers/nag',
    offers, {start: 'nag'}, ()=>{
      getOffers();
  });
}

// mark contracts as hr_processed
export const setHrProcessed = (offers) => {
    batchOfferAction('/offers/can-hr-update', '/offers/batch-update',
      offers, {start: 'mark offer to', end: 'as HRIS processed'}, ()=>{
        getOffers();
    },{
      hr_status: 'Processed'
    }, true);
}

// mark contracts as ddah_accepted
export const setDdahAccepted = (offers) => {
    batchOfferAction('/offers/can-ddah-update', '/offers/batch-update',
      offers, {start: 'mark offer to', end: 'as DDAH accepted'}, ()=>{
        getDdahs();
        getOffers();
    },{
      ddah_status: 'Accepted'
    }, true);
}

// mark contracts as ddah_approved
export const setDdahApproved = (ddahs, signature) => {
  batchDdahAction('/ddahs/status/can-approve', '/ddahs/status/approve',
    ddahs, {start: 'approve the DDAH form of'}, ()=>{
      getDdahs();
      getOffers();
  }, {
    signature: signature,
  });
}

// show the contract for this offer in a new window, as an applicant would see it
export const showContractApplicant= (offer) => {
    window.open('/offers/' + offer + '/pdf');
}

// show the contract for this offer in a new window, as HR would see it
export const showContractHr=(offer) =>{
    postData('/offers/print', { offers: [parseInt(offer)], update: false, blob: true },null,
    resp=>{
      let fileURL = URL.createObjectURL(resp);
      let contractWindow = window.open(fileURL);
      contractWindow.onclose = () => URL.revokeObjectURL(fileURL);
    },
    resp=>{
      appState.alert(resp.message);
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
    batchOfferAction('/offers/can-print', '/offers/print',
      offers, {start: 'print Contract for'}, resp => {
        getOffers();
        let fileURL = URL.createObjectURL(resp);
        let pdfWindow = window.open(fileURL);
        pdfWindow.onclose = () => URL.revokeObjectURL(fileURL);
        pdfWindow.document.onload = pdfWindow.print();
    },
    {
      update: true,
      blob: true,
    });
}

// change session pay
export const updateSessionPay = (session, pay) =>{
    putHelper('/sessions/' + session, { pay: pay })
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
    batchOfferAction('/offers/can-clear-hris-status', '/offers/clear-hris-status',
      offers, {start: 'clear HRIS status for offer to'}, ()=>{
        getOffers();
    });
}

// set status to accepted
export const setOfferAccepted = (offer) => {
    let fetch = true;
    postData('/offers/' + offer + '/accept', {}, () => {
      if(fetch) getOffers();
    }, null,
    resp => {
      fetch = false;
      appState.alert(resp.message);
    });
}

// set status to unsent and clear other information
export const resetOffer = (offer) => {
    postData('/offers/' + offer + '/reset', {}, () => {
      getOffers();
    });
}

// export all offers from the session to CSV
export const exportOffers = (session) => {
    downloadFile('/export/cp-offers/' + session);
}

export const exportDdahs = (course, session) => {
  (course!='all'&&course)?
    downloadFile('/export/ddahs/' + course):
    downloadFile('/export/session-ddahs/'+ session);
}

// create a new, empty template with this name
export const createTemplate = (name) => {
  let user = appState.getCurrentUserName();
  let fetch = true;
  return postData('/instructors/' + user + '/templates', { name: name },() => {
      if(fetch) getTemplates(user);
    }, null,
    resp => {
      fetch = false;
      msgFailure(res.message);
    })

}

// update an existing template
export const updateTemplate = (id, ddahData) => {
    let user = appState.getCurrentUserName();
    return putData('/instructors/' + user + '/templates/' + id, ddahData, () => {
      getTemplates(user);
    });
}

// create a new template using data from an existing ddah
export const createTemplateFromDdah = (name, ddah) => {
    let user = appState.getCurrentUserName();
    postData('/ddahs/' + ddah + '/new-template', { name: name }, () => {
      getTemplates(user);
    });
}

// create a new, empty ddah for this offer
export const createDdah = (offer) => {
    let user = appState.getCurrentUserName();
    let fetch = true;
    // although the template and ddah models have a relationship in the database, they do not have a
    // relationship in the front-end, and so we do not 'use a template' in this way to create a ddah
    return postData('/instructors/' + user + '/ddahs', { use_template: false, offer_id: offer },()=> {
      if(fetch) getDdahs(user);
    },null,
    res => {
      fetch = false;
      msgFailure(res.message);
    });
}

// update an existing ddah
export const updateDdah = (id, ddahData) => {
    let user = appState.getCurrentUserName();
    return putData('/instructors/' + user + '/ddahs/' + id, ddahData, () => {
      getDdahs(user);
    });
}

// submit an existing ddah for approval
export const submitDdah = (signature, ddah) => {
    let user = appState.getCurrentUserName();

    // this route expects to perform a batch transaction, where the validity of each transaction has
    // already been verified with '/ddahs/status/can-finish'
    // however, in the current interface, only one ddah can be submitted at a time
    postData('/ddahs/status/finish', { signature: signature, ddahs: [ddah] }, () => {
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
  batchDdahAction('/ddahs/can-nag-student', '/ddahs/send-nag-student',
    ddahs, {start: 'send DDAH form to'}, ()=>{
      getDdahs();
  });
}

export const nagInstructors = (offers) => {
  batchOfferAction('/offers/can-nag-instructor', '/offers/send-nag-instructor',
    offers, {
      start: 'nag Instructor about',
      end: 'Check if this course has an instructor.'
    }, ()=>{
      getDdahs();
      getOffers();
  });
}

// send ddah forms
export const sendDdahs = (ddahs) => {
  batchDdahAction('/ddahs/can-send-ddahs', '/ddahs/send-ddahs',
    ddahs, {start: 'send DDAH form to'}, ()=>{
      getDdahs();
      getOffers();
  });
}

// send ddah forms
export const previewDdahs = (ddahs) => {
    batchDdahAction('/ddahs/can-preview', '/ddahs/preview',
      ddahs, {start: 'send DDAH form to'}, resp => {
        let url = URL.createObjectURL(resp);
        window.open(url);
    },{
      blob: true,
    });
}

// get current user role(s) and username
// if we are in development, set the current user name to a special value
export const fetchAuth = () => {
    return fetchProc.setRole(true, appState);
}
