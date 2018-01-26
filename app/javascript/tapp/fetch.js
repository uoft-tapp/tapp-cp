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

/* Resource GETters */

const getResource = (route, onSuccess, dataName, setData) =>
  getHelper(route)
      .then(resp => (resp.ok ? resp.json().catch(msgFailure) : respFailure))
      .then(onSuccess)
      .then(data => {
          setData(data);
          appState.setFetchingDataList(dataName, false, true);
      })
      .catch(() => appState.setFetchingDataList(dataName, false));


const getSessions = () => getResource(
  '/sessions', fetchProc.onFetchSessionsSuccess, 'sessions', appState.setSessionsList);

const getApplicants = () => getResource(
  '/applicants', fetchProc.onFetchApplicantsSuccess, 'applicants', appState.setApplicantsList);

const getApplications = () => getResource(
  '/applications', fetchProc.onFetchApplicationsSuccess, 'applications',  appState.setApplicationsList);

const getCourses = () => getResource(
  '/positions', fetchProc.onFetchTappCoursesSuccess, 'courses', appState.setCoursesList);

const getAssignments = () => getResource(
  '/assignments', fetchProc.onFetchAssignmentsSuccess, 'assignments', appState.setAssignmentsList);

const getInstructors = () => getResource(
  '/instructors', fetchProc.onFetchInstructorsSuccess, 'instructors', appState.setInstructorsList);


const downloadFile = (route) => fetchProc.downloadFile(route, appState);
const importData = (route, data, fetch) => fetchProc.importData(route, data, fetch, appState);
const putData = (route, data, fetch) => fetchProc.putData(route, data, fetch, appState);
const deleteData = (route, fetch) => fetchProc.deleteData(route, fetch, appState);

/* Function to GET all resources */

export const fetchAll = () => {
    getApplicants();
    getApplications();
    getAssignments();
    getCourses();
    getInstructors();
}

/* Task-specific resource modifiers */

// create a new assignment
export const postAssignment = (applicant, course, hours) => {
    postHelper('/applicants/' + applicant + '/assignments', {
        position_id: course,
        hours: hours,
    })
        .then(resp => (resp.ok ? resp : respFailure))
        .then(() => {
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
export const exportOffers = (round) => {
    downloadFile('/export/chass/' + round)
    .then(() => getAssignments());
}

// get current user role and username
// if we are in development, set the current user name to a special value
export const fetchAuth = () => {
    getHelper('/roles')
        .then(resp => (resp.ok ? resp.json().catch(msgFailure) : respFailure))
        .then(resp => {
            if (resp.development) {
                appState.setCurrentUserRoles(['tapp_admin', 'instructor']);
                // default to tapp_admin as selected user role
                appState.selectUserRole('tapp_admin');
                appState.setCurrentUserName('DEV');
            } else {
                // filter out roles not relevant to this application
                let roles = resp.roles.filter(role => ['tapp_admin', 'instructor'].includes(role));
                appState.setCurrentUserRoles(roles);
                appState.selectUserRole(roles[0]);
                appState.setCurrentUserName(resp.utorid);
            }
        });
}

export const emailAssignments = (code, round, key) => {
    postHelper('/email-assignments', {
        position: code,
        round_id: round,
    }).then(resp => {
      if (resp.ok) {
        return resp.json()
            .then(resp => (appState.stopEmailSpinner(key)));
      }
      else if (resp.status == 404) {
          return resp.json()
            .then(resp => {
                appState.alert(resp.message);
                appState.stopEmailSpinner(key);
            });
      }
      else{
          appState.stopEmailSpinner(key);
          return respFailure(resp);
      }
    });
}
