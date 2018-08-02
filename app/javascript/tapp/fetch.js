import React from 'react';
import { appState } from './appState.js';
import * as fetchProc from '../fetchProc.js';

/* General helpers */

const msgFailure = (text) => fetchProc.msgFailure(text, appState);
const respFailure = (resp) => fetchProc.respFailure(resp, appState);

const getHelper = (URL) => fetchProc.getHelper(URL, appState);
const postHelper = (URL, body) => fetchProc.postHelper(URL, body, appState);
const deleteHelper = (URL) => fetchProc.deleteHelper(URL, appState);
const putHelper = (URL, body) => fetchProc.putHelper(URL, body, appState);
const getResource = (route, onSuccess, dataName, setData, mince=true) => 
  fetchProc.getResource(route, onSuccess, dataName, setData, mince, appState);
export const is_valid_instructor = (utorid, appState) => {

    return fetch('/instructors/utorid/' + utorid).then(response => {
                                                            return response.json();
                                                }).catch(function(error) {
                                                    appState.alert('<b>' + init.method + ' ' + URL + '</b> Network error: ' + error);
                                                    return Promise.reject(error);
                                                });
                                                        
}
/* Resource GETters */
const getSessions = () => getResource('/sessions',
  fetchProc.onFetchSessionsSuccess, 'sessions', appState.setSessionsList, false);

const getInstructors = () => getResource('/instructors',
  fetchProc.onFetchInstructorsSuccess, 'instructors', appState.setInstructorsList, false);

const getApplicants = (utorid = null) => !utorid?getResource('/applicants',
  fetchProc.onFetchApplicantsSuccess, 'applicants', appState.setApplicantsList):
  getResource('/instructors/'+utorid+'/applicants', fetchProc.onFetchApplicantsSuccess, 'applicants', appState.setApplicantsList);

// const getApplicants = (selectedRole) => {
//   if (selectedRole == "tapp_admin") {
//     getResource('/applicants', fetchProc.onFetchApplicantsSuccess, 'applicants', appState.setApplicantsList);
//   } else if (selectedRole == "instructor") {
//     getResource('/instructors/'+utorid+'/applicants', fetchProc.onFetchApplicantsSuccess, 'applicants', appState.setApplicantsList);
//   } else {
//     console.error("invalid role");
//   }
//   console.log(selectedRole)
// }

const getApplications = (utorid = null) => !utorid?getResource('/applications',
  fetchProc.onFetchApplicationsSuccess, 'applications',  appState.setApplicationsList):
  getResource('/instructors/'+utorid+'/applications', fetchProc.onFetchApplicationsSuccess, 'applications',  appState.setApplicationsList);

const getCourses = (utorid = null) => !utorid?getResource('/positions',
  fetchProc.onFetchTappCoursesSuccess, 'courses', appState.setCoursesList):
  getResource('/instructors/'+utorid+'/positions', fetchProc.onFetchTappCoursesSuccess, 'courses',  appState.setCoursesList);

const getAssignments = (utorid = null) => !utorid?getResource('/assignments',
  fetchProc.onFetchAssignmentsSuccess, 'assignments', appState.setAssignmentsList):
  getResource('/instructors/'+utorid+'/assignments', fetchProc.onFetchAssignmentsSuccess, 'assignments', appState.setAssignmentsList);

const getInstructorId = (utorid) => {
  fetch('/instructors/utorid/' + utorid)
    .then(response => response.json())
    .then(responseJson => {
      appState.setUserId(responseJson.id);
    })
    .catch(error => console.error(error));
} 
export const downloadFile = (route) => fetchProc.downloadFile(route, appState);
const importData = (route, data, fetch) => fetchProc.importData(route, data, fetch, appState);
const postData = (route, data, fetch, okay = null, error = null) => fetchProc.postData(route, data, fetch, appState, okay, error);
const putData = (route, data, fetch, okay = null, error = null) => fetchProc.putData(route, data, fetch, appState, okay, error);
const deleteData = (route, fetch, okay = null, error = null) => fetchProc.deleteData(route, fetch, appState, okay, error);

/* Function to GET all resources */
export const fetchAll = () => {
  let role = appState.getSelectedUserRole();
  switch(role){
    case 'tapp_admin':
      fetchTappAdminAll();
      break;
    case 'tapp_assistant':
      fetchTappAssistantAll();
      break;
    case 'instructor':
      fetchInstructorAll(true);
      break;
  }
}

const fetchTappAdminAll = () => {
    fetchInstructorAll();
    getInstructors();
}

const fetchTappAssistantAll = () => {
    getSessions().then(()=>{
      let sessions = appState.getSessionsList();
      if(!sessions){
        appState.setSessionsList([]);
      }
    });
}

const fetchInstructorAll = (instructor = false) => {
    getSessions().then(()=>{
      let sessions = appState.getSessionsList();
      if(!sessions){
        appState.setSessionsList([]);
      }
      let session = appState.getSelectedSession();
      if(!session||session=='N/A')
        appState.setLatestSession();
      // getApplicants(appState.getSelectedUserRole());
      if(instructor){
        let utorid = appState.getCurrentUserName();
        getApplicants(utorid);
        getApplications(utorid);
        getAssignments(utorid);
        getCourses(utorid);
        getInstructorId(utorid);
      }
      else{
        getApplicants();
        getApplications();
        getAssignments();
        getCourses();
      }
    });
}
/* Task-specific resource modifiers */

// create a new assignment
export const postAssignment = (applicant, course, hours) => {
    postData('/applicants/' + applicant + '/assignments', {
        position_id: course,
        hours: hours,
    }, () => {
      getAssignments();
    });
}

// remove an assignment
export const deleteAssignment = (applicant, assignment) => {
    deleteData('/applicants/' + applicant + '/assignments/' + assignment, () => {
      getAssignments();
    });
}

// add/update the notes for an applicant
export const noteApplicant = (applicant, notes) => {
    putData('/applicants/' + applicant, { commentary: notes }, () => {
      getApplicants();
    });
}

// add/update the instructor prefs for an application
export const updateInstructorPref = (application, position, pref) => {
    putData('/applications/' + application, { position: position, pref: pref }, () => {
      getApplications();
    });
}

// update the number of hours for an assignment
export const updateAssignmentHours = (applicant, assignment, hours) => {
    putData('/applicants/' + applicant + '/assignments/' + assignment, {
        hours: hours,
    }, () => {
      getAssignments();
    });
}

// update attribute(s) of a course
export const updateCourse = (courseId, data) => {
    putData('/positions/' + courseId, data, () => {
      getCourses();
    });
}

// send CHASS data
export const importChass = (data, year, semester) => {
    importData('/import/chass', {
        chass_json: data,
        year: year,
        semester: semester,
    },
    ()=>{
      fetchAll();
    });
}

// send enrolment data
export const importInstructors = (data) => {
    importData('/import/instructors', { instructor_data: data },
    () => {
        getInstructors();
    });
}

// send enrolment data
export const importEnrolment = (data) => {
    importData('/import/enrolment', { enrolment_data: data },
    () => {
        getCourses();
    });
}

// unlock a single assignment
export const unlockAssignment = (applicant, assignment) => {
    putData('/applicants/' + applicant + '/assignments/' + assignment, {
        export_date: null,
    }, () => {
      getAssignments();
    });
}

// export offers from CHASS (locking the corresponding assignments)
export const exportOffers = (round, session) => {
    downloadFile('/export/chass/sessions/'+session+'/' + round)
    .then(() => getAssignments());
}

export const updateInstructor = (instructor) => {
    putData('/instructors/'+instructor.id, instructor, resp=>{
      getInstructors();
    },
    resp=>{
      alert(resp.message);
      appState.hideInstructorModal();
    },
    resp=>{
      appState.alert(resp.message);
    });
}

export const deleteInstructor = (id) => {
  deleteData('/instructors/'+id, ()=>{
    getInstructors();
  },
  resp=>{
    alert(resp.message);
    appState.hideInstructorModal();
  },
  resp=>{
    appState.alert(resp.message);
  });
}

export const createInstructor = (instructor) => {
    postData('/instructors', instructor, ()=>{
      getInstructors();
    },
    resp=>{
      alert(resp.message);
      appState.hideInstructorModal();
    },
    resp=>{
      appState.alert(resp.message);
    });
}

// get current user role and username
// if we are in development, set the current user name to a special value
export const fetchAuth = () => {
    return fetchProc.setRole(false, appState);
}

export const emailAssignments = (code, round, key) => {
    postData('/email-assignments', {
        position: code,
        round_id: round,
    }, null,
    resp => appState.stopEmailSpinner(key),
    resp => {
        appState.alert("<b>Error</b>: "+resp.message);
        appState.stopEmailSpinner(key);
    });
}
